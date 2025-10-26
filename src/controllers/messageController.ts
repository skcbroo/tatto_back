import { Request, Response } from 'express';
import { MessageModel } from '../models/Message.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const messageController = {
  async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { recipient_id, content } = req.body;

      if (!recipient_id || !content) {
        return errorResponse(res, 'Recipient and content are required');
      }

      const message = await MessageModel.create(
        req.user.userId,
        recipient_id,
        content
      );

      return successResponse(res, message, 'Message sent', 201);
    } catch (error) {
      console.error('Create message error:', error);
      return errorResponse(res, 'Failed to send message', 500);
    }
  },

  async getConversation(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { userId } = req.params;

      const messages = await MessageModel.findConversation(
        req.user.userId,
        userId
      );

      return successResponse(res, messages);
    } catch (error) {
      console.error('Get conversation error:', error);
      return errorResponse(res, 'Failed to get conversation', 500);
    }
  },

  async getMyMessages(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const messages = await MessageModel.findUserMessages(req.user.userId);

      return successResponse(res, messages);
    } catch (error) {
      console.error('Get messages error:', error);
      return errorResponse(res, 'Failed to get messages', 500);
    }
  },

  async markAsRead(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;

      const message = await MessageModel.findById(id);
      if (!message) {
        return errorResponse(res, 'Message not found', 404);
      }

      if (message.recipient_id !== req.user.userId) {
        return errorResponse(res, 'Access denied', 403);
      }

      const updatedMessage = await MessageModel.markAsRead(id);

      return successResponse(res, updatedMessage, 'Message marked as read');
    } catch (error) {
      console.error('Mark as read error:', error);
      return errorResponse(res, 'Failed to mark message as read', 500);
    }
  },
};
