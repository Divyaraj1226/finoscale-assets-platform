export function normalizeFinancials(data: any[]) {
  const years = data.map(d => d.year);

  const fieldsSet = new Set<string>();

  // collect all fields dynamically
  data.forEach(d => {
    Object.keys(d.bs.assets).forEach(key => {
      if (key !== 'given_assets_total') {
        fieldsSet.add(key);
      }
    });
  });

  const fields = Array.from(fieldsSet);

  const result: Record<string, any> = {};
  const totals: Record<string, number> = {};

  fields.forEach(field => {
    result[field] = {};

    data.forEach(d => {
      const value = d.bs.assets[field] ?? 0;
      result[field][d.year] = value;

      // calculate totals
      totals[d.year] = (totals[d.year] || 0) + value;
    });
  });

  return {
    years,
    fields,
    data: result,
    totals
  };
}