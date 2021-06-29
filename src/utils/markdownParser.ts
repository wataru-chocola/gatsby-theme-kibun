import React from 'react';
import unified from 'unified';
import remarkParser from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';
import * as matter from 'gray-matter';
import { componentMapping } from './rehype';

export const markdownProcessor = unified().use(remarkParser).use(remarkRehype).use(rehypeReact, {
  createElement: React.createElement,
  components: componentMapping,
});

export function splitFrontmatter(md: string): [string, string] {
  const mdfile = matter(md);
  const mdcontent = mdfile.content.replace(/^\s+/, '');
  return [mdfile.matter, mdcontent];
}
