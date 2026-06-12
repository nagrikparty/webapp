import fs from 'fs';
import path from 'path';

async function runTest() {
  const url = 'http://localhost:4321/api/register-member';
  
  // Create a mock image file
  const buffer = Buffer.from('mock image content');
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  
  const formData = new FormData();
  formData.append('name', 'John Doe');
  formData.append('email', 'john@example.com');
  formData.append('parent', 'Jane Doe');
  formData.append('dob', '1990-01-01');
  formData.append('address', '123 Test St');
  formData.append('lok_sabha', 'Chandni Chowk');
  formData.append('vidhan_sabha', 'Adarsh Nagar');
  formData.append('ward', 'Adarsh Nagar');
  formData.append('voter_id', 'ABC1234567');
  formData.append('declaration_agreed', 'true');
  formData.append('file', blob, 'test.jpg');

  try {
    console.log('Sending request to', url);
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', text);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

runTest();
