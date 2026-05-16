// Backend/src/middleware/errorHandler.js
// WHY: Without this, any unhandled error crashes the server during your demo. Critical.

export function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${err.stack}`);
  
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}