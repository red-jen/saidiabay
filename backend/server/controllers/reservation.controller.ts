import { Response, NextFunction } from 'express';
import { ReservationService } from '../services/reservation.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const reservationService = new ReservationService();

export class ReservationController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        propertyId: req.query.propertyId as string | undefined,
      };

      const reservations = await reservationService.getAllReservations(filters);
      res.json({ data: reservations });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reservation = await reservationService.getReservationById(id);
      res.json({ data: reservation });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationService.createReservation(
        req.body,
        req.userId
      );

      res.status(201).json({
        message: 'Reservation created successfully',
        data: reservation,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reservation = await reservationService.updateReservation(id, req.body);

      res.json({
        message: 'Reservation updated successfully',
        data: reservation,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reservation = await reservationService.cancelReservation(id);

      res.json({
        message: 'Reservation cancelled successfully',
        data: reservation,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyReservations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reservations = await reservationService.getMyReservations(req.userId!);
      res.json({ data: reservations });
    } catch (error) {
      next(error);
    }
  }
}