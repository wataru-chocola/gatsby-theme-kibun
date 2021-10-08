import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { githubRepoOperator } from '../utils/github';

type apiState = {
  state: 'pending' | 'progress' | 'succeeded' | 'failed';
  error?: string;
};

type githubAPIState = {
  update: apiState;
};

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

const githubAPISlice = createSlice({
  name: 'githubAPI',
  initialState: { update: { state: 'pending' } } as githubAPIState,
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
  },
});

export const githubAPIReducer = githubAPISlice.reducer;
export const githubAPIActions = Object.assign({}, githubAPISlice.actions, {
  updateMarkdown,
});
