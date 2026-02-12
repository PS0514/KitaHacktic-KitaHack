export type SwitchMode =
  | 'OPTIONS'
  | 'LOADING'
  | 'SENTENCES';

export function nextMode(mode: SwitchMode): SwitchMode {
  if (mode === 'OPTIONS') return 'LOADING';
  if (mode === 'LOADING') return 'SENTENCES';
  return 'OPTIONS';
}
