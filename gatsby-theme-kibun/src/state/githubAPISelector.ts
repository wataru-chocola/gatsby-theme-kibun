import { RootState } from './store';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectGithubUpdateMarkdownState = (state: RootState) => state.githubAPI.update.state;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectGithubUpdateMarkdownError = (state: RootState) => state.githubAPI.update.error;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectGithubGetMarkdownState = (state: RootState) => state.githubAPI.getMarkdown.state;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectGithubGetMarkdownError = (state: RootState) => state.githubAPI.getMarkdown.error;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectGithubGetMarkdownResult = (state: RootState) =>
  state.githubAPI.getMarkdown.markdown;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectGithubGetMarkdownFrontmatter = (state: RootState) =>
  state.githubAPI.getMarkdown.frontmatter;
