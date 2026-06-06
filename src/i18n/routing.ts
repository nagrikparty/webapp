import React from 'react';

export const Link = ({ href, children, className, onClick }: any) => {
  return React.createElement('a', { href, className, onClick }, children);
};

export const usePathname = () => {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '/';
};

export const useRouter = () => ({
  push: (path: string) => {
    if (typeof window !== 'undefined') window.location.href = path;
  }
});

export const redirect = (path: string) => {
  // dummy
};
