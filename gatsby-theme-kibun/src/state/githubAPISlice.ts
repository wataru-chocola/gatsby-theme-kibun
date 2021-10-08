import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { githubRepoOperator } from '../utils/github';

import { sleepAsync } from '../utils/sleepAsync';
import { splitFrontmatter } from '../utils/markdown/markdownParser';

import { Octokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';

const MyOctokit = Octokit.plugin(restEndpointMethods);

type apiState = {
  state: 'pending' | 'progress' | 'succeeded' | 'failed';
  error?: string;
};

type githubAPIState = {
  update: apiState;
  getMarkdown: apiState & {
    frontmatter?: string;
    markdown?: string;
  };
};

const login = createAsyncThunk('githubAPI/login', async (token: string, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const octokit = new MyOctokit({ auth: token });

  await octokit.rest.users.getAuthenticated();
  dispatch({ type: 'githubAPI/login/succeeded' });
  await sleepAsync(1000);
  return token;
});

const updateMarkdown = createAsyncThunk(
  'githubAPI/update',
  async (
    payload: { github: githubRepoOperator; path: string; markdown: string; frontmatter: string },
    _thunkAPI,
  ) => {
    const github = payload.github;
    const newContent = `---\n${payload.frontmatter}\n---\n${payload.markdown}`;
    await github.updateMarkdown(payload.path, newContent);
  },
);

const getMarkdown = createAsyncThunk(
  'githubAPI/getFile',
  async (payload: { github: githubRepoOperator; path: string }, _thunkAPI) => {
    const github = payload.github;
    const content = await github.getFileContent(payload.path);
    const [frontmatter, markdown] = splitFrontmatter(content);
    return [frontmatter, markdown];
  },
);

const githubAPISlice = createSlice({
  name: 'githubAPI',
  initialState: {
    update: { state: 'pending' },
    getMarkdown: { state: 'pending' },
  } as githubAPIState,
  reducers: {},
  extraReducers: {
    [updateMarkdown.pending.type]: (state, _action) => {
      state.update.state = 'progress';
    },
    [updateMarkdown.fulfilled.type]: (state, _action) => {
      state.update.state = 'succeeded';
    },
    [updateMarkdown.rejected.type]: (state, action) => {
      state.update.state = 'failed';
      state.update.error = action.error.message;
    },

    [getMarkdown.pending.type]: (state, _action) => {
      state.getMarkdown.state = 'progress';
    },
    [getMarkdown.fulfilled.type]: (state, action) => {
      state.getMarkdown.state = 'succeeded';
      const [frontmatter, markdown] = action.payload;
      state.getMarkdown.frontmatter = frontmatter;
      state.getMarkdown.markdown = markdown;
    },
    [getMarkdown.rejected.type]: (state, action) => {
      state.getMarkdown.state = 'failed';
      state.getMarkdown.error = action.error.message;
    },
  },
});

export const githubAPIReducer = githubAPISlice.reducer;
export const githubAPIActions = Object.assign({}, githubAPISlice.actions, {
  login,
  updateMarkdown,
  getMarkdown,
});
