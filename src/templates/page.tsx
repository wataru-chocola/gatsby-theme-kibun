import React from 'react';
import { PageProps, graphql } from 'gatsby';

import Layout from '../components/layout';
import PathBreadcrumbs from '../components/breadcrumbs';

import { Button, Typography, TextField } from '@material-ui/core';
import { Box, Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import * as css from './page.module.scss';

import { markdownProcessor, splitFrontmatter } from '../utils/markdownParser';
import { renderAst } from '../utils/rehype';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: theme.typography.h4.fontSize,
  },
}));

interface EditBoxProps {
  closeEditmode: () => void;
  saveMarkdown: (markdown: string) => void;
  renderMarkdown: (markdown: string) => void;
  md?: string;
}

const EditBox: React.VFC<EditBoxProps> = ({ closeEditmode, saveMarkdown, renderMarkdown, md }) => {
  const inputEl = React.useRef<null | HTMLDivElement>(null);
  const [markdown, setMarkdown] = React.useState(md || '');
  React.useEffect(() => {
    const elOffset = inputEl!.current!.offsetTop;
    const target = Math.min(elOffset - 200, 0);
    window.scroll({
      left: 0,
      top: target,
      behavior: 'smooth',
    });
  });

  const saveEditing = React.useCallback(() => {
    saveMarkdown(markdown);
    renderMarkdown(markdown);
    closeEditmode();
  }, [saveMarkdown, closeEditmode, renderMarkdown, markdown]);
  const cancelEditing = React.useCallback(() => {
    renderMarkdown(md || '');
    closeEditmode();
  }, [closeEditmode, renderMarkdown, md]);
  const updateMarkdown = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMarkdown(e.target.value);
    },
    [setMarkdown],
  );
  const previewRenderedHTML = () => {
    renderMarkdown(markdown);
  };

  return (
    <Box p={4}>
      <Box pb={1}>
        <Grid container justify="flex-end" spacing={1}>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={cancelEditing}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={previewRenderedHTML}>
              Preview
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={saveEditing}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
      <TextField
        variant="outlined"
        multiline
        fullWidth
        rows={15}
        ref={inputEl}
        value={markdown}
        onChange={updateMarkdown}
      ></TextField>
    </Box>
  );
};

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

      {editmode && (
        <EditBox
          closeEditmode={closeEditmode}
          saveMarkdown={setMarkdown}
          renderMarkdown={renderMarkdown}
          md={markdown}
        ></EditBox>
      )}

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
