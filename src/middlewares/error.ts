import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/apiError';

export default function errorMiddleware(
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err instanceof ApiError) {
        res.status(err.status).json({
            message: err.message,
            errors: err.errors,
        });
        return;
    }

    console.error('Unexpected error', err);
    res.status(500).json({ message: 'Unexpected error' });
}
