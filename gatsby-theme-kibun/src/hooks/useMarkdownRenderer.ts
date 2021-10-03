import React, { useEffect } from 'react';

import { md2hast } from '../utils/markdown/markdownParser';
import { hast2toc } from '../utils/markdown/hastToc';
import { hast2react } from '../utils/markdown/hast2react';
import { highlightSync, highlightAsync } from '../utils/syntaxHighlighter';

import { usePrismAliasesMapFromQL, PrismAliasesFromQL } from '../hooks/usePrismAliasesMapFromQL';
import {
  useImageDataCollectionFromQL,
  ImageDataFromQL,
} from '../hooks/useImageDataCollectionFromQL';

import { useAppDispatch } from '../state/hooks';
import { snackMessageActions } from '../state/snackMessageSlice';

export function useMarkdownRenderer(
  md: string,
  slug: string,
  options?: {
    imageDataFromQL: ImageDataFromQL;
    prismAliasesFromQL: PrismAliasesFromQL;
  },
): {
  toc: React.ReactElement | null;
  html: React.ReactElement | null;
  setMarkdown: (md: string) => void;
} {
  const dispatch = useAppDispatch();
  const [markdown, setMarkdown] = React.useState(md);

  const imageDataCollection = useImageDataCollectionFromQL(options?.imageDataFromQL);
  const prismAliasesMap = usePrismAliasesMapFromQL(options?.prismAliasesFromQL);

  const hast = React.useMemo(() => {
    try {
      return md2hast(markdown);
    } catch (e) {
      console.error(e);
      dispatch(snackMessageActions.hideMessage({}));
      dispatch(snackMessageActions.addErrorMessage(e, 3000, 'failed to parse markdown: '));
      return null;
    }
  }, [markdown, dispatch]);

  const [html, setHtml] = React.useState<React.ReactElement | null>(null);
  const missingLanguages = React.useMemo<Array<string>>(() => {
    if (hast == null) {
      setHtml(null);
      return [];
    }
    const [highlighted, missingLanguagesTmp] = highlightSync(hast);
    const missingLanguages: Array<string> = [];
    for (const missingLang of missingLanguagesTmp) {
      if (prismAliasesMap.has(missingLang)) {
        missingLanguages.push(missingLang);
      } else {
        console.warn(`unknown syntax: ${missingLang}`);
      }
    }

    setHtml(highlighted != null ? hast2react(highlighted, slug, imageDataCollection) : null);
    return missingLanguages;
  }, [hast, slug, imageDataCollection, prismAliasesMap]);

  useEffect(() => {
    const f = async () => {
      if (hast == null || missingLanguages.length === 0) {
        return;
      }

      const [highlightedTmp, _missingLanguagesTmp] = await highlightAsync(hast, {
        aliasToNameMap: prismAliasesMap,
      });
      try {
        setHtml(hast2react(highlightedTmp, slug, imageDataCollection));
      } catch (e) {
        console.error(e);
        dispatch(snackMessageActions.hideMessage({}));
        dispatch(snackMessageActions.addErrorMessage(e, 3000, 'failed to render html: '));
        return;
      }
    };
    f();
  }, [missingLanguages, prismAliasesMap, imageDataCollection, hast, slug, dispatch]);

  const toc = React.useMemo<React.ReactElement | null>(() => {
    try {
      return hast != null ? hast2toc(hast) : null;
    } catch (e) {
      console.error(e);
      dispatch(snackMessageActions.hideMessage({}));
      dispatch(snackMessageActions.addErrorMessage(e, 3000, 'failed to create toc: '));
      return null;
    }
  }, [hast, dispatch]);

  return { toc, html, setMarkdown };
}
