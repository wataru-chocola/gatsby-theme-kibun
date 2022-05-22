import React from 'react';

import { useAppSelector, useAppDispatch } from '../../state/hooks';
import {
  selectGithubUpdateMarkdownError,
  selectGithubUpdateMarkdownState,
  selectGithubGetMarkdownState,
  selectGithubGetMarkdownError,
} from '../../state/githubAPISelector';
import { snackMessageActions } from '../../state/snackMessageSlice';

export const EditBoxMonitor: React.VFC = () => {
  const dispatch = useAppDispatch();

  const updatingState = useAppSelector((state) => selectGithubUpdateMarkdownState(state));
  const updatingError = useAppSelector((state) => selectGithubUpdateMarkdownError(state));
  const gettingState = useAppSelector((state) => selectGithubGetMarkdownState(state));
  const gettingError = useAppSelector((state) => selectGithubGetMarkdownError(state));

  React.useEffect(() => {
    switch (updatingState) {
      case 'progress':
        dispatch(snackMessageActions.setMessage({ message: 'saving changes' }));
        break;
      case 'succeeded':
        dispatch(snackMessageActions.hideMessage({}));
        dispatch(
          snackMessageActions.setMessage({
            message: 'success!',
            severity: 'success',
            autoHideDuration: 2000,
          }),
        );
        break;
      case 'failed':
        console.error(updatingError);
        dispatch(snackMessageActions.hideMessage({}));
        dispatch(
          snackMessageActions.addErrorMessage(
            updatingError,
            3000,
            'failed to update github content: ',
          ),
        );
    }
  }, [dispatch, updatingState, updatingError]);

  React.useEffect(() => {
    switch (gettingState) {
      case 'failed':
        console.error(gettingError);
        dispatch(snackMessageActions.hideMessage({}));
        dispatch(
          snackMessageActions.addErrorMessage(
            gettingError,
            3000,
            'failed to fetch content source: ',
          ),
        );
    }
  }, [dispatch, gettingState, gettingError]);

  return null;
};
EditBoxMonitor.displayName = 'EditBoxMonitor';
