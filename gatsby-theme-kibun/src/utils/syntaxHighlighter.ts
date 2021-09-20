import { visit, Visitor } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import { refractor } from 'refractor/lib/common';
import { Element as HastElement } from 'hast';
import { Plugin } from 'unified';
import { Node as UnistNode } from 'unist';

interface Aliases {
  [lang: string]: string;
}

interface Options {
  ignoreMissing?: boolean;
  aliases?: Aliases;
}

const codeRefractor: Plugin<Options[]> = (options: Options) => {
  options = options || {};
  if (options?.aliases) {
    refractor.alias(options.aliases);
  }

  const visitor: Visitor<HastElement> = (node, _index, parent_tmp) => {
    const parent = parent_tmp as HastElement;
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }

    const classNames = (node.properties?.className || []) as string[];
    let lang = getLanguage(classNames);
    if (lang === null) {
      lang = 'text';
    }

    let result;
    try {
      result = refractor.highlight(toString(node), lang);
    } catch (err) {
      console.error(err);
      if (options.ignoreMissing && /Unknown language/.test(err.message)) {
        return;
      }
      throw err;
    }

    const langClass = 'language-' + lang;
    if (parent.properties != null) {
      const parent_classes = (parent.properties?.className || []) as string[];
      parent.properties.className = parent_classes.concat(langClass);
    } else {
      parent.properties = {
        className: [langClass],
      };
    }

    node.children = result.children as HastElement[];
  };

  return (tree: UnistNode) => {
    visit<HastElement, string>(tree as HastElement, 'element', visitor);
  };
};
export default codeRefractor;

function getLanguage(classNames: string[]) {
  for (const classListItem of classNames) {
    if (classListItem.slice(0, 9) === 'language-') {
      const lang = classListItem.slice(9).toLowerCase();
      return lang;
    }
  }

  return null;
}
