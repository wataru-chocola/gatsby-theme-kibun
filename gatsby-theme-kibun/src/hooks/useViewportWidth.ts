import React from 'react';

export function useViewportWidth(): number {
  const [vpWidth, setVpWidth] = React.useState<number>(window.innerWidth);
  React.useEffect(() => {
    const onResize = () => {
      setVpWidth(window.innerWidth);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setVpWidth]);
  return vpWidth;
}
