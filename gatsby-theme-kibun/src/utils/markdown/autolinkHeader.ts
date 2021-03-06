import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import { h, s } from 'hastscript';
import GithubSlugger from 'github-slugger';
import { Root as HastRoot } from 'hast';
import { Plugin } from 'unified';

const headerTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const svgIcon = s(
  'svg',
  {
    ariaHidden: 'true',
    focusable: false,
    version: '1.1',
    viewBox: '0 0 16 16',
    width: 20,
    height: 20,
  },
  s('path', {
    fillRule: 'evenodd',
    d: 'M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z',
  }),
);

const autolinkHeader: Plugin<any[], HastRoot> = () => {
  const slugger = new GithubSlugger();

  return (tree: HastRoot) => {
    visit(tree, 'element', (node, _index, _parent) => {
      if (!headerTags.has(node.tagName)) {
        return;
      }

      let headerId = node.properties?.id;
      if (!headerId) {
        const nodeText = toString(node);
        headerId = slugger.slug(nodeText, false);
      }

      if (node.properties != null) {
        node.properties.id = headerId;
      } else {
        node.properties = {
          id: headerId,
        };
      }
      const link = h('a', { href: `#${headerId}`, class: 'auto-headers' }, svgIcon);
      node.children.push(link);
    });
    slugger.reset();
  };
};

export default autolinkHeader;
