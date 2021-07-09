import React from 'react';
import { PageProps, graphql } from 'gatsby';

import Layout from '../components/layout';
import PathBreadcrumbs from '../components/breadcrumbs';

import { Typography } from '@material-ui/core';
import { Box, Slide } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import * as css from './page.module.scss';

import EditBox from '../components/editbox';
import { splitFrontmatter, md2react, md2toc } from '../utils/markdownParser';
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
  const imageDataCollection: ImageDataCollection = {};
  props.data.markdown!.fields?.images?.forEach((image) => {
    if (image != null) {
      imageDataCollection[image.fields!.imagePath!] = image.gatsbyImageData;
    }
  });
  const content = splitFrontmatter(props.data.markdown!.parent!.internal.content!);

  const classes = useStyles();
  const [editmode, setEditmode] = React.useState(false);
  const [markdown, setMarkdown] = React.useState(content[1]);
  const [html, setHTML] = React.useState<React.ReactElement | null>(
    md2react(markdown, slug, imageDataCollection),
  );
  const [toc, setTOC] = React.useState<React.ReactElement | null>(md2toc(markdown));

  const openEditmode = React.useCallback(() => {
    setEditmode(true);
  }, [setEditmode]);
  const closeEditmode = React.useCallback(() => {
    setEditmode(false);
  }, [setEditmode]);
  const renderMarkdown = (md: string) => {
    setHTML(md2react(md, slug, imageDataCollection));
    setTOC(md2toc(md));
  };

  const title = pageinfo.frontmatter?.title || `(no title)`;
  return (
    <Layout pageTitle={title}>
      <Slide in={editmode} mountOnEnter unmountOnExit>
        <EditBox
          closeEditmode={closeEditmode}
          saveMarkdown={setMarkdown}
          renderMarkdown={renderMarkdown}
          md={markdown}
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
        internal {
          content
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
