const BASE_URL = import.meta.env.BASE_URL;

export function appPath(path: string): string {
  if (path.startsWith(BASE_URL)) return path;
  return `${BASE_URL}${path.replace(/^\/+/, '')}`;
}

export function assetPath(path: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path) || path.startsWith(BASE_URL)) {
    return path;
  }
  return `${BASE_URL}${path.replace(/^\/+/, '')}`;
}
