import fs from 'fs';

async function testPartialData() {
    const formData = new FormData();
    
    // Only file and voterId
    const fileContent = new Blob(['fake file content'], { type: 'text/plain' });
    formData.append('file', fileContent, 'test.txt');
    formData.append('voter_id', 'ABC1234567');
    // Omitting name, email, etc.

    console.log("Submitting partial data to API...");
    try {
        const response = await fetch('http://localhost:4321/api/register-member', {
            method: 'POST',
            body: formData,
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", text);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testPartialData();
