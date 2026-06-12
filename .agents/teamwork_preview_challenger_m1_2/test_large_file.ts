import fs from 'fs';

async function testLargeFile() {
    const formData = new FormData();
    
    // Create a 50MB file
    const largeContent = new Uint8Array(50 * 1024 * 1024);
    const fileContent = new Blob([largeContent], { type: 'application/octet-stream' });
    
    formData.append('file', fileContent, 'large.bin');
    formData.append('voter_id', 'ABC1234567');
    formData.append('name', 'Test');
    formData.append('email', 'test@example.com');
    formData.append('parent', 'Test Parent');
    formData.append('dob', '1990-01-01');
    formData.append('address', 'Test Address');
    formData.append('lok_sabha', 'Chandni Chowk');
    formData.append('vidhan_sabha', 'Adarsh Nagar');
    formData.append('ward', 'Adarsh Nagar');
    formData.append('declaration_agreed', 'true');

    console.log("Submitting large file to API...");
    try {
        const response = await fetch('http://localhost:4321/api/register-member', {
            method: 'POST',
            body: formData as any,
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", text);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testLargeFile();
