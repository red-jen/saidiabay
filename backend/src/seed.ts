import dotenv from 'dotenv';
import { initializeDatabase } from './config/init-db';
import { seedSampleData } from './utils/seedData';

dotenv.config();

const runSeed = async () => {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    
    console.log('Seeding sample data...');
    await seedSampleData();
    
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

runSeed();
