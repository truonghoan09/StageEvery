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

export type PaletteOption = {
  id: string;
  label: string;
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


/* =========================
   GET ALL PALETTES (for <select>)
========================= */

export function getPaletteOptions(): PaletteOption[] {
  return Object.entries(palettes).map(
    ([id, value]: any) => ({
      id,
      label: value.name ?? id,
    })
  );
}