import { Request, Response } from 'express';
import { FavoriteModel } from '../models/Favorite.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const favoriteController = {
  async add(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { artist_id } = req.body;

      if (!artist_id) {
        return errorResponse(res, 'Artist ID is required');
      }

      const favorite = await FavoriteModel.create(req.user.userId, artist_id);

      return successResponse(res, favorite, 'Artist added to favorites', 201);
    } catch (error) {
      console.error('Add favorite error:', error);
      return errorResponse(res, 'Failed to add favorite', 500);
    }
  },

  async getMyFavorites(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const favorites = await FavoriteModel.findByUserId(req.user.userId);

      return successResponse(res, favorites);
    } catch (error) {
      console.error('Get favorites error:', error);
      return errorResponse(res, 'Failed to get favorites', 500);
    }
  },

  async remove(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { artistId } = req.params;

      const deleted = await FavoriteModel.delete(req.user.userId, artistId);

      if (!deleted) {
        return errorResponse(res, 'Favorite not found', 404);
      }

      return successResponse(res, null, 'Artist removed from favorites');
    } catch (error) {
      console.error('Remove favorite error:', error);
      return errorResponse(res, 'Failed to remove favorite', 500);
    }
  },
};
