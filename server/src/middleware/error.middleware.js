const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(status).json({
    error: {
      message,
      code
    }
  });
};

module.exports = errorMiddleware;
