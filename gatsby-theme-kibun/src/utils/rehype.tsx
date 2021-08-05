import React from 'react';
import rehypeReact from 'rehype-react';
import unified from 'unified';
import { Node } from 'unist';
import { Box, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { MuiGatsbyLink } from './link';
import { GatsbyImage, getImage, ImageDataLike } from 'gatsby-plugin-image';
import path from 'path';

const useStyles = makeStyles((theme: Theme) => ({
  h6: {
    color: theme.palette.text.secondary,
  },
}));

const H1: React.FC = (props: any) => (
  <Typography variant="h1" component="h2" {...props}></Typography>
);

const H2: React.FC = (props: any) => (
  <Typography variant="h2" component="h2" {...props}></Typography>
);

const H3: React.FC = (props: any) => (
  <Box mt={4} mb={2} py={0.5} px={1} borderLeft={4} borderColor="primary.500">
    <Typography variant="h3" component="h3" {...props}></Typography>
  </Box>
);

const H4: React.FC = (props: any) => (
  <Box mt={4} mb={2} py={0.5} borderBottom={1} borderColor="primary.500">
    <Typography variant="h4" component="h4" {...props}></Typography>
  </Box>
);

const H5: React.FC = (props: any) => (
  <Typography variant="h5" component="h5" {...props}></Typography>
);

const H6: React.FC = (props: any) => {
  const classes = useStyles();
  return <Typography variant="h6" component="h6" className={classes.h6} {...props}></Typography>;
};

const P: React.FC = (props: any) => (
  <Typography
    variant="body1"
    component="p"
    style={{ marginTop: `1rem`, marginBottom: `1rem`, lineHeight: 1.8 }}
    {...props}
    paragraph
  ></Typography>
);

const A: React.FC = (props: any) => {
  const { href, ...remainedProps } = props;
  const link = href ? (
    <MuiGatsbyLink to={href} {...remainedProps}></MuiGatsbyLink>
  ) : (
    <MuiGatsbyLink {...remainedProps}></MuiGatsbyLink>
  );
  return link;
};

export interface ImageDataCollection {
  [key: string]: ImageDataLike;
}

export const renderAst: (
  tree: Node,
  slug?: string,
  imgdataCollection?: ImageDataCollection,
) => React.ReactElement = (tree, slug = '/', imgdataCollection = {}) => {
  const IMG: React.VFC = ({ alt, ...props }: JSX.IntrinsicElements['img']) => {
    const altText = alt || '(no alt image)';
    if (props.src != null) {
      const src = path.isAbsolute(props.src) ? props.src : path.join(slug, props.src);
      const imgdata = imgdataCollection[src];
      if (imgdata != null) {
        const image = getImage(imgdata);
        if (image != null) {
          return <GatsbyImage alt={altText} image={image} />;
        }
      }
    }
    return <img alt={altText} {...props} />;
  };

  const componentMapping = {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
    p: P,
    a: A,
    img: IMG,
  };

  return unified()
    .use(rehypeReact, {
      createElement: React.createElement,
      components: componentMapping,
    })
    .stringify(tree) as unknown as React.ReactElement;
};
