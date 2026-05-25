/**
 * Single source of truth for WebSocket + WS-backed HTTP endpoints.
 * Uses the API base URL and derives the Socket.IO origin from it.
 */
function resolveBase(): string {
  const api = import.meta.env.VITE_API_BASE_URL?.trim();
  return api && api.length > 0 ? api.replace(/\/$/, '') : 'http://localhost:5000';
}

export const WS_API_BASE: string = resolveBase();
export const WS_SOCKET_URL: string = WS_API_BASE.replace(/^http/i, 'ws');
