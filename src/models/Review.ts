import { query } from '../config/database.js';
import { Review } from '../types/index.js';

export const ReviewModel = {
  async create(data: {
    appointmentId: string;
    customerId: string;
    artistId: string;
    rating: number;
    comment?: string;
    images?: string[];
  }): Promise<Review> {
    const result = await query(
      `INSERT INTO reviews (appointment_id, customer_id, artist_id, rating, comment, images)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        data.appointmentId,
        data.customerId,
        data.artistId,
        data.rating,
        data.comment,
        data.images,
      ]
    );
    return result.rows[0];
  },

  async findById(id: string): Promise<Review | null> {
    const result = await query('SELECT * FROM reviews WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findByArtistId(artistId: string): Promise<Review[]> {
    const result = await query(
      'SELECT * FROM reviews WHERE artist_id = $1 ORDER BY created_at DESC',
      [artistId]
    );
    return result.rows;
  },

  async findByCustomerId(customerId: string): Promise<Review[]> {
    const result = await query(
      'SELECT * FROM reviews WHERE customer_id = $1 ORDER BY created_at DESC',
      [customerId]
    );
    return result.rows;
  },

  async update(id: string, data: Partial<Review>): Promise<Review | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (
        key !== 'id' &&
        key !== 'appointment_id' &&
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
      `UPDATE reviews SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM reviews WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
