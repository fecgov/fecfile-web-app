const DEFAULT_API_ORIGIN = 'http://localhost:8080';
const DEFAULT_API_URL = `${DEFAULT_API_ORIGIN}/api/v1`;
const DEFAULT_ROUTE_PREFIX = '/api/v1';

function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

function ensureLeadingSlash(value: string): string {
  return value.startsWith('/') ? value : `/${value}`;
}

export class ApiUtils {
  static apiBaseUrl(): string {
    const configured = Cypress.env('apiUrl');
    const resolved =
      typeof configured === 'string' && configured.trim().length > 0
        ? configured.trim()
        : DEFAULT_API_URL;

    return stripTrailingSlashes(resolved);
  }

  static apiPath(path: string): string {
    return `${this.apiBaseUrl()}${ensureLeadingSlash(path)}`;
  }

  static apiRoutePrefix(): string {
    try {
      const parsed = new URL(this.apiBaseUrl());
      const normalized = stripTrailingSlashes(parsed.pathname);
      return normalized || DEFAULT_ROUTE_PREFIX;
    } catch {
      return DEFAULT_ROUTE_PREFIX;
    }
  }

  static apiRoutePathname(path: string): string {
    return `${this.apiRoutePrefix()}${ensureLeadingSlash(path)}`;
  }
}
