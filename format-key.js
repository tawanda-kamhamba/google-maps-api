// Script to format service account key for environment variable
import { readFileSync } from 'fs';

try {
  const serviceAccount = JSON.parse(
    readFileSync('./backend/serviceAccountKey.json', 'utf8')
  );
  
  // Convert to a single line JSON string
  const formattedKey = JSON.stringify(serviceAccount);
  
  console.log('Formatted service account key for environment variable:');
  console.log('=====================================================');
  console.log(formattedKey);
  console.log('=====================================================');
  console.log('\nCopy this entire string and paste it as the value for GOOGLE_APPLICATION_CREDENTIALS_JSON in Render.com');
} catch (error) {
  console.error('Error reading service account key:', error);
} 