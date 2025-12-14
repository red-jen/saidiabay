import { Request, Response } from 'express';
import { ContactModel } from '../models/Contact';

export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await ContactModel.findAll();
    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getContactById = async (req: Request, res: Response) => {
  try {
    const contact = await ContactModel.findById(parseInt(req.params.id));
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createContact = async (req: Request, res: Response) => {
  try {
    const contact = await ContactModel.create(req.body);
    res.status(201).json(contact);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const contact = await ContactModel.update(parseInt(req.params.id), req.body);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const success = await ContactModel.delete(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
