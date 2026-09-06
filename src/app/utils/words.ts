const NUMBER_WORD = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
];

/**
 * Small numbers spelled out.
 *
 * Headlines on this site are set at up to 128px, where a lone digit reads as a
 * label rather than a sentence. Counts are derived from the data so the copy
 * can never drift out of date — this just makes the result look like prose.
 * Falls back to digits above twenty, which is the usual editorial convention.
 */
export function words(n: number): string {
  return NUMBER_WORD[n] ?? String(n);
}

/** Same, capitalised — for the start of a sentence or a heading. */
export function Words(n: number): string {
  const w = words(n);
  return w.charAt(0).toUpperCase() + w.slice(1);
}
