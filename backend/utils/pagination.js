function normalizePagination(limitRaw, offsetRaw, defaults = { limit: 20, maxLimit: 200 }) {
  let limit = Number.parseInt(limitRaw, 10);
  let offset = Number.parseInt(offsetRaw, 10);

  if (Number.isNaN(limit)) limit = defaults.limit;
  if (Number.isNaN(offset)) offset = 0;

  if (limit < 1) limit = defaults.limit;
  if (offset < 0) offset = 0;
  if (limit > defaults.maxLimit) limit = defaults.maxLimit;

  return { limit, offset };
}

module.exports = {
  normalizePagination,
};
