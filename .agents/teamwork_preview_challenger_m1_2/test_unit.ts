import { POST } from '../../src/pages/api/register-member.ts';

async function run() {
    const formData = new FormData();
    const fileContent = new Blob(['fake image content'], { type: 'image/png' });
    formData.append('file', fileContent, 'test.png');
    formData.append('voter_id', 'ABC1234567');
    // We intentionally omit name, email, dob, etc.

    const req = new Request('http://localhost/api/register-member', {
        method: 'POST',
        body: formData
    });

    try {
        const res = await POST({ request: req } as any);
        console.log("Status:", res.status);
        console.log("Response:", await res.text());
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
