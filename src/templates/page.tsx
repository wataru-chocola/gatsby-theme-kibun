import React from "react";
import { PageProps, graphql } from "gatsby";

export default function Page(props: PageProps<GatsbyTypes.PageMarkdownQuery>) {
  const pageinfo = props.data.markdownRemark;
  return <div dangerouslySetInnerHTML={{ __html: pageinfo!.html! }} />
};

export const query = graphql`
  query PageMarkdown ($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`