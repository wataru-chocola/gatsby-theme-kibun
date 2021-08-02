import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type severityType = 'error' | 'info' | 'success' | 'warning';
type snackMessage = {
  on: boolean;
  message: string;
  severity: severityType;
  autoHideDuration: number | null;
};

const snackMessageSlice = createSlice({
  name: 'snackMessage',
  initialState: null as snackMessage | null,
  reducers: {
    setMessage(
      state,
      action: PayloadAction<{
        message: string;
        severity?: severityType;
        autoHideDuration?: number;
      }>,
    ) {
      return {
        on: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
        autoHideDuration: action.payload.autoHideDuration || null,
      };
    },
    hideMessage(state, action) {
      if (state != null) {
        state.on = false;
      }
      return state;
    },
    removeMessage(state, action) {
      return null;
    },
  },
});

export const snackMessageReducer = snackMessageSlice.reducer;
export const snackMessageActions = snackMessageSlice.actions;
