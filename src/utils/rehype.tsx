import React from "react";
import rehypeReact from "rehype-react";
import unified from "unified";
import { Box, Typography } from "@material-ui/core";
import { MuiGatsbyLink } from "./link";


const H1 = (props: any) => (
  <Typography variant="h1" component="h2" {...props}></Typography>
);

const H2 = (props: any) => (
  <Typography variant="h2" component="h2" {...props}></Typography>
);

const H3 = (props: any) => (
  <Box mt={4} mb={2} py={1} px={2} borderLeft={4} borderColor="primary.500">
    <Typography variant="h3" component="h3" {...props}></Typography>
  </Box>
);

const H4 = (props: any) => (
  <Box mt={4} mb={2} py={1} px={1} borderBottom={1} borderColor="primary.500">
    <Typography variant="body1" component="h4" {...props}></Typography>
  </Box>
);

const H5 = (props: any) => (
  <Box mt={4} mb={2} py={1} px={1} borderBottom={1} borderColor="primary.500">
    <Typography variant="body2" component="h5" {...props}></Typography>
  </Box>
);

const H6 = (props: any) => (
  <Box mt={4} mb={2} py={1} px={1} borderBottom={1} borderColor="primary.500">
    <Typography variant="body2" component="h6" {...props}></Typography>
  </Box>
);

const P = (props: any) => (
  <Typography
    variant="body2" component="p"
    style={{ marginTop: `1rem`, marginBottom: `1rem`, lineHeight: 1.8 }} {...props}
  ></Typography>
);

const A = (props: any) => {
  const { href, ...remainedProps } = props;
  const link = href
    ? <MuiGatsbyLink to={href} {...remainedProps}></MuiGatsbyLink>
    : <MuiGatsbyLink {...remainedProps}></MuiGatsbyLink>;
  return link;
};


export const renderAst = unified().use(rehypeReact, {
  createElement: React.createElement,
  components: {
    'h1': H1,
    'h2': H2,
    'h3': H3,
    'h4': H4,
    'h5': H5,
    'h6': H6,
    'p': P,
    'a': A,
  },
}).stringify;