import { createMuiTheme } from '@material-ui/core/styles';
import { jaJP } from '@material-ui/core/locale';

const fontFamily = [
  '"Helvetica Neue"',
  'Arial',
  '"Noto Sans JP"',
  '"Hiragino Kaku Gothic ProN"',
  '"Hiragino Sans"',
  'Meiryo',
  'sans-serif',
];

const theme = createMuiTheme(
  {
    typography: {
      fontFamily: fontFamily.join(','),
    },
  },
  jaJP,
);

export default theme;
