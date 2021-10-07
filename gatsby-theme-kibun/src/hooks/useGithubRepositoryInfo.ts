import { useStaticQuery, graphql } from 'gatsby';

interface githubRepositoryInfo {
  githubUrl?: string;
  project: string;
  branch: string;
  rootDir: string;
}

export function useGithubRepositoryInfo(): githubRepositoryInfo {
  const data = useStaticQuery<GatsbyTypes.githubRepositryQuery>(
    graphql`
      query githubRepositry {
        sitePlugin(name: { eq: "gatsby-theme-kibun" }) {
          pluginOptions {
            githubRepository {
              project
              branch
              rootDir
            }
          }
        }
      }
    `,
  );
  const project = data.sitePlugin?.pluginOptions?.githubRepository?.project;
  if (project == null) {
    throw Error('must specify githubRepositry.project in your config');
  }

  return {
    project: project,
    branch: data.sitePlugin?.pluginOptions?.githubRepository?.branch || 'main',
    rootDir: data.sitePlugin?.pluginOptions?.githubRepository?.rootDir || '',
  };
}
