import { query } from '../config/database.js';
import { Message } from '../types/index.js';

export const MessageModel = {
  async create(
    senderId: string,
    recipientId: string,
    content: string
  ): Promise<Message> {
    const result = await query(
      'INSERT INTO messages (sender_id, recipient_id, content) VALUES ($1, $2, $3) RETURNING *',
      [senderId, recipientId, content]
    );
    return result.rows[0];
  },

  async findById(id: string): Promise<Message | null> {
    const result = await query('SELECT * FROM messages WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findConversation(
    userId1: string,
    userId2: string
  ): Promise<Message[]> {
    const result = await query(
      `SELECT * FROM messages
       WHERE (sender_id = $1 AND recipient_id = $2)
          OR (sender_id = $2 AND recipient_id = $1)
       ORDER BY created_at ASC`,
      [userId1, userId2]
    );
    return result.rows;
  },

  async findUserMessages(userId: string): Promise<Message[]> {
    const result = await query(
      `SELECT * FROM messages
       WHERE sender_id = $1 OR recipient_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async markAsRead(id: string): Promise<Message | null> {
    const result = await query(
      'UPDATE messages SET is_read = true WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM messages WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
