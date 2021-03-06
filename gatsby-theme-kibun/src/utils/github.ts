import { Octokit } from '@octokit/core';
import { RequestError } from '@octokit/request-error';
import {
  restEndpointMethods,
  RestEndpointMethodTypes,
} from '@octokit/plugin-rest-endpoint-methods';

import { sleepAsync } from './sleepAsync';
import cloneDeep from 'lodash/cloneDeep';

async function fetchNoCache(
  url: RequestInfo,
  options?: RequestInit & { timeout?: number },
): Promise<Response> {
  const timeout = options?.timeout || 5000;
  let newOptions = cloneDeep(options);
  if (newOptions == null) {
    newOptions = {};
  }
  newOptions.cache = 'no-cache';

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, {
    ...newOptions,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

const MyOctokit = Octokit.plugin(restEndpointMethods);

interface repoInfo {
  githubUrl?: string;
  project: string;
  branch: string;
  basePath: string;
}
interface authInfo {
  token: string;
}

export class githubRepoOperator {
  private readonly owner: string;
  private readonly repo: string;
  private readonly repoInfo: { owner: string; repo: string };
  private readonly mainBranch: string;
  private readonly basePath: string;

  private readonly auth: authInfo;
  private readonly octokit: InstanceType<typeof MyOctokit>;

  constructor(repo: repoInfo, auth: authInfo) {
    const tmp = repo.project.split('/');
    if (tmp.length !== 2) {
      throw Error(`invaid project name: project=${repo.project}`);
    }
    this.owner = tmp[0];
    this.repo = tmp[1];
    this.repoInfo = {
      owner: this.owner,
      repo: this.repo,
    };
    this.mainBranch = repo.branch;
    this.basePath = repo.basePath;
    if (this.basePath.startsWith('/')) {
      this.basePath = this.basePath.substring(1);
    }
    if (this.basePath.endsWith('/')) {
      this.basePath = this.basePath.substring(0, this.basePath.length - 1);
    }
    this.auth = auth;

    const options: Record<string, any> = {
      auth: auth.token,
      request: {
        fetch: fetchNoCache,
      },
    };
    if (repo.githubUrl != null) {
      options['baseUrl'] = new URL('/api/v3', repo.githubUrl).toString();
    }
    this.octokit = new MyOctokit(options);
  }

  async getFileContent(path: string): Promise<string> {
    const ref = await this.getMainRef();
    const commit = await this.getCommit(ref.data.object.sha);

    const pagePathElements = joinPath(this.basePath, path).split('/');
    const dirPathElements = pagePathElements.slice(0, pagePathElements.length - 1);
    const filename = pagePathElements[pagePathElements.length - 1];

    const tree = await this.getTree(commit.data.tree.sha, dirPathElements);
    const blobNode = tree.data.tree.find((node) => node.type === 'blob' && node.path === filename);
    if (blobNode == null) {
      throw Error(`cannot find blob object: filename=${filename}`);
    }
    const blob = await this.octokit.rest.git.getBlob({
      ...this.repoInfo,
      file_sha: blobNode.sha!,
    });

    return b64_atob(blob.data.content);
  }

  async updateMarkdown(path: string, content: string): Promise<null> {
    const newBlob = await this.octokit.rest.git.createBlob({
      ...this.repoInfo,
      content: b64_btoa(content),
      encoding: 'base64',
    });
    const newBlobHash = newBlob.data.sha;
    const topicBranchName = createTopicBranchName();
    this.updateMarkdownOnMain(path, topicBranchName, newBlobHash);

    await this.octokit.rest.git.deleteRef({
      ...this.repoInfo,
      ref: `heads/${topicBranchName}`,
    });

    return null;
  }

  private async updateMarkdownOnMain(
    path: string,
    topicBranchName: string,
    blobHash: string,
  ): Promise<null> {
    let previousRefSha: string | undefined;
    let pullNumber: number | undefined;
    let merged = false;
    let error = undefined;
    for (let i = 0; i <= 3; i++) {
      const ref = await this.getMainRef();
      if (previousRefSha != null && previousRefSha === ref.data.object.sha) {
        error = Error('sha1 not changed');
        await sleepAsync(2000);
        continue;
      }
      previousRefSha = ref.data.object.sha;
      const filepath = joinPath(this.basePath, path);

      const newCommit = await this.createNewCommitOnRef(filepath, blobHash, ref.data.object.sha);
      if (i === 0) {
        await this.octokit.rest.git.createRef({
          ...this.repoInfo,
          ref: `refs/heads/${topicBranchName}`,
          sha: newCommit.data.sha,
        });
      } else {
        await this.octokit.rest.git.updateRef({
          ...this.repoInfo,
          ref: `heads/${topicBranchName}`,
          sha: newCommit.data.sha,
          force: true,
        });
      }

      if (pullNumber == null) {
        const pullReq = await this.octokit.rest.pulls.create({
          ...this.repoInfo,
          title: `update ${filepath}`,
          head: topicBranchName,
          base: this.mainBranch,
        });
        pullNumber = pullReq.data.number;
      }

      const isMergeable = await this.isPullMergenable(pullNumber);
      if (!isMergeable) {
        error = Error('pull request is not mergeable');
        await sleepAsync(2000);
        continue;
      }

      try {
        await this.octokit.rest.pulls.merge({
          ...this.repoInfo,
          pull_number: pullNumber,
        });
        merged = true;
        break;
      } catch (e) {
        if (e instanceof RequestError) {
          if (e.status != null && (e.status === 409 || e.status === 405)) {
            error = e;
            await sleepAsync(2000);
            continue;
          }
        }
        throw e;
      }
    }
    if (!merged) {
      if (error == null) {
        error = Error('failed to check merginability by unknown reason');
      }
      throw error;
    }
    return null;
  }

  private async createNewCommitOnRef(
    filepath: string,
    blobHash: string,
    refHash: string,
  ): Promise<RestEndpointMethodTypes['git']['createCommit']['response']> {
    const commit = await this.getCommit(refHash);

    const updatedTree = await this.octokit.rest.git.createTree({
      ...this.repoInfo,
      base_tree: commit.data.tree.sha,
      tree: [{ path: filepath, mode: '100644', type: 'blob', sha: blobHash }],
    });

    return await this.octokit.rest.git.createCommit({
      ...this.repoInfo,
      message: 'update markdown',
      parents: [commit.data.sha],
      tree: updatedTree.data.sha,
    });
  }

  private async getMainRef(): Promise<RestEndpointMethodTypes['git']['getRef']['response']> {
    return await this.octokit.rest.git.getRef({
      ...this.repoInfo,
      ref: `heads/${this.mainBranch}`,
    });
  }

  private async getCommit(
    commit_sha: string,
  ): Promise<RestEndpointMethodTypes['git']['getCommit']['response']> {
    const commit = await this.octokit.rest.git.getCommit({
      ...this.repoInfo,
      commit_sha: commit_sha,
    });
    return commit;
  }

  private async getTree(
    root_tree_sha: string,
    paths: Array<string>,
  ): Promise<RestEndpointMethodTypes['git']['getTree']['response']> {
    const tree = await this.octokit.rest.git.getTree({
      ...this.repoInfo,
      tree_sha: root_tree_sha,
    });
    let tmpTree = tree;
    for (const path of paths) {
      const pathNode = tmpTree.data.tree.find((node) => node.type === 'tree' && node.path === path);
      if (pathNode == null) {
        throw Error(`cannot find tree object: path=${path}`);
      }
      tmpTree = await this.octokit.rest.git.getTree({
        ...this.repoInfo,
        tree_sha: pathNode.sha!,
      });
    }
    return tmpTree;
  }

  private async isPullMergenable(pullNumber: number): Promise<boolean> {
    const retries = 5;
    const interval_ms = 1000;
    for (let i = 0; i <= retries; i++) {
      const pull = await this.octokit.rest.pulls.get({
        ...this.repoInfo,
        pull_number: pullNumber,
      });
      if (pull.data.mergeable != null) {
        return pull.data.mergeable;
      }
      sleepAsync(interval_ms);
    }

    throw Error('cannot get mergeable property');
  }
}

function createTopicBranchName(): string {
  const now = new Date();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomName = [...Array(16).keys()]
    .map((_i) => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join('');
  return `update-${now.getFullYear()}${now.getMonth()}${now.getDate()}-${randomName}`;
}

function joinPath(base: string, path: string): string {
  return base ? base + '/' + path : path;
}

function b64_atob(content: string): string {
  return decodeURIComponent(escape(window.atob(content)));
}

function b64_btoa(data: string): string {
  return window.btoa(unescape(encodeURIComponent(data)));
}
