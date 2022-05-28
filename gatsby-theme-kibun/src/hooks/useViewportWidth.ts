import React from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useViewportWidth(): number {
  const [vpWidth, setVpWidth] = React.useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );
  useIsomorphicLayoutEffect(() => {
    const onResize = () => {
      setVpWidth(window.innerWidth);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setVpWidth]);
  return vpWidth;
}
