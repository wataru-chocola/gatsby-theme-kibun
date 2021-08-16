import { visit, Visitor } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import { refractor } from 'refractor/lib/common';
import { Element } from 'hast';
import { Plugin } from 'unified';
import { Node as UnistNode } from 'unist';

interface Aliases {
  [alias: string]: string;
}

interface Options {
  ignoreMissing?: boolean;
  aliases?: Aliases;
}

const codeRefractor: Plugin<Options[]> = (options: Options) => {
  options = options || {};

  const visitor: Visitor<Element> = (node, _index, parent_tmp) => {
    const parent = parent_tmp as Element;
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }

    const classNames = (node.properties?.className || []) as string[];
    let lang = getLanguage(classNames, options?.aliases);
    if (lang === null) {
      lang = 'text';
    }

    let result;
    try {
      const langClass = 'language-' + lang;
      if (parent.properties != null) {
        const parent_classes = (parent.properties?.className || []) as string[];
        parent.properties.className = parent_classes.concat(langClass);
      } else {
        parent.properties = {
          className: [langClass],
        };
      }
      result = refractor.highlight(toString(node), lang);
    } catch (err) {
      if (options.ignoreMissing && /Unknown language/.test(err.message)) {
        return;
      }
      throw err;
    }

    node.children = result.children as Element[];
  };

  return (tree: UnistNode) => {
    visit<Element>(tree as Element, 'element', visitor);
  };
};
export default codeRefractor;

function getLanguage(classNames: string[], alias?: Aliases) {
  for (const classListItem of classNames) {
    if (classListItem.slice(0, 9) === 'language-') {
      const lang = classListItem.slice(9).toLowerCase();
      if (alias?.[lang]) {
        return alias?.[lang];
      }
      return lang;
    }
  }

  return null;
}
