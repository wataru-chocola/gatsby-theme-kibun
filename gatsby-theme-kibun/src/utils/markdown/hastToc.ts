import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import { Element as HastElement, Root } from 'hast';
import { hast2react } from './hast2react';
import { Root as HastRoot } from 'hast';

const headerTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

export function hast2toc(hast: HastRoot): React.ReactElement | null {
  const toc = hastToc(hast);
  if (toc == null) {
    return null;
  }
  return hast2react(toc);
}

export default function hastToc(tree: HastRoot): Root | null {
  let toc: Root | null = null;

  visit(tree, 'element', (node, _index, _parent) => {
    if (!headerTags.has(node.tagName)) {
      return;
    }

    const headerDepth = parseInt(node.tagName.substring(1, 2));
    const headerTitle = toString(node);
    if (toc == null) {
      toc = h(null, [h('ul')]);
    }

    let listContainer = toc.children[0] as HastElement;
    for (let i = 1; i < headerDepth; i++) {
      let lastItem = listContainer.children[listContainer.children.length - 1] as HastElement;
      if (lastItem == null) {
        lastItem = h('li', '(missing header)');
        listContainer.children.push(lastItem);
      }

      let lastChildOfItem = lastItem.children[lastItem.children.length - 1] as HastElement;
      if (
        lastChildOfItem == null ||
        !(lastChildOfItem.type === 'element' && lastChildOfItem.tagName === 'ul')
      ) {
        lastChildOfItem = h('ul');
        lastItem.children.push(lastChildOfItem);
      }
      listContainer = lastChildOfItem;
    }

    const headerId = node.properties?.id;
    let headerItem: HastElement | string;
    if (!headerId) {
      headerItem = headerTitle;
    } else {
      headerItem = h('a', { href: `#${headerId}` }, headerTitle);
    }

    listContainer.children.push(h('li', headerItem));
  });

  return toc;
}
