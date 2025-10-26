import { Request, Response } from 'express';
import { AppointmentModel } from '../models/Appointment.js';
import { ArtistModel } from '../models/Artist.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const appointmentController = {
  async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const {
        artist_id,
        service_id,
        scheduled_date,
        scheduled_time,
        notes,
        price,
      } = req.body;

      if (!artist_id || !scheduled_date || !scheduled_time) {
        return errorResponse(
          res,
          'Artist, date, and time are required'
        );
      }

      const appointment = await AppointmentModel.create({
        customerId: req.user.userId,
        artistId: artist_id,
        serviceId: service_id,
        scheduledDate: scheduled_date,
        scheduledTime: scheduled_time,
        notes,
        price,
      });

      return successResponse(res, appointment, 'Appointment created', 201);
    } catch (error) {
      console.error('Create appointment error:', error);
      return errorResponse(res, 'Failed to create appointment', 500);
    }
  },

  async getMyAppointments(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      let appointments;

      if (req.user.role === 'customer') {
        appointments = await AppointmentModel.findByCustomerId(
          req.user.userId
        );
      } else {
        const artist = await ArtistModel.findByUserId(req.user.userId);
        if (!artist) {
          return errorResponse(res, 'Artist profile not found', 404);
        }
        appointments = await AppointmentModel.findByArtistId(artist.id);
      }

      return successResponse(res, appointments);
    } catch (error) {
      console.error('Get appointments error:', error);
      return errorResponse(res, 'Failed to get appointments', 500);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;
      const appointment = await AppointmentModel.findById(id);

      if (!appointment) {
        return errorResponse(res, 'Appointment not found', 404);
      }

      const artist = await ArtistModel.findByUserId(req.user.userId);
      const isOwner =
        appointment.customer_id === req.user.userId ||
        (artist && appointment.artist_id === artist.id);

      if (!isOwner) {
        return errorResponse(res, 'Access denied', 403);
      }

      return successResponse(res, appointment);
    } catch (error) {
      console.error('Get appointment error:', error);
      return errorResponse(res, 'Failed to get appointment', 500);
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return errorResponse(res, 'Status is required');
      }

      const validStatuses = [
        'pending',
        'confirmed',
        'in_progress',
        'completed',
        'cancelled',
      ];
      if (!validStatuses.includes(status)) {
        return errorResponse(res, 'Invalid status');
      }

      const appointment = await AppointmentModel.findById(id);
      if (!appointment) {
        return errorResponse(res, 'Appointment not found', 404);
      }

      const artist = await ArtistModel.findByUserId(req.user.userId);
      const isOwner =
        appointment.customer_id === req.user.userId ||
        (artist && appointment.artist_id === artist.id);

      if (!isOwner) {
        return errorResponse(res, 'Access denied', 403);
      }

      const updatedAppointment = await AppointmentModel.update(id, {
        status,
      });

      return successResponse(
        res,
        updatedAppointment,
        'Appointment status updated'
      );
    } catch (error) {
      console.error('Update appointment error:', error);
      return errorResponse(res, 'Failed to update appointment', 500);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;
      const appointment = await AppointmentModel.findById(id);

      if (!appointment) {
        return errorResponse(res, 'Appointment not found', 404);
      }

      if (appointment.customer_id !== req.user.userId) {
        return errorResponse(res, 'Access denied', 403);
      }

      await AppointmentModel.delete(id);

      return successResponse(res, null, 'Appointment deleted');
    } catch (error) {
      console.error('Delete appointment error:', error);
      return errorResponse(res, 'Failed to delete appointment', 500);
    }
  },
};
