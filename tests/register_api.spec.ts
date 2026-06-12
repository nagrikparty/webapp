import { test, expect } from '@playwright/test';

test.describe('Registration API Edge Cases', () => {
  // Assuming the dev server is running locally on 4321
  const baseURL = 'http://localhost:4321';

  test('Missing file should return 400', async ({ request }) => {
    const formData = new FormData();
    formData.append('name', 'Test');
    formData.append('voter_id', '12345');
    // file is missing
    
    // Playwright's API request doesn't directly take FormData, we can use multipart
    const response = await request.post(`${baseURL}/api/register-member`, {
      multipart: {
        name: 'Test',
        voter_id: '12345'
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Identity document is required');
  });

  test('Missing voter_id should return 400', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/register-member`, {
      multipart: {
        name: 'Test',
        file: {
          name: 'test.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from('fake image')
        }
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Voter ID is required');
  });

  test('Invalid file (e.g., text) passed to vision API', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/register-member`, {
      multipart: {
        name: 'Test',
        voter_id: '12345',
        file: {
          name: 'test.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('this is not an image')
        }
      }
    });

    // We don't have GEMINI_API_KEY so it might return 500
    // But let's see what happens.
    console.log(await response.text());
  });
});
