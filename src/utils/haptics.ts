import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export async function triggerHaptic(
  level: 'LIGHT' | 'MEDIUM' | 'HEAVY' = 'LIGHT'
): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const styleMap: Record<'LIGHT' | 'MEDIUM' | 'HEAVY', ImpactStyle> = {
    LIGHT: ImpactStyle.Light,
    MEDIUM: ImpactStyle.Medium,
    HEAVY: ImpactStyle.Heavy,
  };

  try {
    await Haptics.impact({ style: styleMap[level] });
  } catch {
    // Abaikan bila perangkat tidak mendukung haptics
  }
}
