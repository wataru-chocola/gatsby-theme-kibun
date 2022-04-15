import React from 'react';
import { Box } from '@mui/material';

type ContentProps = {
  containerWidth: number;
  expandedWidth?: number;
};
const Content: React.FC<ContentProps> = ({ containerWidth, expandedWidth, children }) => {
  return (
    <Box
      sx={{
        fontSize: '16px',

        // Headers
        'h1, h2, h3, h4, h5, h6': {
          '+ h1, + h2, + h3, + h4, + h5, + h6': {
            marginTop: 4,
          },
          marginTop: 6,
          marginBottom: 2,
          lineHeight: 1.2,

          ':hover .auto-headers svg': {
            visibility: 'visible',
          },
        },
        'h1, h2, h3, h4': {
          color: 'primary.main',
        },
        h2: {
          paddingTop: 0.5,
          paddingLeft: '0.5em',
          borderLeft: 4,
        },
        h4: {
          borderBottom: 1,
        },
        h5: {
          color: 'secondary.main',
        },
        h6: {
          color: (theme) => theme.palette.secondary.shade[0],
        },
        '.auto-headers': {
          display: { xs: 'none', sm: 'inline-block' },
          marginLeft: '0.3em',
          paddingX: 0.5,

          svg: {
            fill: '#77a8d2',
            visibility: 'hidden',
            width: '0.8em',
            height: '0.8em',
          },

          ':hover': {
            backgroundColor: '#d1e2f0',
            svg: {
              visibility: 'visible',
            },
          },

          ':focus svg': {
            visibility: 'visible',
          },
        },

        // Paragraph
        p: {
          marginY: 1,
        },

        // Lists
        dt: {
          display: 'inline-block',
          marginBottom: 1,
          marginLeft: { xs: 0, sm: 1 },
          background: 'linear-gradient(transparent 80%, #C5E1A4 80%)',
          lineHeight: 1.1,
        },
        dd: {
          marginBottom: 2,
          marginLeft: { xs: 1, sm: 4 },
        },
        'ul, ol': {
          paddingLeft: { xs: 3, sm: 5 },
        },
        'ul, ol, dl': {
          marginTop: 2,
          marginBottom: 3,

          li: {
            '> ul, ol, dl': {
              marginTop: 1,
              marginBottom: 1,
            },
          },
        },

        // Block margins
        'table, .md-image, div.math, blockquote': {
          marginTop: 3,
          marginBottom: 4,
        },

        // Table
        table: {
          fontSize: '0.9em',
          border: '1px solid',
          borderColor: (theme) => theme.palette.gray[1],
          borderCollapse: 'collapse',
          th: {
            backgroundColor: (theme) => theme.palette.gray[6],
            color: 'white',
            fontWeight: 'normal',
          },
          'th, td': {
            border: '1px solid',
            borderColor: (theme) => theme.palette.gray[1],
            borderCollapse: 'collapse',
            paddingX: 1,
            paddingY: 0.5,
          },
        },

        // Horizontal line
        hr: {
          border: 'none',
          borderTop: '1px solid',
          borderTopColor: (theme) => theme.palette.gray[0],
          marginY: 4,
        },

        // Blockquote
        blockquote: {
          borderLeft: '4px solid',
          paddingLeft: { xs: 2, sm: 4 },
          borderLeftColor: (theme) => theme.palette.gray[0],
          color: (theme) => theme.palette.gray[5],
          marginLeft: 0,
          marginRight: { xs: 2, sm: 4 },

          '&::before': {
            display: 'block',
            content:
              "url('data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M13%2014.725c0-5.141%203.892-10.519%2010-11.725l.984%202.126c-2.215.835-4.163%203.742-4.38%205.746%202.491.392%204.396%202.547%204.396%205.149%200%203.182-2.584%204.979-5.199%204.979-3.015%200-5.801-2.305-5.801-6.275zm-13%200c0-5.141%203.892-10.519%2010-11.725l.984%202.126c-2.215.835-4.163%203.742-4.38%205.746%202.491.392%204.396%202.547%204.396%205.149%200%203.182-2.584%204.979-5.199%204.979-3.015%200-5.801-2.305-5.801-6.275z%22%20fill%3D%22%23cccccc%22%20%2F%3E%3C%2Fsvg%3E')",
          },
        },

        // Code
        code: {
          fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
        },
        '& > div > pre': {
          marginX: (theme) => ({
            xs: -2,
            sm: `${-(
              parseInt(theme.spacing(6)) +
              (expandedWidth ? (expandedWidth - containerWidth) / 2 : 0)
            )}px`,
          }),
          paddingY: '1.5em',
          paddingX: (theme) => ({
            xs: 2,
            sm: `${
              parseInt(theme.spacing(7)) +
              (expandedWidth ? (expandedWidth - containerWidth) / 2 : 0)
            }px`,
          }),
          borderRadius: 0,
          marginTop: 4,
          marginBottom: 5,
        },

        // Img
        img: {
          maxWidth: '100%',
          objectFit: 'cover',
        },

        // Inline elements
        '& :not(pre) > code': {
          fontSize: '0.9em',
          display: 'inline-block',
          paddingX: 1,
          marginX: 0.5,
          borderRadius: 2,
          color: (theme) => theme.palette.primary.shade[0],
          backgroundColor: '#eeeeee',
        },
      }}
    >
      {children}
    </Box>
  );
};

export default Content;
