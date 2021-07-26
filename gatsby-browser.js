import 'prismjs/themes/prism-okaidia.css';
import { wrapperWithStore } from './src/state/store';

// prevent Prismjs from processing code automatically
window.Prism = { manual: true, disableWorkerMessageHandler: true };

export const wrapRootElement = wrapperWithStore;
