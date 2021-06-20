import React from "react";
import { PageProps, graphql } from "gatsby";

import Layout from "../components/layout"


export default function Page(props: PageProps<GatsbyTypes.PageMarkdownQuery>) {
  const pageinfo = props.data.markdownRemark;
  if (pageinfo == null) {
    return null;
  }
  const title = pageinfo.frontmatter?.title || `(no title)`;
  return (
    <Layout pageTitle={title}>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: pageinfo.tableOfContents! }} />
      <div dangerouslySetInnerHTML={{ __html: pageinfo.html! }} />
    </Layout>
  )
};

export const query = graphql`
  query PageMarkdown ($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      tableOfContents
      frontmatter {
        title
      }
    }
  }
`