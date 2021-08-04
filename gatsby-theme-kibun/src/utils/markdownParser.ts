import React from 'react';
import unified from 'unified';
import { Node as UnistNode } from 'unist';
import { Element } from 'hast';
import { Paragraph } from 'mdast';
import * as mdast2hast from 'mdast-util-to-hast';
import * as all from 'mdast-util-to-hast/lib/all';
import remarkParser from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import codeRefractor from './syntaxHighlighter';
import autolinkHeader from './autolinkHeader';
import hastToc from './hastToc';
import * as matter from 'gray-matter';
import { renderAst, ImageDataCollection } from './rehype';

const mdastParagraph2hast: mdast2hast.Handler = (h, tmp_node) => {
  const node = tmp_node as Paragraph;
  if (node.children.length === 1 && node.children[0].type === 'image') {
    return h(node, 'div', all(h, node));
  }
  return h(node, 'p', all(h, node));
};

const markdownHastBasicProcessor = unified()
  .use(remarkParser)
  .use(remarkRehype, undefined, {
    allowDangerousHtml: true,
    handlers: { paragraph: mdastParagraph2hast },
  })
  .use(autolinkHeader);

const markdownHastProcessor = unified()
  .use(remarkParser)
  .use(remarkRehype, undefined, {
    allowDangerousHtml: true,
    handlers: { paragraph: mdastParagraph2hast },
  })
  .use(rehypeRaw)
  .use(codeRefractor, {
    aliases: {
      sh: 'bash',
    },
  })
  .use(autolinkHeader);

export function splitFrontmatter(md: string): [string, string] {
  const mdfile = matter(md);
  const mdcontent = mdfile.content.replace(/^\s+/, '');
  return [mdfile.matter, mdcontent];
}

export function mdParse(md: string): UnistNode {
  const mdast = markdownHastProcessor.parse(md);
  return mdast;
}

export function mdast2react(
  mdast: UnistNode,
  pageSlug: string,
  imgdataCollection: ImageDataCollection = {},
): React.ReactElement | null {
  const hast = markdownHastProcessor.runSync(mdast) as unknown as Element;
  const result = renderAst(hast, pageSlug, imgdataCollection);
  return result;
}

export function mdast2toc(mdast: UnistNode): React.ReactElement | null {
  const hast = markdownHastBasicProcessor.runSync(mdast) as unknown as Element;
  const toc = hastToc(hast);
  if (toc == null) {
    return null;
  }
  return renderAst(toc);
}
