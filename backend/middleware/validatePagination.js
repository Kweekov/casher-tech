const { normalizePagination } = require("../utils/pagination");

function validatePagination(req, _res, next) {
  const { limit, offset } = normalizePagination(req.query.limit, req.query.offset);
  req.pagination = { limit, offset };
  next();
}

module.exports = {
  validatePagination,
};
