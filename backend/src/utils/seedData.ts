import { PropertyModel } from '../models/Property';
import { UserModel } from '../models/User';

export const seedSampleData = async () => {
  try {
    console.log('Seeding sample data...');

    // Check if data already exists
    const existingProperties = await PropertyModel.findAll();
    if (existingProperties.length > 0) {
      console.log('Sample data already exists. Skipping seed.');
      return;
    }

    // Sample properties
    const sampleProperties = [
      {
        title: 'Luxury Beachfront Villa',
        description: 'Stunning 3-bedroom villa with panoramic sea views, private pool, and direct beach access. Perfect for families or groups looking for a premium vacation experience.',
        type: 'villa',
        status: 'available',
        price: 2500,
        address: '123 Beach Road',
        city: 'Saidia',
        country: 'Morocco',
        bedrooms: 3,
        bathrooms: 2,
        area: 200,
        amenities: ['Private Pool', 'Beach Access', 'WiFi', 'Air Conditioning', 'Parking', 'BBQ'],
        is_featured: true,
      },
      {
        title: 'Modern City Apartment',
        description: 'Contemporary 2-bedroom apartment in the heart of the city. Walking distance to restaurants, shops, and entertainment. Fully furnished with modern amenities.',
        type: 'apartment',
        status: 'available',
        price: 1200,
        address: '456 Downtown Street',
        city: 'Oujda',
        country: 'Morocco',
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        amenities: ['WiFi', 'Air Conditioning', 'Elevator', 'Balcony'],
        is_featured: true,
      },
      {
        title: 'Cozy Studio Near Marina',
        description: 'Perfect for couples or solo travelers. This cozy studio offers comfort and convenience with beautiful marina views.',
        type: 'studio',
        status: 'available',
        price: 800,
        address: '789 Marina Boulevard',
        city: 'Saidia',
        country: 'Morocco',
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        amenities: ['WiFi', 'Marina View', 'Kitchen', 'Air Conditioning'],
        is_featured: true,
      },
      {
        title: 'Spacious Family House',
        description: 'Large 4-bedroom house with garden and garage. Ideal for families seeking long-term rental in a quiet neighborhood.',
        type: 'house',
        status: 'available',
        price: 1800,
        address: '321 Garden Lane',
        city: 'Nador',
        country: 'Morocco',
        bedrooms: 4,
        bathrooms: 3,
        area: 180,
        amenities: ['Garden', 'Garage', 'WiFi', 'Central Heating', 'Fireplace'],
        is_featured: false,
      },
      {
        title: 'Penthouse with Sea View',
        description: 'Exclusive penthouse apartment with 360-degree sea and mountain views. High-end finishes and luxury amenities throughout.',
        type: 'apartment',
        status: 'available',
        price: 3000,
        address: '555 Skyline Avenue',
        city: 'Saidia',
        country: 'Morocco',
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        amenities: ['Sea View', 'Mountain View', 'Terrace', 'Jacuzzi', 'Gym Access', 'Concierge'],
        is_featured: true,
      },
      {
        title: 'Traditional Riad Apartment',
        description: 'Charming apartment in a beautifully restored traditional riad. Experience authentic Moroccan architecture with modern comfort.',
        type: 'apartment',
        status: 'available',
        price: 1000,
        address: '888 Medina Street',
        city: 'Oujda',
        country: 'Morocco',
        bedrooms: 2,
        bathrooms: 1,
        area: 90,
        amenities: ['Traditional Decor', 'Courtyard', 'WiFi', 'Air Conditioning'],
        is_featured: false,
      },
    ];

    // Insert sample properties
    for (const property of sampleProperties) {
      await PropertyModel.create(property);
    }

    console.log(`Successfully seeded ${sampleProperties.length} properties!`);
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};
