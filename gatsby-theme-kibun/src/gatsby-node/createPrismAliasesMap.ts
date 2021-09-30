import { ParentSpanPluginArgs, NodeInput } from 'gatsby';
import { moduleResolve } from 'import-meta-resolve';
import url from 'url';
import path from 'path';
import fs from 'fs';

type aliasMapType = Array<{
  alias: string;
  name: string;
}>;

export async function createPrismAliasesMap({
  reporter,
  actions,
  createContentDigest,
  createNodeId,
}: ParentSpanPluginArgs): Promise<null> {
  const { createNode } = actions;
  const aliasesToName: aliasMapType = [];
  try {
    const refractorPath = moduleResolve('refractor', url.pathToFileURL('.')).href;
    const langDir = path.join(path.dirname(url.fileURLToPath(refractorPath)), 'lang');
    const langFiles = (await fs.promises.readdir(langDir)).filter((filename) =>
      filename.endsWith('.js'),
    );
    await Promise.all(
      langFiles.map(async (langFile) => {
        const module = await import('refractor/lang/' + langFile);
        const langName = module.default.displayName as string;
        aliasesToName.push({ alias: langName, name: langName });
        for (const alias of module.default.aliases) {
          aliasesToName.push({ alias, name: langName });
        }
      }),
    );

    const prismAliasesNode: NodeInput = {
      id: createNodeId(`PrismAliasMap`),
      children: [],
      aliasesMap: aliasesToName,
      internal: {
        //content: data.content,
        type: `PrismAliasMap`,
        contentDigest: '',
      },
    };

    prismAliasesNode.internal.contentDigest = createContentDigest(prismAliasesNode);
    createNode(prismAliasesNode);
  } catch (err) {
    reporter.panicOnBuild(
      `Error creating prism alias map:\n
        ${err.message}`,
    );
    return null;
  }
  return null;
}
