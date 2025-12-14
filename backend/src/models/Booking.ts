import pool from '../config/database';

export interface Booking {
  id?: number;
  property_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  start_date: string;
  end_date: string;
  status?: string;
  message?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class BookingModel {
  static async create(booking: Booking): Promise<Booking> {
    const result = await pool.query(
      `INSERT INTO bookings (property_id, customer_name, customer_email, customer_phone, start_date, end_date, status, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        booking.property_id,
        booking.customer_name,
        booking.customer_email,
        booking.customer_phone,
        booking.start_date,
        booking.end_date,
        booking.status || 'pending',
        booking.message,
      ]
    );
    return result.rows[0];
  }

  static async findAll(): Promise<Booking[]> {
    const result = await pool.query(
      `SELECT b.*, p.title as property_title 
       FROM bookings b 
       LEFT JOIN properties p ON b.property_id = p.id 
       ORDER BY b.created_at DESC`
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Booking | null> {
    const result = await pool.query(
      `SELECT b.*, p.title as property_title 
       FROM bookings b 
       LEFT JOIN properties p ON b.property_id = p.id 
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByProperty(propertyId: number): Promise<Booking[]> {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE property_id = $1 ORDER BY start_date ASC',
      [propertyId]
    );
    return result.rows;
  }

  static async update(id: number, booking: Partial<Booking>): Promise<Booking | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(booking).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE bookings SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
