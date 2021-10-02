import React from 'react';
import { PageProps, graphql } from 'gatsby';

import Layout from '../components/layout';
import PathBreadcrumbs from '../components/breadcrumbs';
import ErrorBoundary from '../components/errorboundary';

import { Typography } from '@material-ui/core';
import { Box, Slide } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import * as css from './page.module.scss';
import 'katex/dist/katex.min.css';

import EditBox from '../components/editbox';
import { splitFrontmatter } from '../utils/markdownParser';
import { ImageDataCollection } from '../utils/hast2react';

import { useMarkdownRenderer } from '../hooks/useMarkdownRenderer';

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

const defaultPrismAliasToName = new Map([
  ['ps1', 'powershell'],
  ['bat', 'batch'],
  ['common-lisp', 'lisp'],
  ['mysql', 'sql'],
  ['console', 'shell-session'],
]);

const Page: React.VFC<PageProps<GatsbyTypes.PageQuery, PageSlugContext>> = (props) => {
  console.log('page rendering');
  const pageinfo = props.data.markdown!;
  const prismAliasesMapArray = props.data.prismAliasMap?.aliasesMap;
  const slug = props.pageContext.slug! as string;
  const crumbs = pageinfo.breadcrumbs!.map((crumb) => ({
    path: crumb!.slug,
    title: crumb!.title,
  }));

  const imageData = props.data.markdown!.fields?.images;
  const imageDataCollection = React.useMemo<ImageDataCollection>(() => {
    const tmp_imageDataCollection: ImageDataCollection = {};
    imageData?.forEach((image) => {
      if (image != null) {
        tmp_imageDataCollection[image.fields!.imagePath!] = image.gatsbyImageData;
      }
    });
    return tmp_imageDataCollection;
  }, [imageData]);

  const prismAliasesMap = React.useMemo(
    () =>
      new Map([
        ...(prismAliasesMapArray?.map((item) => [item!.alias, item!.name]) as [string, string][]),
        ...defaultPrismAliasToName,
      ]),
    [prismAliasesMapArray],
  );

  const content = splitFrontmatter(props.data.markdown!.parent!.internal.content!);
  const [frontmatter, _setFrontmatter] = React.useState(content[0]);
  const [markdown, setMarkdown] = React.useState(content[1]);
  const {
    setMarkdown: setCurrentMarkdown,
    html,
    toc,
  } = useMarkdownRenderer(markdown, slug, { imageDataCollection, prismAliasesMap });

  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [editmode, setEditmode] = React.useState(false);

  const saveMarkdown = React.useCallback(
    (md: string) => {
      setMarkdown(md);
      setCurrentMarkdown(md);
    },
    [setMarkdown, setCurrentMarkdown],
  );
  const resetMarkdown = React.useCallback(() => {
    setCurrentMarkdown(markdown);
  }, [markdown, setCurrentMarkdown]);

  const openEditmode = React.useCallback(() => {
    setEditmode(true);
  }, [setEditmode]);
  const closeEditmode = React.useCallback(() => {
    setEditmode(false);
  }, [setEditmode]);

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
      <Slide in={editmode} mountOnEnter unmountOnExit>
        <ErrorBoundary fallback={null} errHandler={editboxErrHandler}>
          <EditBox
            closeEditmode={closeEditmode}
            saveMarkdown={saveMarkdown}
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
