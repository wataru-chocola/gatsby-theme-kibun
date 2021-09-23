import React, { useEffect } from 'react';
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
import { splitFrontmatter, md2hast } from '../utils/markdownParser';
import { hast2toc } from '../utils/hastToc';
import { hast2react, ImageDataCollection } from '../utils/rehype';
import { highlight } from '../utils/syntaxHighlighter';

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

const Page: React.VFC<PageProps<GatsbyTypes.PageMarkdownQuery, PageSlugContext>> = (props) => {
  const pageinfo = props.data.markdown!;
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

  const content = splitFrontmatter(props.data.markdown!.parent!.internal.content!);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [editmode, setEditmode] = React.useState(false);

  const [frontmatter, _setFrontmatter] = React.useState(content[0]);
  const [markdown, setMarkdown] = React.useState(content[1]);
  const [currentMarkdown, setCurrentMarkdown] = React.useState(markdown);
  const [html, setHtml] = React.useState<React.ReactElement | null>(null);

  const hast = React.useMemo(() => {
    try {
      return md2hast(currentMarkdown);
    } catch (e) {
      console.error(e);
      dispatch(snackMessageActions.hideMessage({}));
      dispatch(snackMessageActions.addErrorMessage(e, 3000, 'failed to parse markdown: '));
      return null;
    }
  }, [currentMarkdown, dispatch]);

  useEffect(() => {
    const f = async () => {
      if (hast == null) {
        return;
      }

      let [highlighted, missingLanguages] = await highlight(hast);
      try {
        setHtml(hast2react(highlighted, slug, imageDataCollection));
      } catch (e) {
        console.error(e);
        dispatch(snackMessageActions.hideMessage({}));
        dispatch(snackMessageActions.addErrorMessage(e, 3000, 'failed to render html: '));
        return;
      }

      if (missingLanguages) {
        [highlighted, missingLanguages] = await highlight(hast, { dynamic: true });
        if (missingLanguages) {
          console.warn(`syntax not found: ${missingLanguages}`);
        }
        try {
          setHtml(hast2react(highlighted, slug, imageDataCollection));
        } catch (e) {
          console.error(e);
          dispatch(snackMessageActions.hideMessage({}));
          dispatch(snackMessageActions.addErrorMessage(e, 3000, 'failed to render html: '));
          return;
        }
      }
    };
    f();
  }, [hast, imageDataCollection, slug, dispatch]);

  const toc = React.useMemo<React.ReactElement | null>(() => {
    try {
      return hast != null ? hast2toc(hast) : null;
    } catch (e) {
      console.error(e);
      dispatch(snackMessageActions.hideMessage({}));
      dispatch(snackMessageActions.addErrorMessage(e, 3000, 'failed to create toc: '));
      return null;
    }
  }, [hast, dispatch]);

  const saveMarkdown = React.useCallback(
    (md: string) => {
      setMarkdown(md);
      setCurrentMarkdown(md);
    },
    [setMarkdown, setCurrentMarkdown],
  );
  const resetMarkdown = React.useCallback(() => {
    setCurrentMarkdown(markdown);
  }, [markdown]);

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
  query PageMarkdown($slug: String!) {
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
  }
`;
