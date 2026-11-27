export function normalizeSearch(text) {
    return (text || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}
export function filterOptions(options, query, selectedName) {
    const search = selectedName !== null && query === selectedName ? '' : query;
    const needle = normalizeSearch(search);
    return (options || [])
        .filter((o) => normalizeSearch(o.name).includes(needle) || (o.id ?? '').includes(search))
        .filter((o, i, arr) => arr.findIndex((x) => x.id === o.id) === i);
}
export function displayedText(value, options) {
    if (!value)
        return '';
    return options.find((o) => o.id === value)?.name ?? null;
}
