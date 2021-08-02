import { createSlice } from '@reduxjs/toolkit';

const isSavingSlice = createSlice({
  name: 'isSaving',
  initialState: false,
  reducers: {
    startSaving(state, action) {
      return true;
    },
    doneSaving(state, action) {
      return false;
    },
  },
});

export const isSavingReducer = isSavingSlice.reducer;
export const isSavingActions = isSavingSlice.actions;
