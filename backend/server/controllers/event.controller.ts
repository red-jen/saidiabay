import { Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const eventService = new EventService();

export class EventController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const events = await eventService.getAllEvents();
      res.json({ data: events });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);
      res.json({ data: event });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.createEvent(req.body, req.userId!);
      res.status(201).json({
        message: 'Event created successfully',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const event = await eventService.updateEvent(id, req.body, req.userId!);
      res.json({
        message: 'Event updated successfully',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await eventService.deleteEvent(id, req.userId!);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}