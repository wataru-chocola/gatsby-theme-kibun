import React from 'react';
import { PageProps, graphql } from 'gatsby';

import Layout from '../components/layout';
import PathBreadcrumbs from '../components/breadcrumbs';

import { Typography } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { renderAst } from '../utils/rehype';
import * as css from './page.module.scss';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: theme.typography.h4.fontSize,
  },
}));

const Page: React.FC<PageProps<GatsbyTypes.PageMarkdownQuery>> = (props) => {
  const pageinfo = props.data.markdownRemark;
  const classes = useStyles();

  if (pageinfo == null) {
    return null;
  }
  const title = pageinfo.frontmatter?.title || `(no title)`;
  return (
    <Layout pageTitle={title}>
      <Box pt={2} pb={0.5} px={2}>
        <PathBreadcrumbs
          crumbs={[
            { path: 'dummy', title: 'Dummy' },
            { path: 'cc', title: 'dd' },
          ]}
        />
      </Box>
      <Box bgcolor="primary.light" color="primary.contrastText" px={2} py={1}>
        <Typography variant="h1" className={classes.title}>
          {title}
        </Typography>
      </Box>

      <Box p={4}>
        <div className={css.toc} dangerouslySetInnerHTML={{ __html: pageinfo.tableOfContents! }} />
        <div className={css.md}>{renderAst(pageinfo.htmlAst!)}</div>
      </Box>

      <Box mt={4} pt={1} pb={2} px={2} bgcolor="primary.light" color="primary.contrastText">
        <div>footter</div>
      </Box>
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
