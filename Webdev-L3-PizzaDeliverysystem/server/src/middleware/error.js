export const notFound = (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
};

export const errorHandler = (err, req, res, next) => {
  console.error('[middleware/error]', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: 'Something went wrong. Please try again.',
  });
};
