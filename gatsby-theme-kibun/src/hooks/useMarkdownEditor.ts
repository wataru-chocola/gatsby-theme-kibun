import React from 'react';

import { splitFrontmatter } from '../utils/markdown/markdownParser';

import { useMarkdownRenderer } from './useMarkdownRenderer';
import { ImageDataFromQL } from './useImageDataCollectionFromQL';
import { PrismAliasesFromQL } from './usePrismAliasesMapFromQL';

export function useMarkdownEditor(
  content: string,
  slug: string,
  images: ImageDataFromQL,
  prismAliasesMap: PrismAliasesFromQL,
): {
  toc: React.ReactElement | null;
  html: React.ReactElement | null;
  frontmatter: string;
  markdown: string;
  editor: {
    saveFrontmatter: (frontmatter: string) => void;
    saveMarkdown: (md: string) => void;
    renderMarkdown: (md: string) => void;
    resetMarkdown: () => void;
  };
} {
  const parsed = splitFrontmatter(content);
  const [frontmatter, saveFrontmatter] = React.useState(parsed[0]);
  const [markdown, saveMarkdown] = React.useState(parsed[1]);

  const {
    setMarkdown: renderMarkdown,
    html,
    toc,
  } = useMarkdownRenderer(markdown, slug, {
    imageDataFromQL: images,
    prismAliasesFromQL: prismAliasesMap,
  });
  const resetMarkdown = React.useCallback(
    () => renderMarkdown(markdown),
    [markdown, renderMarkdown],
  );

  React.useEffect(() => renderMarkdown(markdown), [markdown, renderMarkdown]);

  return {
    html,
    toc,
    frontmatter,
    markdown,
    editor: {
      saveFrontmatter,
      saveMarkdown,
      renderMarkdown,
      resetMarkdown,
    },
  };
}
