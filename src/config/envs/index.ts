export const BASE_API_URL = import.meta.env.VITE_API_URL;
export const BASE_WS_URL: string | undefined =
  import.meta.env.VITE_WS_URL ?? BASE_API_URL?.replace(/^http/, 'ws');
