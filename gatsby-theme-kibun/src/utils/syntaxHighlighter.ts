import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import { refractor } from 'refractor/lib/common';
import { Root as HastRoot, Element as HastElement } from 'hast';

interface Aliases {
  [lang: string]: string;
}

interface Options {
  aliases?: Aliases;
  aliasToNameMap?: Map<string, string>;
}

const defaultAliases = {
  bash: 'sh',
  go: 'golang',
  python: 'python3',
};
refractor.alias(defaultAliases);

export function highlightSync(tree: HastRoot, options?: Options): [HastRoot, Array<string>] {
  if (options?.aliases) {
    refractor.alias(options.aliases);
  }

  const missingLanguages = [] as Array<string>;
  const targets = getCodeElements(tree);
  targets.map(([node, parent]) => {
    const classNames = (node.properties?.className || []) as string[];
    let lang = getLanguage(classNames);

    if (!refractor.registered(lang)) {
      missingLanguages.push(lang);
      lang = 'text';
    }
    const result = refractor.highlight(toString(node), lang);

    addLangClassToParent(parent, lang);
    node.children = result.children as HastElement[];
    return null;
  });

  return [tree, missingLanguages];
}

export async function highlightAsync(
  tree: HastRoot,
  options?: Options,
): Promise<[HastRoot, Array<string>]> {
  if (options?.aliases) {
    refractor.alias(options.aliases);
  }

  const aliasToNameMap = options?.aliasToNameMap || new Map();
  const missingLanguages = [] as Array<string>;
  const targets = getCodeElements(tree);

  await Promise.all(
    targets.map(async ([node, parent]) => {
      const classNames = (node.properties?.className || []) as string[];
      let lang = getLanguage(classNames);

      if (!refractor.registered(lang)) {
        let alias: string | null = null;
        if (aliasToNameMap.has(lang)) {
          lang = aliasToNameMap.get(lang);
          alias = lang;
        }
        try {
          const module = await import(`refractor/lang/${lang}.js`);
          refractor.register(module.default);
          if (alias != null) {
            refractor.alias(lang, alias);
          }
        } catch (e) {
          if (/Cannot find module/.test(e.message)) {
            missingLanguages.push(lang);
            lang = 'text';
          }
        }
      }
      const result = refractor.highlight(toString(node), lang);

      addLangClassToParent(parent, lang);
      node.children = result.children as HastElement[];
    }),
  );

  return [tree, missingLanguages];
}

function getLanguage(classNames: string[]) {
  for (const classListItem of classNames) {
    if (classListItem.slice(0, 9) === 'language-') {
      const lang = classListItem.slice(9).toLowerCase();
      return lang;
    }
  }

  return 'text';
}

function getCodeElements(tree: HastRoot): Array<[HastElement, HastElement]> {
  const targets = [] as Array<[HastElement, HastElement]>;
  visit(tree, 'element', (node, _index, parent_tmp) => {
    const parent = parent_tmp as HastElement;
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }
    targets.push([node, parent]);
  });
  return targets;
}

function addLangClassToParent(parent: HastElement, lang: string): void {
  const langClass = 'language-' + lang;
  if (parent.properties != null) {
    const parent_classes = (parent.properties?.className || []) as string[];
    parent.properties.className = parent_classes.concat(langClass);
  } else {
    parent.properties = {
      className: [langClass],
    };
  }
}
