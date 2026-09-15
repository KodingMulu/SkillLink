export function getApiUrl(path: string = ''): string {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const baseUrl = (!url.endsWith('/api') && !url.includes('/api/'))
    ? `${url.replace(/\/+$/, '')}/api`
    : url;
  if (!path) return baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl.replace(/\/+$/, '')}${cleanPath}`;
}

