import React from 'react';

const defaultPrismAliasToName = new Map([
  ['ps1', 'powershell'],
  ['bat', 'batch'],
  ['common-lisp', 'lisp'],
  ['mysql', 'sql'],
  ['console', 'shell-session'],
]);

export type PrismAliasesFromQL = Array<{ alias: string; name: string }> | undefined;

export function usePrismAliasesMapFromQL(
  prismAliasesMapArray: PrismAliasesFromQL,
): Map<string, string> {
  const prismAliasesMap = React.useMemo(
    () =>
      new Map([
        ...(prismAliasesMapArray?.map((item) => [item!.alias, item!.name]) as [string, string][]),
        ...defaultPrismAliasToName,
      ]),
    [prismAliasesMapArray],
  );
  return prismAliasesMap;
}
