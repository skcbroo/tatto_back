import { Request, Response } from 'express';
import { ServiceModel } from '../models/Service.js';
import { ArtistModel } from '../models/Artist.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const serviceController = {
  async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const artist = await ArtistModel.findByUserId(req.user.userId);
      if (!artist) {
        return errorResponse(res, 'Artist profile not found', 404);
      }

      const {
        name,
        description,
        price_min,
        price_max,
        duration_minutes,
        category,
      } = req.body;

      if (!name) {
        return errorResponse(res, 'Service name is required');
      }

      const service = await ServiceModel.create(artist.id, {
        name,
        description,
        price_min,
        price_max,
        duration_minutes,
        category,
      });

      return successResponse(res, service, 'Service created', 201);
    } catch (error) {
      console.error('Create service error:', error);
      return errorResponse(res, 'Failed to create service', 500);
    }
  },

  async getByArtistId(req: Request, res: Response) {
    try {
      const { artistId } = req.params;

      const services = await ServiceModel.findByArtistId(artistId);

      return successResponse(res, services);
    } catch (error) {
      console.error('Get services error:', error);
      return errorResponse(res, 'Failed to get services', 500);
    }
  },

  async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;
      const service = await ServiceModel.findById(id);

      if (!service) {
        return errorResponse(res, 'Service not found', 404);
      }

      const artist = await ArtistModel.findByUserId(req.user.userId);
      if (!artist || artist.id !== service.artist_id) {
        return errorResponse(
          res,
          'You do not have permission to update this service',
          403
        );
      }

      const {
        name,
        description,
        price_min,
        price_max,
        duration_minutes,
        category,
        is_active,
      } = req.body;

      const updatedService = await ServiceModel.update(id, {
        name,
        description,
        price_min,
        price_max,
        duration_minutes,
        category,
        is_active,
      });

      return successResponse(res, updatedService, 'Service updated');
    } catch (error) {
      console.error('Update service error:', error);
      return errorResponse(res, 'Failed to update service', 500);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;
      const service = await ServiceModel.findById(id);

      if (!service) {
        return errorResponse(res, 'Service not found', 404);
      }

      const artist = await ArtistModel.findByUserId(req.user.userId);
      if (!artist || artist.id !== service.artist_id) {
        return errorResponse(
          res,
          'You do not have permission to delete this service',
          403
        );
      }

      await ServiceModel.delete(id);

      return successResponse(res, null, 'Service deleted');
    } catch (error) {
      console.error('Delete service error:', error);
      return errorResponse(res, 'Failed to delete service', 500);
    }
  },
};
