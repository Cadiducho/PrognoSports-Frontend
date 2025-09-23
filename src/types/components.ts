export const TAG_COLORS = [
  'primary',
  'success',
  'error',
  'warning',
  'info',
  'pink',
  'neutral'
] as const;

export type TagColor = typeof TAG_COLORS[number];

export const TAG_SIZES = [
  'small',
  'medium',
  'large',
] as const;

export type TagSize = typeof TAG_SIZES[number];
