type DebugMeta = Record<string, unknown>;

const DEBUG_ROUTE =
  process.env.DEBUG_ROUTING === "1" || process.env.NEXT_PUBLIC_DEBUG_ROUTING === "1";

export function isRouteDebugEnabled() {
  return DEBUG_ROUTE;
}

export function routeDebug(scope: string, message: string, meta?: DebugMeta) {
  if (!DEBUG_ROUTE) return;
  const line = `[route-debug][${scope}] ${message}`;
  if (meta) {
    console.info(line, meta);
    return;
  }
  console.info(line);
}

