// Ignore la casse et les accents : « nestle » trouve « Nestlé »
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
