import { Response, NextFunction } from 'express';
import { HeroService } from '../services/hero.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const heroService = new HeroService();

export class HeroController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const activeOnly = req.query.active === 'true';
      const heroes = await heroService.getAllHeroes(activeOnly);
      res.json({ data: heroes });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const hero = await heroService.getHeroById(id);
      res.json({ data: hero });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const hero = await heroService.createHero(req.body);
      res.status(201).json({
        message: 'Hero section created successfully',
        data: hero,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const hero = await heroService.updateHero(id, req.body);
      res.json({
        message: 'Hero section updated successfully',
        data: hero,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await heroService.deleteHero(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async reorder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { heroIds } = req.body;
      const result = await heroService.reorderHeroes(heroIds);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}