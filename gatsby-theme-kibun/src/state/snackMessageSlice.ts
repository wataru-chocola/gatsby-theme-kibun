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
    addErrorMessage: {
      reducer(
        state,
        action: PayloadAction<{
          message: string;
          autoHideDuration?: number;
        }>,
      ) {
        return {
          on: true,
          message: action.payload.message,
          severity: 'error',
          autoHideDuration: action.payload.autoHideDuration || null,
        };
      },
      prepare(e: unknown, autoHideDuration?: number, msg_prefix?: string) {
        let emsg = msg_prefix ? msg_prefix : '';
        emsg += e instanceof Error ? e.message : typeof e === 'string' ? e : '';
        return { payload: { message: emsg, autoHideDuration: autoHideDuration } };
      },
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
