import React, { useEffect } from 'react';
import { PageProps, graphql } from 'gatsby';

import Layout from '../components/layout';
import PathBreadcrumbs from '../components/breadcrumbs';

import ErrorBoundary from '../components/utils/errorboundary';

import { Typography } from '@mui/material';
import { Box, Slide } from '@mui/material';
import 'katex/dist/katex.min.css';

import TableOfContents from '../components/toc';
import Content from '../components/content';
import EditBox, { EditBoxMonitor } from '../components/editbox';
import { splitFrontmatter } from '../utils/markdown/markdownParser';

import { useMarkdownRenderer } from '../hooks/useMarkdownRenderer';
import { ImageDataFromQL } from '../hooks/useImageDataCollectionFromQL';
import { PrismAliasesFromQL } from '../hooks/usePrismAliasesMapFromQL';

import { useAppDispatch } from '../state/hooks';
import { snackMessageActions } from '../state/snackMessageSlice';

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
      <ErrorBoundary fallback={null} errHandler={editboxErrHandler}>
        <Slide in={editmode} mountOnEnter unmountOnExit>
          <EditBox
            closeEditmode={closeEditmode}
            saveMarkdown={setMarkdown}
            renderMarkdown={setCurrentMarkdown}
            resetMarkdown={resetMarkdown}
            md={markdown}
            frontmatter={frontmatter}
            srcPath={pageinfo.parent?.relativePath || ''}
          ></EditBox>
        </Slide>
      </ErrorBoundary>

      <Box pt={2} mx={6}>
        <PathBreadcrumbs crumbs={crumbs} />
      </Box>
      <Box bgcolor="primary.contrastText" color="primary.main" mx={6} my={2}>
        <Typography variant="h1" sx={{ fontSize: '40px', fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>

      <Box onDoubleClick={openEditmode}>
        {toc && (
          <Box mt={4} mb={8}>
            <TableOfContents>{toc}</TableOfContents>
          </Box>
        )}
        <Box mx={6}>
          <Content>{html}</Content>
        </Box>
      </Box>

      <Box mt={8} pt={2} pb={2} px={2} bgcolor="primary.light" color="primary.contrastText">
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
