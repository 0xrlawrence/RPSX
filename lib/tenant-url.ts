export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "";

/** Path-based portal route, always available. */
export function tenantPath(slug: string): string {
  return `/t/${slug}`;
}

/**
 * Public portal URL for a tenant. Uses the wildcard subdomain when a root
 * domain is configured, otherwise falls back to the path route.
 */
export function tenantUrl(slug: string): string {
  if (ROOT_DOMAIN) return `https://${slug}.${ROOT_DOMAIN}`;
  if (typeof window !== "undefined") {
    return `${window.location.origin}${tenantPath(slug)}`;
  }
  return tenantPath(slug);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
