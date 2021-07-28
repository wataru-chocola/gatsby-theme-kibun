import { Octokit } from '@octokit/core';
import {
  restEndpointMethods,
  RestEndpointMethodTypes,
} from '@octokit/plugin-rest-endpoint-methods';

import { useStaticQuery, graphql } from 'gatsby';

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
    this.mainBranch = repo.branch;
    this.basePath = repo.basePath;
    if (this.basePath.startsWith('/')) {
      this.basePath = this.basePath.substring(1);
    }
    if (this.basePath.endsWith('/')) {
      this.basePath = this.basePath.substring(0, this.basePath.length - 1);
    }
    this.auth = auth;

    const options: Record<string, any> = { auth: auth.token };
    if (repo.githubUrl != null) {
      options['baseUrl'] = new URL('/api/v3', repo.githubUrl).toString();
    }
    this.octokit = new MyOctokit(options);
  }

  async getFileContent(path: string): Promise<string> {
    const ref = await this.octokit.rest.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.mainBranch}`,
    });

    const commit = await this.octokit.rest.git.getCommit({
      owner: this.owner,
      repo: this.repo,
      commit_sha: ref.data.object.sha,
    });

    const tmpPaths = path.split('/');
    const paths = this.basePath.split('/').concat(tmpPaths.slice(0, tmpPaths.length - 1));
    const filename = tmpPaths[tmpPaths.length - 1];

    const tree = await this.getTree(commit.data.tree.sha, paths);
    const blobNode = tree.data.tree.find((node) => node.type === 'blob' && node.path === filename);
    if (blobNode == null) {
      throw Error(`cannot find blob object: filename=${filename}`);
    }
    const blob = await this.octokit.rest.git.getBlob({
      owner: this.owner,
      repo: this.repo,
      file_sha: blobNode.sha!,
    });

    return decodeURIComponent(escape(window.atob(blob.data.content)));
  }

  async updateMarkdown(content: string, path: string): Promise<null> {
    return null;
  }

  private async getTree(
    root_tree_sha: string,
    paths: Array<string>,
  ): Promise<RestEndpointMethodTypes['git']['getTree']['response']> {
    const tree = await this.octokit.rest.git.getTree({
      owner: this.owner,
      repo: this.repo,
      tree_sha: root_tree_sha,
    });
    let tmpTree = tree;
    for (const path of paths) {
      const pathNode = tmpTree.data.tree.find((node) => node.type === 'tree' && node.path === path);
      if (pathNode == null) {
        throw Error(`cannot find tree object: path=${path}`);
      }
      tmpTree = await this.octokit.rest.git.getTree({
        owner: this.owner,
        repo: this.repo,
        tree_sha: pathNode.sha!,
      });
    }
    return tmpTree;
  }
}

interface githubRepositoryInfo {
  githubUrl?: string;
  project: string;
  branch: string;
  rootDir: string;
}
export function useGithubRepositoryInfo(): githubRepositoryInfo {
  const data = useStaticQuery<GatsbyTypes.githubRepositryQuery>(
    graphql`
      query githubRepositry {
        site {
          siteMetadata {
            githubRepository {
              project
              branch
              rootDir
            }
          }
        }
      }
    `,
  );
  const project = data.site?.siteMetadata?.githubRepository?.project;
  if (project == null) {
    throw Error('must specify githubRepositry.project in your config');
  }

  return {
    project: project,
    branch: data.site?.siteMetadata?.githubRepository?.branch || 'main',
    rootDir: data.site?.siteMetadata?.githubRepository?.rootDir || '',
  };
}
