import { visit, Visitor } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import { Element, Root } from 'hast';

const headerTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

export default function hastToc(tree: Element): Root | null {
  let toc: Root | null = null;

  const visitor: Visitor<Element> = (node, _index, _parent) => {
    if (!headerTags.has(node.tagName)) {
      return;
    }

    const headerDepth = parseInt(node.tagName.substring(1, 2));
    const headerTitle = toString(node);
    if (toc == null) {
      toc = h(null, [h('ul')]);
    }

    let listContainer = toc.children[0] as Element;
    for (let i = 1; i < headerDepth; i++) {
      let lastItem = listContainer.children[listContainer.children.length - 1] as Element;
      if (lastItem == null) {
        lastItem = h('li', '(missing header)');
        listContainer.children.push(lastItem);
      }

      let lastChildOfItem = lastItem.children[lastItem.children.length - 1] as Element;
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
    let headerItem: Element | string;
    if (!headerId) {
      headerItem = headerTitle;
    } else {
      headerItem = h('a', { href: `#${headerId}` }, headerTitle);
    }

    listContainer.children.push(h('li', headerItem));
  };

  visit<Element>(tree, 'element', visitor);
  return toc;
}
