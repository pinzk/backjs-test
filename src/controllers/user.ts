import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/apiError';
import UserService from '../service/userService';

class UserController {

    async reserve(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> {
        try {
            const { event_id, user_id } = req.body;

            if (!event_id || !user_id) {
                throw ApiError.BadRequest('event_id and user_id are required');
            }

            const reservation = await UserService.reserve({ event_id, user_id });

            return res.json(reservation);
        } catch (e) {
            next(e);
        }
    }

    async getAllBookings(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | void> {
        try {
            const bookings = await UserService.getAllBookings();

            return res.json(bookings);
        } catch (e) {
            next(e);
        }
    }
}


export default new UserController();