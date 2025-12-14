import { Request, Response } from 'express';
import { BookingModel } from '../models/Booking';

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await BookingModel.findAll();
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await BookingModel.findById(parseInt(req.params.id));
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPropertyBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await BookingModel.findByProperty(parseInt(req.params.propertyId));
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await BookingModel.create(req.body);
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const booking = await BookingModel.update(parseInt(req.params.id), req.body);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const success = await BookingModel.delete(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
