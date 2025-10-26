import { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { ArtistModel } from '../models/Artist.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { isValidEmail, isValidPassword } from '../utils/validation.js';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        return errorResponse(res, 'Email, password, and role are required');
      }

      if (!isValidEmail(email)) {
        return errorResponse(res, 'Invalid email format');
      }

      if (!isValidPassword(password)) {
        return errorResponse(
          res,
          'Password must be at least 6 characters long'
        );
      }

      if (!['customer', 'artist'].includes(role)) {
        return errorResponse(res, 'Role must be customer or artist');
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return errorResponse(res, 'Email already registered');
      }

      const passwordHash = await hashPassword(password);
      const user = await UserModel.create(email, passwordHash, role);

      if (role === 'artist') {
        await ArtistModel.create(user.id);
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const { password_hash, ...userWithoutPassword } = user;

      return successResponse(
        res,
        {
          token,
          user: userWithoutPassword,
        },
        'Registration successful',
        201
      );
    } catch (error) {
      console.error('Register error:', error);
      return errorResponse(res, 'Registration failed', 500);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return errorResponse(res, 'Email and password are required');
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return errorResponse(res, 'Invalid credentials', 401);
      }

      const isPasswordValid = await comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        return errorResponse(res, 'Invalid credentials', 401);
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const { password_hash, ...userWithoutPassword } = user;

      return successResponse(res, {
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error('Login error:', error);
      return errorResponse(res, 'Login failed', 500);
    }
  },

  async getMe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      const { password_hash, ...userWithoutPassword } = user;

      return successResponse(res, userWithoutPassword);
    } catch (error) {
      console.error('Get me error:', error);
      return errorResponse(res, 'Failed to get user', 500);
    }
  },
};
