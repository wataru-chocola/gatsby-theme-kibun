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
          pluginOptions
        }
      }
    `,
  );
  const pluginOptions: any = data.sitePlugin?.pluginOptions;
  if (pluginOptions == null) {
    throw Error('must specify githubRepositry.project in your config');
  }

  const project = pluginOptions.githubRepository?.project;
  if (project == null) {
    throw Error('must specify githubRepositry.project in your config');
  }

  return {
    project: project,
    branch: pluginOptions.githubRepository?.branch || 'main',
    rootDir: pluginOptions.githubRepository?.rootDir || '',
  };
}
