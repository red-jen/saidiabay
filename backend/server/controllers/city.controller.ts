import { Response, NextFunction } from 'express';
import { CityService } from '../services/city.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const cityService = new CityService();

export class CityController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cities = await cityService.getAllCities();
      res.json({ data: cities });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const city = await cityService.getCityById(id);
      res.json({ data: city });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const city = await cityService.createCity(req.body, req.userId!);
      res.status(201).json({
        message: 'Ville créée avec succès',
        data: city,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const city = await cityService.updateCity(id, req.body);
      res.json({
        message: 'Ville mise à jour avec succès',
        data: city,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await cityService.deleteCity(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}