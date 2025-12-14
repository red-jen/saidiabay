import pool from '../config/database';

export interface Contact {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  property_id?: number;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class ContactModel {
  static async create(contact: Contact): Promise<Contact> {
    const result = await pool.query(
      `INSERT INTO contacts (name, email, phone, subject, message, property_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        contact.name,
        contact.email,
        contact.phone,
        contact.subject,
        contact.message,
        contact.property_id,
        contact.status || 'new',
      ]
    );
    return result.rows[0];
  }

  static async findAll(): Promise<Contact[]> {
    const result = await pool.query(
      `SELECT c.*, p.title as property_title 
       FROM contacts c 
       LEFT JOIN properties p ON c.property_id = p.id 
       ORDER BY c.created_at DESC`
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Contact | null> {
    const result = await pool.query(
      `SELECT c.*, p.title as property_title 
       FROM contacts c 
       LEFT JOIN properties p ON c.property_id = p.id 
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async update(id: number, contact: Partial<Contact>): Promise<Contact | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(contact).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE contacts SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
