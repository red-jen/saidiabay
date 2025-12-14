import { Request, Response } from 'express';
import { PropertyModel } from '../models/Property';

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { type, city, status } = req.query;
    const properties = await PropertyModel.findAll({
      type: type as string,
      city: city as string,
      status: status as string,
    });
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await PropertyModel.findById(parseInt(req.params.id));
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getFeaturedProperties = async (req: Request, res: Response) => {
  try {
    const properties = await PropertyModel.findFeatured();
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    const property = await PropertyModel.create(req.body);
    res.status(201).json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const property = await PropertyModel.update(parseInt(req.params.id), req.body);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const success = await PropertyModel.delete(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
