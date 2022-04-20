import React from 'react';
import rehypeReact from 'rehype-react';
import { unified } from 'unified';
import { Root as HastRoot } from 'hast';
import { GatsbyImage, getImage, ImageDataLike } from 'gatsby-plugin-image';
import path from 'path';

import { H1, H2, H3, H4, H5, H6 } from '../../components/content/elements/heading';
import { P } from '../../components/content/elements/p';
import { A } from '../../components/content/elements/a';
import { Pre } from '../../components/content/elements/pre';

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
    pre: Pre,
  };

  return unified()
    .use(rehypeReact, {
      createElement: React.createElement,
      components: componentMapping,
      Fragment: React.Fragment,
    })
    .stringify(tree) as unknown as React.ReactElement;
};
