import { rest } from 'msw';

export const handlers = [
  rest.get('https://api.github.com/repos/:owner/:repo/git/ref/*', () => ({
    ref: 'refs/heads/featureA',
    node_id: 'MDM6UmVmcmVmcy9oZWFkcy9mZWF0dXJlQQ==',
    url: 'https://api.github.com/repos/octocat/Hello-World/git/refs/heads/featureA',
    object: {
      type: 'commit',
      sha: 'aa218f56b14c9653891f9e74264a383fa43fefbd',
      url: 'https://api.github.com/repos/octocat/Hello-World/git/commits/aa218f56b14c9653891f9e74264a383fa43fefbd',
    },
  })),
];
