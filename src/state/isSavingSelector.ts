import { RootState } from './store';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectIsSaving = (state: RootState) => state.isSaving;
