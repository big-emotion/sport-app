export const isMobile = () => {
  return window.innerWidth < 640;
};

export const isTablet = () => {
  return window.innerWidth >= 640 && window.innerWidth < 1024;
};

export const isDesktop = () => {
  return window.innerWidth >= 1024;
};
