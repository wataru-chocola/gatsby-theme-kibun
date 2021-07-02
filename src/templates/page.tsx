import React from 'react';
import { PageProps, graphql } from 'gatsby';

import Layout from '../components/layout';
import PathBreadcrumbs from '../components/breadcrumbs';

import { Typography } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import * as css from './page.module.scss';

import EditBox from '../components/editbox';
import { markdownProcessor, splitFrontmatter } from '../utils/markdownParser';
import { renderAst } from '../utils/rehype';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: theme.typography.h4.fontSize,
  },
}));

const Page: React.VFC<PageProps<GatsbyTypes.PageMarkdownQuery>> = (props) => {
  const pageinfo = props.data.markdownRemark;
  const content = splitFrontmatter(props.data.markdownRemark!.parent!.internal.content!);
  const classes = useStyles();
  const [editmode, setEditmode] = React.useState(false);
  const [markdown, setMarkdown] = React.useState(content[1]);
  const [html, setHTML] = React.useState(renderAst(props.data.markdownRemark!.htmlAst!));
  //const [html, setHTML] = React.useState(markdownProcessor.processSync(markdown).contents);

  const openEditmode = React.useCallback(() => {
    setEditmode(true);
  }, [setEditmode]);
  const closeEditmode = React.useCallback(() => {
    setEditmode(false);
  }, [setEditmode]);
  const renderMarkdown = (md: string) => {
    setHTML(markdownProcessor.processSync(md).contents);
  };

  if (pageinfo == null) {
    return null;
  }

  const title = pageinfo.frontmatter?.title || `(no title)`;
  return (
    <Layout pageTitle={title}>
      {editmode && (
        <EditBox
          closeEditmode={closeEditmode}
          saveMarkdown={setMarkdown}
          renderMarkdown={renderMarkdown}
          md={markdown}
        ></EditBox>
      )}

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

      <Box p={4} onDoubleClick={openEditmode}>
        <div className={css.toc} dangerouslySetInnerHTML={{ __html: pageinfo.tableOfContents! }} />
        <div className={css.md}>{html}</div>
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
      parent {
        internal {
          content
        }
      }
    }
  }
`;
