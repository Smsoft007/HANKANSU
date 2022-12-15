const createError = require('http-errors');
export default (res, req, next) => {
  next(createError(404));
};
