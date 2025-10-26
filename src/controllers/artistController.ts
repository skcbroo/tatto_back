import { Request, Response } from 'express';
import { ArtistModel } from '../models/Artist.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const artistController = {
  async getAll(req: Request, res: Response) {
    try {
      const { city, minRating, specialty } = req.query;

      const filters: any = {};
      if (city) filters.city = city as string;
      if (minRating) filters.minRating = parseFloat(minRating as string);
      if (specialty) filters.specialty = specialty as string;

      const artists = await ArtistModel.findAll(filters);

      return successResponse(res, artists);
    } catch (error) {
      console.error('Get artists error:', error);
      return errorResponse(res, 'Failed to get artists', 500);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const artist = await ArtistModel.findById(id);
      if (!artist) {
        return errorResponse(res, 'Artist not found', 404);
      }

      return successResponse(res, artist);
    } catch (error) {
      console.error('Get artist error:', error);
      return errorResponse(res, 'Failed to get artist', 500);
    }
  },

  async getMyProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const artist = await ArtistModel.findByUserId(req.user.userId);
      if (!artist) {
        return errorResponse(res, 'Artist profile not found', 404);
      }

      return successResponse(res, artist);
    } catch (error) {
      console.error('Get artist profile error:', error);
      return errorResponse(res, 'Failed to get artist profile', 500);
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const artist = await ArtistModel.findByUserId(req.user.userId);
      if (!artist) {
        return errorResponse(res, 'Artist profile not found', 404);
      }

      const {
        bio,
        specialties,
        studio_name,
        studio_address,
        city,
        state,
        country,
        lat,
        lng,
        portfolio_images,
        years_experience,
        instagram_handle,
      } = req.body;

      const updatedArtist = await ArtistModel.update(artist.id, {
        bio,
        specialties,
        studio_name,
        studio_address,
        city,
        state,
        country,
        lat,
        lng,
        portfolio_images,
        years_experience,
        instagram_handle,
      });

      return successResponse(res, updatedArtist, 'Profile updated');
    } catch (error) {
      console.error('Update artist profile error:', error);
      return errorResponse(res, 'Failed to update profile', 500);
    }
  },
};
