import { Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const leadService = new LeadService();

export class LeadController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        propertyId: req.query.propertyId as string | undefined,
      };

      const leads = await leadService.getAllLeads(filters);
      res.json({ data: leads });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const lead = await leadService.getLeadById(id);
      res.json({ data: lead });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const lead = await leadService.createLead(req.body, req.userId);

      res.status(201).json({
        message: 'Interest submitted successfully',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const lead = await leadService.updateLead(id, req.body);

      res.json({
        message: 'Lead updated successfully',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await leadService.deleteLead(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}