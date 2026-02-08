import { Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const leadService = new LeadService();

export class LeadController {
  /**
   * Get all leads (admin only)
   * GET /api/leads
   * Query params: ?status=NEW&propertyId=xxx&userId=xxx
   */
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        propertyId: req.query.propertyId as string | undefined,
        userId: req.query.userId as string | undefined,
      };

      const leads = await leadService.getAllLeads(filters);

      res.json({
        success: true,
        data: leads,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lead by ID
   * GET /api/leads/:id
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const lead = await leadService.getLeadById(id);

      res.json({
        success: true,
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get leads by property
   * GET /api/leads/property/:propertyId
   */
  async getByProperty(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;
      const leads = await leadService.getLeadsByProperty(propertyId);

      res.json({
        success: true,
        data: leads,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get logged-in user's leads
   * GET /api/leads/my
   */
  async getMyLeads(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      const leads = await leadService.getLeadsByUser(req.userId);

      res.json({
        success: true,
        data: leads,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new lead (public - guests and logged-in users)
   * POST /api/leads
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const lead = await leadService.createLead(
        req.body,
        req.userId // Will be undefined for guests
      );

      res.status(201).json({
        success: true,
        message: 'Interest submitted successfully',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update lead status (admin only)
   * PUT /api/leads/:id/status
   * Body: { status: 'NEW' | 'CONTACTED' | 'INTERESTED' | 'NOT_INTERESTED' }
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

      const lead = await leadService.updateLeadStatus(id, status);

      res.json({
        success: true,
        message: 'Lead status updated successfully',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update lead (admin only)
   * PUT /api/leads/:id
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const lead = await leadService.updateLead(id, req.body);

      res.json({
        success: true,
        message: 'Lead updated successfully',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete lead (admin only)
   * DELETE /api/leads/:id
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await leadService.deleteLead(id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}