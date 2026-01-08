import palettes from './palettes.json';

type PaletteTokens = {
  bg: string;
  bgSoft: string;
  bgGradient?: string;
  text: string;
  textSoft: string;
  textMuted: string;
  primary: string;
};

export function getPaletteTokens(
  paletteId?: string
): PaletteTokens | null {
  if (!paletteId) {
    return palettes['neutral-balance']?.tokens ?? null;
  }

  const palette = (palettes as any)[paletteId];

  if (!palette || !palette.tokens) {
    return palettes['neutral-balance']?.tokens ?? null;
  }

  return palette.tokens;
}
