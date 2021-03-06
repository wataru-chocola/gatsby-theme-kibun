import React from 'react';
import { PageProps, graphql } from 'gatsby';

import Layout, { useLayoutControl } from '../components/layout';
import PathBreadcrumbs from '../components/breadcrumbs';

import ErrorBoundary from '../components/utils/errorboundary';

import { Typography } from '@mui/material';
import { Box, Slide, MenuProps } from '@mui/material';
import 'katex/dist/katex.min.css';

import { HeaderContent } from '../components/header';
import { SectionMenu } from '../components/sectionMenu';
import { Attachments } from '../components/attachments';
import { ActionMenu } from '../components/header/actionMenu';
import { ContentContainer } from '../components/contentContainer';

import TableOfContents from '../components/content/toc';
import { Content } from '../components/content';
import { EditBox, EditBoxMonitor } from '../components/editbox';

import { useMarkdownEditor } from '../hooks/useMarkdownEditor';
import { ImageDataFromQL } from '../hooks/useImageDataCollectionFromQL';
import { PrismAliasesFromQL } from '../hooks/usePrismAliasesMapFromQL';

import { useAppDispatch } from '../state/hooks';
import { snackMessageActions } from '../state/snackMessageSlice';
import { Footer } from '../components/footer';

interface PageSlugContext {
  slug: string;
}

const Page: React.VFC<PageProps<GatsbyTypes.PageQuery, PageSlugContext>> = (props) => {
  const layoutControl = useLayoutControl();
  const contentBoxRef = React.useRef<HTMLDivElement>(null);
  const pageinfo = props.data.markdown!;
  const slug = props.pageContext.slug! as string;
  const crumbs = pageinfo.breadcrumbs!.map((crumb) => ({
    path: crumb!.slug,
    title: crumb!.title,
  }));

  const { frontmatter, toc, html, markdown, editor } = useMarkdownEditor(
    props.data.markdown!.parent!.internal.content!,
    slug,
    props.data.markdown!.fields?.images as ImageDataFromQL,
    props.data.prismAliasMap?.aliasesMap as PrismAliasesFromQL,
  );

  const dispatch = useAppDispatch();
  const [editmode, setEditmode] = React.useState(false);

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

  const toggleRightPanel = layoutControl.toggleRightPanel;
  const menuRender = React.useCallback(
    (props: MenuProps) => {
      return (
        <ActionMenu
          handleOpenAttachment={() => toggleRightPanel(true)}
          handleEdit={openEditmode}
          {...props}
        />
      );
    },
    [toggleRightPanel, openEditmode],
  );

  const title = pageinfo.frontmatter?.title || `(no title)`;
  return (
    <Layout
      pageTitle={title}
      headerContent={<HeaderContent pageTitle={title} menuRender={menuRender} />}
      sidebarContent={<SectionMenu />}
      rightPanelContent={<Attachments />}
      control={layoutControl}
    >
      <EditBoxMonitor />
      <ErrorBoundary fallback={null} errHandler={editboxErrHandler}>
        <Slide in={editmode} mountOnEnter unmountOnExit>
          <EditBox
            closeEditmode={closeEditmode}
            saveMarkdown={editor.saveMarkdown}
            renderMarkdown={editor.renderMarkdown}
            resetMarkdown={editor.resetMarkdown}
            md={markdown}
            frontmatter={frontmatter}
            srcPath={pageinfo.parent?.relativePath || ''}
          ></EditBox>
        </Slide>
      </ErrorBoundary>

      <ContentContainer footer={<Footer />} onEditClick={openEditmode}>
        <Box pt={2} mx={{ xs: 2, sm: 6 }}>
          <PathBreadcrumbs crumbs={crumbs} />
        </Box>
        <Box bgcolor="primary.contrastText" color="primary.main" mx={{ xs: 2, sm: 6 }} my={2}>
          <Typography variant="h1" sx={{ fontSize: '40px', fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>

        <Box onDoubleClick={openEditmode} ref={contentBoxRef}>
          {toc && (
            <Box mt={4} mb={8}>
              <TableOfContents>{toc}</TableOfContents>
            </Box>
          )}
          <Box mx={{ xs: 2, sm: 6 }}>
            <Content>{html}</Content>
          </Box>
        </Box>
      </ContentContainer>
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
