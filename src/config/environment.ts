export const isDev = import.meta.env.DEV;

export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK !== 'false';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.recraft.app/api/v1';

export const SIMULATED_TIMEOUTS = {
  SCAN_ANALYSIS: 3000,
  ARCHITECT_GENERATION: 3500,
  MARKET_FETCH: 400,
} as const;
