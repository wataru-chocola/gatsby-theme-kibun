import { useStaticQuery, graphql } from 'gatsby';

export function useSiteTitle(): string {
  const data = useStaticQuery<GatsbyTypes.SiteTitleQuery>(
    graphql`
      query SiteTitle {
        site {
          siteMetadata {
            title
          }
        }
      }
    `,
  );
  return data.site?.siteMetadata?.title || `(no sitename)`;
}
