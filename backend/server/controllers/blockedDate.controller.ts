import { Response, NextFunction } from 'express';
import { BlockedDateService } from '../services/blockedDate.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const blockedDateService = new BlockedDateService();

export class BlockedDateController {
  /**
   * Get all blocked dates (admin only)
   * GET /api/blocked-dates
   */
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const blockedDates = await blockedDateService.getAllBlockedDates();

      res.json({
        success: true,
        data: blockedDates,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get blocked date by ID
   * GET /api/blocked-dates/:id
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const blockedDate = await blockedDateService.getBlockedDateById(id);

      res.json({
        success: true,
        data: blockedDate,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get blocked dates by property (public)
   * GET /api/blocked-dates/property/:propertyId
   */
  async getByProperty(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;
      const blockedDates = await blockedDateService.getBlockedDatesByProperty(propertyId);

      res.json({
        success: true,
        data: blockedDates,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get blocked dates in range for a property (public)
   * POST /api/blocked-dates/check-range
   * Body: { propertyId, startDate, endDate }
   */
  async getInRange(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { propertyId, startDate, endDate } = req.body;

      if (!propertyId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'propertyId, startDate, and endDate are required',
        });
      }

      const blockedDates = await blockedDateService.getBlockedDatesInRange(
        propertyId,
        startDate,
        endDate
      );

      res.json({
        success: true,
        data: blockedDates,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check if dates are blocked (public)
   * POST /api/blocked-dates/check-blocked
   * Body: { propertyId, startDate, endDate }
   */
  async checkBlocked(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { propertyId, startDate, endDate } = req.body;

      if (!propertyId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'propertyId, startDate, and endDate are required',
        });
      }

      const result = await blockedDateService.checkIfDateBlocked(
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
   * Create blocked date (admin only)
   * POST /api/blocked-dates
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const blockedDate = await blockedDateService.createBlockedDate(req.body);

      res.status(201).json({
        success: true,
        message: 'Blocked date created successfully',
        data: blockedDate,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update blocked date (admin only)
   * PUT /api/blocked-dates/:id
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const blockedDate = await blockedDateService.updateBlockedDate(id, req.body);

      res.json({
        success: true,
        message: 'Blocked date updated successfully',
        data: blockedDate,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete blocked date (admin only)
   * DELETE /api/blocked-dates/:id
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await blockedDateService.deleteBlockedDate(id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
