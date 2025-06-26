module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const payload = {
    status: 'error',
    message: err.message || 'Internal Server Error'
  };
  if (err.details) payload.details = err.details;
  res.status(status).json(payload);
};