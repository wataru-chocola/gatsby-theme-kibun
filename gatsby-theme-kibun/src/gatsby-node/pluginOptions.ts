import { PluginOptions, PluginOptionsSchemaArgs } from 'gatsby';

export type PluginOptionsType = {
  markdownDir: string;
  githubRepository: {
    project: string;
    branch: string;
    rootDir: string;
  };
} & PluginOptions;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) => {
  return Joi.object({
    markdownDir: Joi.string()
      .default(`src/markdowns`)
      .description(`Directory containing markdown src`),
    githubRepository: Joi.object({
      project: Joi.string()
        .required()
        .description(`GitHub repository name for content markdown sources`),
      branch: Joi.string().default(`main`).description(`Main branch name`),
      rootDir: Joi.string().default(`markdowns/`).description(`Directory containing sources`),
    }),
  });
};
