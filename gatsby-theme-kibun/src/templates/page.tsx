import React, { useEffect } from 'react';
import { PageProps, graphql } from 'gatsby';

import Layout from '../components/layout';
import PathBreadcrumbs from '../components/breadcrumbs';
import ErrorBoundary from '../components/utils/errorboundary';

import { Typography } from '@mui/material';
import { Box, Slide } from '@mui/material';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import * as css from './page.module.scss';
import 'katex/dist/katex.min.css';

import EditBox, { EditBoxMonitor } from '../components/editbox';
import { splitFrontmatter } from '../utils/markdown/markdownParser';

import { useMarkdownRenderer } from '../hooks/useMarkdownRenderer';
import { ImageDataFromQL } from '../hooks/useImageDataCollectionFromQL';
import { PrismAliasesFromQL } from '../hooks/usePrismAliasesMapFromQL';

import { useAppDispatch } from '../state/hooks';
import { snackMessageActions } from '../state/snackMessageSlice';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: theme.typography.h4.fontSize,
  },
}));

interface PageSlugContext {
  slug: string;
}

const Page: React.VFC<PageProps<GatsbyTypes.PageQuery, PageSlugContext>> = (props) => {
  const pageinfo = props.data.markdown!;
  const slug = props.pageContext.slug! as string;
  const crumbs = pageinfo.breadcrumbs!.map((crumb) => ({
    path: crumb!.slug,
    title: crumb!.title,
  }));

  const content = splitFrontmatter(props.data.markdown!.parent!.internal.content!);
  const [frontmatter, _setFrontmatter] = React.useState(content[0]);
  const [markdown, setMarkdown] = React.useState(content[1]);
  const {
    setMarkdown: setCurrentMarkdown,
    html,
    toc,
  } = useMarkdownRenderer(markdown, slug, {
    imageDataFromQL: props.data.markdown!.fields?.images as ImageDataFromQL,
    prismAliasesFromQL: props.data.prismAliasMap?.aliasesMap as PrismAliasesFromQL,
  });
  useEffect(() => setCurrentMarkdown(markdown), [markdown, setCurrentMarkdown]);

  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [editmode, setEditmode] = React.useState(false);

  const resetMarkdown = React.useCallback(
    () => setCurrentMarkdown(markdown),
    [markdown, setCurrentMarkdown],
  );
  const openEditmode = React.useCallback(() => setEditmode(true), [setEditmode]);
  const closeEditmode = React.useCallback(() => setEditmode(false), [setEditmode]);

  const editboxErrHandler = React.useCallback(
    (e: Error) => {
      dispatch(snackMessageActions.hideMessage({}));
      dispatch(snackMessageActions.addErrorMessage(e, 3000, 'failed to open edit box: '));
      setEditmode(false);
    },
    [dispatch, setEditmode],
  );

  const title = pageinfo.frontmatter?.title || `(no title)`;
  return (
    <Layout pageTitle={title}>
      <EditBoxMonitor />
      <Slide in={editmode} mountOnEnter unmountOnExit>
        <ErrorBoundary fallback={null} errHandler={editboxErrHandler}>
          <EditBox
            closeEditmode={closeEditmode}
            saveMarkdown={setMarkdown}
            renderMarkdown={setCurrentMarkdown}
            resetMarkdown={resetMarkdown}
            md={markdown}
            frontmatter={frontmatter}
            srcPath={pageinfo.parent?.relativePath || ''}
          ></EditBox>
        </ErrorBoundary>
      </Slide>

      <Box pt={2} pb={0.5} px={2}>
        <PathBreadcrumbs crumbs={crumbs} />
      </Box>
      <Box bgcolor="primary.light" color="primary.contrastText" px={2} py={1}>
        <Typography variant="h1" className={classes.title}>
          {title}
        </Typography>
      </Box>

      <Box p={4} onDoubleClick={openEditmode}>
        {toc && <div className={css.toc}>{toc}</div>}
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
  query Page($slug: String!) {
    markdown(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
      breadcrumbs {
        slug
        title
      }
      parent {
        ... on File {
          relativePath
          internal {
            content
          }
        }
      }
      fields {
        images {
          fields {
            imagePath
          }
          gatsbyImageData
        }
      }
    }
    prismAliasMap {
      aliasesMap {
        alias
        name
      }
    }
  }
`;
