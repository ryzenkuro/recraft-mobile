import { useMockControlsStore } from '@/config/mockControls';

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function simulatedNetworkDelay(baseMs: number): Promise<void> {
  const { simulateSlowNetwork, consumeForcedError } =
    useMockControlsStore.getState();
  const multiplier = simulateSlowNetwork ? 3 : 1;
  await delay(baseMs * multiplier);

  const forcedError = consumeForcedError();
  if (forcedError) {
    throw new Error(forcedError);
  }
}
