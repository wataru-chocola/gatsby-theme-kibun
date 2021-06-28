import React from 'react';
import { PageProps, graphql } from 'gatsby';

import Layout from '../components/layout';
import PathBreadcrumbs from '../components/breadcrumbs';

import { Button, Typography, TextField } from '@material-ui/core';
import { Box, Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { renderAst } from '../utils/rehype';
import * as css from './page.module.scss';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: theme.typography.h4.fontSize,
  },
}));

interface EditBoxProps {
  closeEditmode: () => void;
  saveMarkdown: (markdown: string) => void;
  md?: string;
}

const EditBox: React.VFC<EditBoxProps> = ({ closeEditmode, saveMarkdown, md }) => {
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

  const saveMarkdownWrapper = React.useCallback(() => {
    saveMarkdown(markdown);
    closeEditmode();
  }, [saveMarkdown, closeEditmode, markdown]);
  const updateMarkdown = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMarkdown(e.target.value);
    },
    [setMarkdown],
  );

  return (
    <Box p={4}>
      <Box pb={1}>
        <Grid container justify="flex-end" spacing={1}>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={closeEditmode}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={saveMarkdownWrapper}>
              Preview
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={saveMarkdownWrapper}>
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
  const classes = useStyles();
  const [editmode, setEditmode] = React.useState(false);
  const [markdown, setMarkdown] = React.useState(
    props.data.markdownRemark?.parent?.internal.content,
  );

  const openEditmode = React.useCallback(() => {
    setEditmode(true);
  }, [setEditmode]);
  const closeEditmode = React.useCallback(() => {
    setEditmode(false);
  }, [setEditmode]);

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
        <EditBox closeEditmode={closeEditmode} saveMarkdown={setMarkdown} md={markdown}></EditBox>
      )}

      <Box p={4} onDoubleClick={openEditmode}>
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
      parent {
        internal {
          content
        }
      }
    }
  }
`;
