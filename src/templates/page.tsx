import React from 'react';
import { PageProps, graphql } from 'gatsby';

import Layout from '../components/layout';
import { Typography } from '@material-ui/core';
import { renderAst } from '../utils/rehype';
import * as css from './page.module.scss';

const Page: React.FC<PageProps<GatsbyTypes.PageMarkdownQuery>> = (props) => {
  const pageinfo = props.data.markdownRemark;
  if (pageinfo == null) {
    return null;
  }
  const title = pageinfo.frontmatter?.title || `(no title)`;
  return (
    <Layout pageTitle={title}>
      <Typography variant="h1">{title}</Typography>
      <div className={css.toc} dangerouslySetInnerHTML={{ __html: pageinfo.tableOfContents! }} />
      <div>{renderAst(pageinfo.htmlAst!)}</div>
    </Layout>
  );
};

export default Page;

export const query = graphql`
  query PageMarkdown($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      tableOfContents
      frontmatter {
        title
      }
    }
  }
`;
