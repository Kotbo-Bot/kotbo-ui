export type SelectOption = { id: string; name: string };

export function normalizeSearch(text: string): string {
  return (text || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function filterOptions<T extends SelectOption>(
  options: readonly T[],
  query: string,
  selectedName: string | null,
): T[] {
  const search = selectedName !== null && query === selectedName ? '' : query;
  const needle = normalizeSearch(search);
  return (options || [])
    .filter((o) => normalizeSearch(o.name).includes(needle) || (o.id ?? '').includes(search))
    .filter((o, i, arr) => arr.findIndex((x) => x.id === o.id) === i);
}

export function displayedText(value: string | null, options: readonly SelectOption[]): string | null {
  if (!value) return '';
  return options.find((o) => o.id === value)?.name ?? null;
}
