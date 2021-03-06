import { unified } from 'unified';
import {
  Image as MdastImage,
  ImageReference as MdastImageReference,
  Definition as MdastDefinition,
  HTML as MdastHTML,
} from 'mdast';
import { visit } from 'unist-util-visit';
import { definitions as getDefinitions } from 'mdast-util-definitions';
import remarkParser from 'remark-parse';
import * as path from 'path';
import * as cheerio from 'cheerio';

const markdownParser = unified().use(remarkParser);

const parseImageURI = (uri: string) => {
  const [url, query] = uri.split('&');
  return {
    ext: path.extname(url).split(`.`).pop(),
    url,
    query,
  };
};

const getImageCanonicalPath: (url: string, dir?: string) => string = (url, dir) => {
  let imagePath: string = parseImageURI(url).url;
  if (!path.isAbsolute(imagePath) && dir != null) {
    imagePath = path.join(dir, imagePath);
  }
  return imagePath;
};

function flatten<Type>(array: Array<Array<Type>>): Array<Type> {
  return ([] as Type[]).concat(...array);
}

export async function getImagePaths(md: string, dir?: string): Promise<string[]> {
  const mdast = markdownParser.parse(md);

  const markdownImageNodes: (MdastImage | MdastImageReference | MdastDefinition)[] = [];
  visit(mdast, 'image', (node) => {
    markdownImageNodes.push(node);
  });
  visit(mdast, 'imageReference', (node) => {
    markdownImageNodes.push(node);
  });

  const rawHtmlNodes: MdastHTML[] = [];
  visit(mdast, 'html', (node) => {
    rawHtmlNodes.push(node);
  });

  const definition = getDefinitions(mdast);
  const imagePaths = ([] as string[]).concat(
    markdownImageNodes
      .map((node) => {
        if (node.type === 'imageReference') {
          const defNode = definition(node.identifier as string);
          if (defNode == null) {
            return null;
          } else {
            node = defNode;
          }
        }
        return getImageCanonicalPath((node as MdastImage | MdastDefinition).url as string, dir);
      })
      .filter((path) => path != null) as string[],
    flatten<string>(
      await Promise.all(
        rawHtmlNodes.map(async (node) => {
          if (!node.value) {
            return [];
          }

          const $ = cheerio.load(node.value);
          const imgElements: string[] = [];
          $('img').each((i, e) => {
            const url = $(e).attr('src');
            if (url != null) {
              const path = getImageCanonicalPath(url, dir);
              imgElements.push(path);
            }
          });
          return imgElements;
        }),
      ),
    ),
  );

  return [...Array.from(new Set(imagePaths))];
}
