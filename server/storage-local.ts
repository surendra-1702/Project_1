// Local storage configuration for development
import { MemStorage, DatabaseStorage } from './storage';

// Use MemStorage for local development when DATABASE_URL is not available
function createStorage() {
  try {
    // Try to use database storage if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      console.log('Using DatabaseStorage with connection:', process.env.DATABASE_URL.substring(0, 20) + '...');
      return new DatabaseStorage();
    } else {
      console.log('DATABASE_URL not found, using MemStorage for local development');
      return new MemStorage();
    }
  } catch (error) {
    console.error('Failed to connect to database, falling back to MemStorage:', error.message);
    return new MemStorage();
  }
}

export const storage = createStorage();