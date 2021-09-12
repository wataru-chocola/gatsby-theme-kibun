import React from 'react';
import { unified } from 'unified';
import { Element, Root as HastRoot } from 'hast';
import { Paragraph, Root as MdastRoot } from 'mdast';
import { all, Handler } from 'mdast-util-to-hast';
import remarkParser from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import codeRefractor from './syntaxHighlighter';
import autolinkHeader from './autolinkHeader';
import hastToc from './hastToc';
import * as matter from 'gray-matter';
import { renderAst, ImageDataCollection } from './rehype';
import { remarkDefinitionList, defListHastHandlers } from 'remark-definition-list';

const mdastParagraph2hast: Handler = (h, tmp_node) => {
  const node = tmp_node as Paragraph;
  if (node.children.length === 1 && node.children[0].type === 'image') {
    return h(node, 'div', all(h, node));
  }
  return h(node, 'p', all(h, node));
};

const markdownHastBasicProcessor = unified()
  .use(remarkParser)
  .use(remarkRehype, {
    allowDangerousHtml: true,
    handlers: { paragraph: mdastParagraph2hast },
  })
  .use(autolinkHeader)
  .freeze();

const markdownHastProcessor = unified()
  .use(remarkParser)
  .use(remarkDefinitionList)
  .use(remarkMath)
  .use(remarkGfm, { singleTilde: false })
  .use(remarkRehype, {
    allowDangerousHtml: true,
    handlers: Object.assign({ paragraph: mdastParagraph2hast }, defListHastHandlers),
  })
  .use(rehypeRaw)
  .use(rehypeKatex)
  .use(codeRefractor, {
    aliases: {
      sh: 'bash',
    },
  })
  .use(autolinkHeader)
  .freeze();

export function splitFrontmatter(md: string): [string, string] {
  const mdfile = matter(md);
  const mdcontent = mdfile.content.replace(/^\s+/, '');
  return [mdfile.matter, mdcontent];
}

export function mdParse(md: string): MdastRoot {
  const mdast = markdownHastProcessor.parse(md) as MdastRoot;
  return mdast;
}

export function mdast2react(
  mdast: MdastRoot,
  pageSlug: string,
  imgdataCollection: ImageDataCollection = {},
): React.ReactElement | null {
  const hast = markdownHastProcessor.runSync(mdast) as unknown as HastRoot;
  const result = renderAst(hast, pageSlug, imgdataCollection);
  return result;
}

export function mdast2toc(mdast: MdastRoot): React.ReactElement | null {
  const hast = markdownHastBasicProcessor.runSync(mdast) as unknown as Element;
  const toc = hastToc(hast);
  if (toc == null) {
    return null;
  }
  return renderAst(toc);
}
