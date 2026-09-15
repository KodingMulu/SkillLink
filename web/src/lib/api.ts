export function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  // Standardize: ensure url ends with /api if omitted accidentally
  if (!url.endsWith('/api') && !url.includes('/api/')) {
    return `${url.replace(/\/+$/, '')}/api`;
  }
  return url;
}
