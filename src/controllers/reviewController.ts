import { Request, Response } from 'express';
import { ReviewModel } from '../models/Review.js';
import { AppointmentModel } from '../models/Appointment.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const reviewController = {
  async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { appointment_id, artist_id, rating, comment, images } = req.body;

      if (!appointment_id || !artist_id || !rating) {
        return errorResponse(
          res,
          'Appointment, artist, and rating are required'
        );
      }

      if (rating < 1 || rating > 5) {
        return errorResponse(res, 'Rating must be between 1 and 5');
      }

      const appointment = await AppointmentModel.findById(appointment_id);
      if (!appointment) {
        return errorResponse(res, 'Appointment not found', 404);
      }

      if (appointment.customer_id !== req.user.userId) {
        return errorResponse(res, 'You can only review your own appointments', 403);
      }

      if (appointment.status !== 'completed') {
        return errorResponse(
          res,
          'You can only review completed appointments'
        );
      }

      const review = await ReviewModel.create({
        appointmentId: appointment_id,
        customerId: req.user.userId,
        artistId: artist_id,
        rating,
        comment,
        images,
      });

      return successResponse(res, review, 'Review created', 201);
    } catch (error) {
      console.error('Create review error:', error);
      if ((error as any).code === '23505') {
        return errorResponse(res, 'You have already reviewed this appointment');
      }
      return errorResponse(res, 'Failed to create review', 500);
    }
  },

  async getByArtistId(req: Request, res: Response) {
    try {
      const { artistId } = req.params;

      const reviews = await ReviewModel.findByArtistId(artistId);

      return successResponse(res, reviews);
    } catch (error) {
      console.error('Get reviews error:', error);
      return errorResponse(res, 'Failed to get reviews', 500);
    }
  },

  async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;
      const { rating, comment, images } = req.body;

      const review = await ReviewModel.findById(id);
      if (!review) {
        return errorResponse(res, 'Review not found', 404);
      }

      if (review.customer_id !== req.user.userId) {
        return errorResponse(res, 'Access denied', 403);
      }

      if (rating && (rating < 1 || rating > 5)) {
        return errorResponse(res, 'Rating must be between 1 and 5');
      }

      const updatedReview = await ReviewModel.update(id, {
        rating,
        comment,
        images,
      });

      return successResponse(res, updatedReview, 'Review updated');
    } catch (error) {
      console.error('Update review error:', error);
      return errorResponse(res, 'Failed to update review', 500);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;
      const review = await ReviewModel.findById(id);

      if (!review) {
        return errorResponse(res, 'Review not found', 404);
      }

      if (review.customer_id !== req.user.userId) {
        return errorResponse(res, 'Access denied', 403);
      }

      await ReviewModel.delete(id);

      return successResponse(res, null, 'Review deleted');
    } catch (error) {
      console.error('Delete review error:', error);
      return errorResponse(res, 'Failed to delete review', 500);
    }
  },
};
