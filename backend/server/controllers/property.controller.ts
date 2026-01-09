import { Response, NextFunction } from 'express';
import { PropertyService } from '../services/property.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const propertyService = new PropertyService();

export class PropertyController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        propertyType: req.query.propertyType as 'RENT' | 'SALE' | undefined,
        city: req.query.city as string | undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        status: req.query.status as string | undefined,
      };

      const result = await propertyService.getAllProperties(filters);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const property = await propertyService.getPropertyById(id);
      res.json({ data: property });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const property = await propertyService.createProperty(req.body, req.userId!);
      res.status(201).json({
        message: 'Property created successfully',
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const property = await propertyService.updateProperty(id, req.body, req.userId!);
      res.json({
        message: 'Property updated successfully',
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await propertyService.deleteProperty(id, req.userId!);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async checkAvailability(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;

      const result = await propertyService.getAvailableDates(
        id,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }
}