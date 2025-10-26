import { query } from '../config/database.js';
import { Service } from '../types/index.js';

export const ServiceModel = {
  async create(artistId: string, data: Partial<Service>): Promise<Service> {
    const result = await query(
      `INSERT INTO services (artist_id, name, description, price_min, price_max, duration_minutes, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        artistId,
        data.name,
        data.description,
        data.price_min,
        data.price_max,
        data.duration_minutes,
        data.category,
      ]
    );
    return result.rows[0];
  },

  async findById(id: string): Promise<Service | null> {
    const result = await query('SELECT * FROM services WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findByArtistId(artistId: string): Promise<Service[]> {
    const result = await query(
      'SELECT * FROM services WHERE artist_id = $1 AND is_active = true ORDER BY created_at DESC',
      [artistId]
    );
    return result.rows;
  },

  async update(id: string, data: Partial<Service>): Promise<Service | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'artist_id' && value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(
      `UPDATE services SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM services WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
