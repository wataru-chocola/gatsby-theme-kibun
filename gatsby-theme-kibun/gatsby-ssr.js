import { wrapperWithStore } from './src/state/store';
import wrapWithThemeProvider from './src/theme';

export const wrapRootElement = ({ element }) => wrapWithThemeProvider(wrapperWithStore(element));
