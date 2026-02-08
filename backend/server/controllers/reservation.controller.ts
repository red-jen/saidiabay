import { Response, NextFunction } from 'express';
import { ReservationService } from '../services/reservation.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const reservationService = new ReservationService();

export class ReservationController {
  /**
   * Get all reservations (admin only)
   * GET /api/reservations
   * Query params: ?status=PENDING&propertyId=xxx&userId=xxx
   */
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        propertyId: req.query.propertyId as string | undefined,
        userId: req.query.userId as string | undefined,
      };

      const reservations = await reservationService.getAllReservations(filters);

      res.json({
        success: true,
        data: reservations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get reservation by ID
   * GET /api/reservations/:id
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reservation = await reservationService.getReservationById(id);

      res.json({
        success: true,
        data: reservation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get reservations by property
   * GET /api/reservations/property/:propertyId
   */
  async getByProperty(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;
      const reservations = await reservationService.getReservationsByProperty(propertyId);

      res.json({
        success: true,
        data: reservations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get logged-in user's reservations
   * GET /api/reservations/my
   */
  async getMyReservations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      const reservations = await reservationService.getMyReservations(req.userId);

      res.json({
        success: true,
        data: reservations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new reservation (public - guests and logged-in users)
   * POST /api/reservations
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationService.createReservation(
        req.body,
        req.userId // Will be undefined for guests
      );

      res.status(201).json({
        success: true,
        message: 'Reservation created successfully',
        data: reservation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check date availability for a property
   * POST /api/reservations/check-availability
   * Body: { propertyId, startDate, endDate }
   */
  async checkAvailability(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { propertyId, startDate, endDate } = req.body;

      if (!propertyId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'propertyId, startDate, and endDate are required',
        });
      }

      const result = await reservationService.checkDateAvailability(
        propertyId,
        startDate,
        endDate
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update reservation status (admin only)
   * PUT /api/reservations/:id/status
   * Body: { status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' }
   */
  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Status is required',
        });
      }

      const reservation = await reservationService.updateReservationStatus(id, status);

      res.json({
        success: true,
        message: 'Reservation status updated successfully',
        data: reservation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update reservation (admin only)
   * PUT /api/reservations/:id
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reservation = await reservationService.updateReservation(id, req.body);

      res.json({
        success: true,
        message: 'Reservation updated successfully',
        data: reservation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel reservation
   * POST /api/reservations/:id/cancel
   */
  async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reservation = await reservationService.cancelReservation(id);

      res.json({
        success: true,
        message: 'Reservation cancelled successfully',
        data: reservation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete reservation (admin only)
   * DELETE /api/reservations/:id
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await reservationService.deleteReservation(id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}