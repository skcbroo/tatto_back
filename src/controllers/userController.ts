import { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const userController = {
  async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await UserModel.findById(id);
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      const { password_hash, ...userWithoutPassword } = user;

      return successResponse(res, userWithoutPassword);
    } catch (error) {
      console.error('Get profile error:', error);
      return errorResponse(res, 'Failed to get profile', 500);
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { full_name, phone, avatar_url } = req.body;

      const updatedUser = await UserModel.update(req.user.userId, {
        full_name,
        phone,
        avatar_url,
      });

      if (!updatedUser) {
        return errorResponse(res, 'Failed to update profile');
      }

      const { password_hash, ...userWithoutPassword } = updatedUser;

      return successResponse(res, userWithoutPassword, 'Profile updated');
    } catch (error) {
      console.error('Update profile error:', error);
      return errorResponse(res, 'Failed to update profile', 500);
    }
  },

  async deleteAccount(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const deleted = await UserModel.delete(req.user.userId);
      if (!deleted) {
        return errorResponse(res, 'Failed to delete account');
      }

      return successResponse(res, null, 'Account deleted successfully');
    } catch (error) {
      console.error('Delete account error:', error);
      return errorResponse(res, 'Failed to delete account', 500);
    }
  },
};
