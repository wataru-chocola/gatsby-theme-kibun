import { RootState } from './store';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectGithubUpdateMarkdownState = (state: RootState) => state.githubAPI.update.state;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectGithubUpdateMarkdownError = (state: RootState) => state.githubAPI.update.error;
