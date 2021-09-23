import { unified } from 'unified';
import { Root as HastRoot } from 'hast';
import { Paragraph, Root as MdastRoot } from 'mdast';
import { all, Handler } from 'mdast-util-to-hast';
import remarkParser from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import autolinkHeader from './autolinkHeader';
import * as matter from 'gray-matter';
import { remarkDefinitionList, defListHastHandlers } from 'remark-definition-list';

const mdastParagraph2hast: Handler = (h, tmp_node) => {
  const node = tmp_node as Paragraph;
  if (node.children.length === 1 && node.children[0].type === 'image') {
    return h(node, 'div', all(h, node));
  }
  return h(node, 'p', all(h, node));
};

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
  .use(autolinkHeader)
  .freeze();

export function splitFrontmatter(md: string): [string, string] {
  const mdfile = matter(md);
  const mdcontent = mdfile.content.replace(/^\s+/, '');
  return [mdfile.matter, mdcontent];
}

export function md2hast(md: string): HastRoot {
  const mdast = markdownHastProcessor.parse(md) as MdastRoot;
  const hast = markdownHastProcessor.runSync(mdast) as HastRoot;
  return hast;
}
