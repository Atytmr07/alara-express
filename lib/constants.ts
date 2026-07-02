// Demo-only constants. There is NO real backend/auth — this is a client-side
// gate purely so the client can demo the admin flow. Do not use in production.

/** localStorage key that holds the live (editable) menu for the demo.
 *  Bumped to v2 when calories/portion were added so old caches re-seed. */
export const MENU_STORAGE_KEY = "alara-menu-v2";

/** localStorage flag set once the demo admin password is accepted. */
export const ADMIN_FLAG_KEY = "alara-admin";

/** Hardcoded demo password for the admin gate. */
export const ADMIN_PASSWORD = "alara2026";

/** Tiny sea-wash SVG shimmer used as the next/image blur placeholder. */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNFNEY0RjQiLz48L3N2Zz4=";
