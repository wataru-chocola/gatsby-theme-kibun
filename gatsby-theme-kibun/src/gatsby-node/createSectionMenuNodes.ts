import { SourceNodesArgs, CreateSchemaCustomizationArgs } from 'gatsby';
import { PluginOptionsType } from './pluginOptions';

import * as path from 'path';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

export function createSectionMenuSchema({ actions, _schema }: CreateSchemaCustomizationArgs): void {
  const { createTypes } = actions;
  const typeDefs = [
    `
    type SectionMenuCategory implements Node {
      category: String!
      menu: [SectionMenuItem!]!
    }
    type SectionMenuItem {
      text: String!
      to: String
    }
    `,
  ];
  createTypes(typeDefs);
}

type NaviItemType = {
  text: string;
  to?: string | null;
};

type NaviCategoryType = {
  category: string;
  menu: NaviItemType[];
};

export function sourceSectionMenuYaml(
  { store, actions, createNodeId, createContentDigest, getNode, reporter }: SourceNodesArgs,
  _options: PluginOptionsType,
): void {
  const { program } = store.getState();
  const { createNode, createParentChildLink } = actions;

  const filepath = path.resolve(program.directory, './src/sectionMenu.yaml');
  if (!fs.existsSync(filepath)) {
    reporter.warn('./src/sectionMenu.yaml is not found');
    return;
  }

  const yamlText = fs.readFileSync(filepath, 'utf8');
  const sectionMenuNode = {
    id: createNodeId(`gatsby-theme-kibun-section-menu`),
    children: [],
    parent: null,
    internal: {
      content: yamlText,
      type: `sectionMenu`,
      contentDigest: createContentDigest(yamlText),
    },
  };
  createNode(sectionMenuNode);

  const yamlData = yaml.load(yamlText, { schema: yaml.FAILSAFE_SCHEMA }) as Array<NaviCategoryType>;
  for (let i = 0; i < yamlData.length; i++) {
    const nodeData = yamlData[i];
    const nodeContent = JSON.stringify(nodeData);
    const nodeMeta = {
      id: createNodeId(`gatsby-theme-kibun-section-menu-category-${i}`),
      parent: sectionMenuNode.id,
      children: [],
      internal: {
        type: `SectionMenuCategory`,
        content: nodeContent,
        contentDigest: createContentDigest(nodeData),
      },
    };
    const node = Object.assign({}, nodeData, nodeMeta);
    createParentChildLink({ parent: getNode(sectionMenuNode.id), child: node });
    createNode<typeof nodeData>(node);
  }
}
