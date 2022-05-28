import React from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

function getWidth(e: HTMLElement): number {
  const rect = e.getBoundingClientRect();
  return rect.width;
}

export function useElementWidth(ref: React.RefObject<HTMLElement>): number {
  const [contentBoxWidth, setContentBoxWidth] = React.useState(
    ref.current ? getWidth(ref.current) : 0,
  );
  useIsomorphicLayoutEffect(() => {
    const updateBoxWidth = () => {
      if (ref.current !== null) {
        setContentBoxWidth(getWidth(ref.current));
      }
    };

    updateBoxWidth();
    window.addEventListener('resize', updateBoxWidth);
    return () => window.removeEventListener('resize', updateBoxWidth);
  }, [setContentBoxWidth, ref]);

  return contentBoxWidth;
}
