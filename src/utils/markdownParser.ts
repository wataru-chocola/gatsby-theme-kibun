import React from 'react';
import unified from 'unified';
import { Element } from 'hast';
import remarkParser from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import codeRefractor from './syntaxHighlighter';
import autolinkHeader from './autolinkHeader';
import hastToc from './hastToc';
import * as matter from 'gray-matter';
import { renderAst, ImageDataCollection } from './rehype';

const markdownHastProcessor = unified()
  .use(remarkParser)
  .use(remarkRehype, { allowDangerousHtml: true })
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

export function md2react(
  md: string,
  pageSlug: string,
  imgdataCollection: ImageDataCollection = {},
): React.ReactElement | null {
  const mdast = markdownHastProcessor.parse(md);
  const hast = (markdownHastProcessor.runSync(mdast) as unknown) as Element;
  return renderAst(hast, pageSlug, imgdataCollection);
}

export function md2toc(md: string): React.ReactElement | null {
  const mdast = markdownHastProcessor.parse(md);
  const hast = (markdownHastProcessor.runSync(mdast) as unknown) as Element;
  const toc = hastToc(hast);
  if (toc == null) {
    return null;
  }
  return renderAst(toc);
}
