import pool from '../config/database';

export interface Property {
  id?: number;
  title: string;
  description?: string;
  type: string;
  status?: string;
  price: number;
  address: string;
  city: string;
  country: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  amenities?: string[];
  is_featured?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class PropertyModel {
  static async create(property: Property): Promise<Property> {
    const result = await pool.query(
      `INSERT INTO properties (title, description, type, status, price, address, city, country, bedrooms, bathrooms, area, images, amenities, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        property.title,
        property.description,
        property.type,
        property.status || 'available',
        property.price,
        property.address,
        property.city,
        property.country,
        property.bedrooms,
        property.bathrooms,
        property.area,
        property.images || [],
        property.amenities || [],
        property.is_featured || false,
      ]
    );
    return result.rows[0];
  }

  static async findAll(filters?: { type?: string; city?: string; status?: string }): Promise<Property[]> {
    let query = 'SELECT * FROM properties WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.type) {
      query += ` AND type = $${paramCount}`;
      params.push(filters.type);
      paramCount++;
    }

    if (filters?.city) {
      query += ` AND city = $${paramCount}`;
      params.push(filters.city);
      paramCount++;
    }

    if (filters?.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id: number): Promise<Property | null> {
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async update(id: number, property: Partial<Property>): Promise<Property | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(property).forEach(([key, value]) => {
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
      `UPDATE properties SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM properties WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async findFeatured(): Promise<Property[]> {
    const result = await pool.query('SELECT * FROM properties WHERE is_featured = true ORDER BY created_at DESC LIMIT 6');
    return result.rows;
  }
}
