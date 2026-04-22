import { ApiError } from '../utils/apiError.js';

export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

export function errorHandler(error, req, res, next) {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: error instanceof ApiError ? error.details : undefined,
  });
}
