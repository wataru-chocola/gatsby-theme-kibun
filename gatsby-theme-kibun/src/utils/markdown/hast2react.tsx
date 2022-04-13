import React from 'react';
import rehypeReact from 'rehype-react';
import { unified } from 'unified';
import { Root as HastRoot } from 'hast';
import { Typography } from '@mui/material';
import { MuiGatsbyLink } from '../../components/uiparts/link';
import { GatsbyImage, getImage, ImageDataLike } from 'gatsby-plugin-image';
import path from 'path';

const H1: React.FC = (props: any) => (
  <Typography variant="h1" component="h1" {...props}></Typography>
);

const H2: React.FC = (props: any) => (
  <Typography variant="h2" component="h2" {...props}></Typography>
);

const H3: React.FC = (props: any) => (
  <Typography variant="h3" component="h3" {...props}></Typography>
);

const H4: React.FC = (props: any) => (
  <Typography variant="h4" component="h4" {...props}></Typography>
);

const H5: React.FC = (props: any) => (
  <Typography variant="h5" component="h5" {...props}></Typography>
);

const H6: React.FC = (props: any) => (
  <Typography variant="h6" component="h6" {...props}></Typography>
);

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

export const hast2react: (
  tree: HastRoot,
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
          return <GatsbyImage alt={altText} image={image} className="md-image" />;
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
