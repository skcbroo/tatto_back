import { query } from '../config/database.js';
import { Favorite } from '../types/index.js';

export const FavoriteModel = {
  async create(userId: string, artistId: string): Promise<Favorite> {
    const result = await query(
      'INSERT INTO favorites (user_id, artist_id) VALUES ($1, $2) ON CONFLICT (user_id, artist_id) DO NOTHING RETURNING *',
      [userId, artistId]
    );
    return result.rows[0];
  },

  async findByUserId(userId: string): Promise<Favorite[]> {
    const result = await query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  async findByUserAndArtist(
    userId: string,
    artistId: string
  ): Promise<Favorite | null> {
    const result = await query(
      'SELECT * FROM favorites WHERE user_id = $1 AND artist_id = $2',
      [userId, artistId]
    );
    return result.rows[0] || null;
  },

  async delete(userId: string, artistId: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM favorites WHERE user_id = $1 AND artist_id = $2',
      [userId, artistId]
    );
    return (result.rowCount ?? 0) > 0;
  },
};
