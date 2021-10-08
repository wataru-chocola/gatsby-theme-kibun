import React from 'react';

import { selectToken } from '../state/loginSelector';
import { useAppSelector } from '../state/hooks';

import { githubRepoOperator } from '../utils/github';
import { useGithubRepositoryInfo } from '../hooks/useGithubRepositoryInfo';

export function useGithubRepoOperator(): githubRepoOperator {
  const token = useAppSelector((state) => selectToken(state));
  const repoInfo = useGithubRepositoryInfo();

  const github = React.useMemo(
    () =>
      new githubRepoOperator(
        {
          project: repoInfo.project,
          branch: repoInfo.branch,
          basePath: repoInfo.rootDir,
        },
        { token: token as string },
      ),
    [repoInfo, token],
  );
  return github;
}
