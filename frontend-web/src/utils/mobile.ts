export const isMobile = (): boolean => {
  return window.innerWidth < 640;
};

export const isTablet = (): boolean => {
  return window.innerWidth >= 640 && window.innerWidth < 1024;
};

export const isDesktop = (): boolean => {
  return window.innerWidth >= 1024;
};
