import React from "react";
import { PageProps, graphql } from "gatsby";

export default function Page(props: PageProps<GatsbyTypes.PageMarkdownQuery>) {
  const pageinfo = props.data.markdownRemark;
  if (pageinfo == null) {
    return null;
  }
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageinfo.tableOfContents! }} />
      <div dangerouslySetInnerHTML={{ __html: pageinfo.html! }} />
    </div>
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