export const mapPageUrl = (rootPageId?: string) => (pageId: string) => {
  pageId = (pageId || '').replace(/-/g, '');

  if (rootPageId && pageId === rootPageId) {
    return '/';
  } else {
    return `/${pageId}`;
  }
};
