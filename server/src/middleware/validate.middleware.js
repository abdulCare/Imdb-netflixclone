const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    req.body = result.body;
    req.params = result.params;
    req.query = result.query;
    next();
  } catch (error) {
    return res.status(400).json({
      error: {
        message: error.errors?.[0]?.message || 'Invalid request',
        code: 'VALIDATION_ERROR'
      }
    });
  }
};

module.exports = validate;
