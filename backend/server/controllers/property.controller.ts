import { Response, NextFunction } from 'express';
import { PropertyService } from '../services/property.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const propertyService = new PropertyService();

export class PropertyController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Parse and clean filter values (convert empty strings to undefined)
      const parseQuery = (value: any, parser?: (v: string) => any) => {
        if (!value || value === '') return undefined;
        return parser ? parser(value as string) : value;
      };

      const filters = {
        page: parseQuery(req.query.page, (v) => parseInt(v)),
        limit: parseQuery(req.query.limit, (v) => parseInt(v)),
        propertyType: parseQuery(req.query.propertyType) as 'RENT' | 'SALE' | undefined,
        listingType: parseQuery(req.query.listingType) as 'LOCATION' | 'VENTE' | undefined,
        propertyCategory: parseQuery(req.query.propertyCategory) as 'VILLA' | 'APPARTEMENT' | undefined,
        city: parseQuery(req.query.city),
        cityId: parseQuery(req.query.cityId),
        minPrice: parseQuery(req.query.minPrice, (v) => parseFloat(v)),
        maxPrice: parseQuery(req.query.maxPrice, (v) => parseFloat(v)),
        chambres: parseQuery(req.query.chambres, (v) => parseInt(v)),
        status: parseQuery(req.query.status),
        search: parseQuery(req.query.search),
        sortBy: parseQuery(req.query.sortBy),
        sortOrder: parseQuery(req.query.sortOrder) as 'ASC' | 'DESC' | undefined,
      };

      // Log filters for debugging (remove in production)
      console.log('🔍 Property filters received:', JSON.stringify(filters, null, 2));

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