import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import { refractor } from 'refractor/lib/common';
import { Root as HastRoot, Element as HastElement } from 'hast';

interface Aliases {
  [lang: string]: string;
}

interface Options {
  aliases?: Aliases;
  dynamic?: boolean;
}

const aliasToName: Record<string, string> = {
  ps1: 'powershell',
  bat: 'batch',
  mysql: 'sql',
};

const defaultAliases = {
  bash: 'sh',
  go: 'golang',
  python: 'python3',
};
refractor.alias(defaultAliases);

function getLanguage(classNames: string[]) {
  for (const classListItem of classNames) {
    if (classListItem.slice(0, 9) === 'language-') {
      const lang = classListItem.slice(9).toLowerCase();
      return lang;
    }
  }

  return null;
}

export async function highlight(
  tree: HastRoot,
  options?: Options,
): Promise<[HastRoot, Array<string>]> {
  const missingLanguages = [] as Array<string>;

  const targets = [] as Array<[HastElement, HastElement]>;
  visit(tree, 'element', (node, _index, parent_tmp) => {
    const parent = parent_tmp as HastElement;
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }
    targets.push([node, parent]);
  });

  await Promise.all(
    targets.map(async ([node, parent]) => {
      const classNames = (node.properties?.className || []) as string[];
      let lang = getLanguage(classNames);
      if (lang === null) {
        lang = 'text';
      }

      if (!refractor.registered(lang)) {
        if (options?.dynamic) {
          let alias: string | null = null;
          if (aliasToName[lang] != null) {
            lang = aliasToName[lang];
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
        } else {
          missingLanguages.push(lang);
          lang = 'text';
        }
      }
      const result = refractor.highlight(toString(node), lang);

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
      return;
    }),
  );

  return [tree, missingLanguages];
}
