import logger from './logger.js';
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}
class UnauthenticatedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthenticatedError';
        this.statusCode = 401;
    }
}
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 403;
    }
}
class PaymentAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PaymentAPIError';
        this.statusCode = 403;
    }
}
class CacheAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CacheAPIError';
        this.statusCode = 403;
    }
}
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}
const notFoundHandler = () => {
    throw new NotFoundError('Route not found');
};
const errorHandler = (err, req, res, next) => {
    const { statusCode = 500, message = 'Internal Server Error' } = err;
    if (statusCode >= 500)
        logger.error(`${message}, \n_Stack:_ ${err.stack} `);
    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    });
};
export { NotFoundError, ValidationError, UnauthenticatedError, UnauthorizedError, PaymentAPIError, CacheAPIError, notFoundHandler, errorHandler, };
