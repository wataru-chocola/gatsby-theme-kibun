import React from 'react';
import { PageProps, graphql } from 'gatsby';

import Layout from '../components/layout';
import PathBreadcrumbs from '../components/breadcrumbs';

import { Typography } from '@material-ui/core';
import { Box, Slide } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import * as css from './page.module.scss';
import 'katex/dist/katex.min.css';

import EditBox from '../components/editbox';
import { splitFrontmatter, mdParse, mdast2react, mdast2toc } from '../utils/markdownParser';
import { ImageDataCollection } from '../utils/rehype';

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

  const [editmode, setEditmode] = React.useState(false);

  const [frontmatter, setFrontmatter] = React.useState(content[0]);
  const [markdown, setMarkdown] = React.useState(content[1]);
  const [currentMarkdown, setCurrentMarkdown] = React.useState(markdown);

  const mdast = React.useMemo(() => mdParse(currentMarkdown), [currentMarkdown]);
  const html = React.useMemo<React.ReactElement | null>(
    () => mdast2react(mdast, slug, imageDataCollection),
    [mdast, slug, imageDataCollection],
  );
  const toc = React.useMemo<React.ReactElement | null>(() => mdast2toc(mdast), [mdast]);

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

  const title = pageinfo.frontmatter?.title || `(no title)`;
  return (
    <Layout pageTitle={title}>
      <Slide in={editmode} mountOnEnter unmountOnExit>
        <EditBox
          closeEditmode={closeEditmode}
          saveMarkdown={saveMarkdown}
          renderMarkdown={setCurrentMarkdown}
          resetMarkdown={resetMarkdown}
          md={markdown}
          frontmatter={frontmatter}
          srcPath={pageinfo.parent?.relativePath || ''}
        ></EditBox>
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
