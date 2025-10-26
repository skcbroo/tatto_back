import { query } from '../config/database.js';
import { Artist } from '../types/index.js';

export const ArtistModel = {
  async create(userId: string): Promise<Artist> {
    const result = await query(
      'INSERT INTO artists (user_id) VALUES ($1) RETURNING *',
      [userId]
    );
    return result.rows[0];
  },

  async findByUserId(userId: string): Promise<Artist | null> {
    const result = await query('SELECT * FROM artists WHERE user_id = $1', [
      userId,
    ]);
    return result.rows[0] || null;
  },

  async findById(id: string): Promise<Artist | null> {
    const result = await query('SELECT * FROM artists WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findAll(filters?: {
    city?: string;
    minRating?: number;
    specialty?: string;
  }): Promise<Artist[]> {
    let queryText = 'SELECT * FROM artists WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.city) {
      queryText += ` AND city ILIKE $${paramCount}`;
      params.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters?.minRating) {
      queryText += ` AND rating >= $${paramCount}`;
      params.push(filters.minRating);
      paramCount++;
    }

    if (filters?.specialty) {
      queryText += ` AND $${paramCount} = ANY(specialties)`;
      params.push(filters.specialty);
      paramCount++;
    }

    queryText += ' ORDER BY rating DESC, total_reviews DESC';

    const result = await query(queryText, params);
    return result.rows;
  },

  async update(id: string, data: Partial<Artist>): Promise<Artist | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'user_id' && value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(
      `UPDATE artists SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM artists WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
