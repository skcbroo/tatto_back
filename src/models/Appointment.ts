import { query } from '../config/database.js';
import { Appointment } from '../types/index.js';

export const AppointmentModel = {
  async create(data: {
    customerId: string;
    artistId: string;
    serviceId?: string;
    scheduledDate: string;
    scheduledTime: string;
    notes?: string;
    price?: number;
  }): Promise<Appointment> {
    const result = await query(
      `INSERT INTO appointments (customer_id, artist_id, service_id, scheduled_date, scheduled_time, notes, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        data.customerId,
        data.artistId,
        data.serviceId,
        data.scheduledDate,
        data.scheduledTime,
        data.notes,
        data.price,
      ]
    );
    return result.rows[0];
  },

  async findById(id: string): Promise<Appointment | null> {
    const result = await query('SELECT * FROM appointments WHERE id = $1', [
      id,
    ]);
    return result.rows[0] || null;
  },

  async findByCustomerId(customerId: string): Promise<Appointment[]> {
    const result = await query(
      'SELECT * FROM appointments WHERE customer_id = $1 ORDER BY scheduled_date DESC, scheduled_time DESC',
      [customerId]
    );
    return result.rows;
  },

  async findByArtistId(artistId: string): Promise<Appointment[]> {
    const result = await query(
      'SELECT * FROM appointments WHERE artist_id = $1 ORDER BY scheduled_date DESC, scheduled_time DESC',
      [artistId]
    );
    return result.rows;
  },

  async update(
    id: string,
    data: Partial<Appointment>
  ): Promise<Appointment | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (
        key !== 'id' &&
        key !== 'customer_id' &&
        key !== 'artist_id' &&
        value !== undefined
      ) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(
      `UPDATE appointments SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM appointments WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
