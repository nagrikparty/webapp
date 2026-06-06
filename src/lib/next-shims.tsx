import React from 'react';

export const Image = (props: any) => {
  const { src, alt, width, height, className, fill, priority, ...rest } = props;
  const style = fill ? { width: '100%', height: '100%', objectFit: 'cover' as any } : undefined;
  return <img src={typeof src === 'string' ? src : src?.src} alt={alt || ''} width={width} height={height} className={className} style={style} {...rest} />;
};

export const usePathname = () => {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '/';
};

export const useSearchParams = () => {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
};

export const useRouter = (): { push: (p: string) => void, replace: (p: string) => void, refresh: () => void } => ({
  push: (path: string) => {
    if (typeof window !== 'undefined') window.location.href = path;
  },
  replace: (path: string) => {
    if (typeof window !== 'undefined') window.location.href = path;
  },
  refresh: () => {
    if (typeof window !== 'undefined') window.location.reload();
  }
});
