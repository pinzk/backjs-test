import { pool } from '../config/database';
import { ApiError } from '../exceptions/apiError';
import { Booking } from '../models/Booking';

class UserService {

    async reserve({event_id, user_id}: {event_id: number, user_id: string}): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const eventRes = await client.query(
                'SELECT id, total_seats FROM events WHERE id = $1 FOR UPDATE',
                [event_id]
            );

            if (eventRes.rows.length === 0) {
                throw ApiError.BadRequest('Event not found');
            }

            const event = eventRes.rows[0];
            
            const bookingCountRes = await client.query(
                'SELECT COUNT(*) FROM bookings WHERE event_id = $1',
                [event_id]
            );
            const bookedSeats = parseInt(bookingCountRes.rows[0].count, 10);

            if (bookedSeats >= event.total_seats) {
                throw ApiError.BadRequest('No available seats');
            }

            const insertRes = await client.query(
                `INSERT INTO bookings (event_id, user_id, created_at)
                 VALUES ($1, $2, NOW())
                 RETURNING id, event_id, user_id, created_at`,
                [event_id, user_id]
            );

            await client.query('COMMIT');

            return insertRes.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    async getAllBookings(): Promise<Booking[]> {
        try {
            const res = await pool.query<Booking>(
                'SELECT id, event_id, user_id, created_at FROM bookings ORDER BY created_at DESC'
            );
            return res.rows;
        } catch (err) {
            throw err;
        }
    }

}

export default new UserService();