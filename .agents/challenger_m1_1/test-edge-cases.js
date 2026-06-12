import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import path from "path";

async function testEdgeCase({ name, payload, expectedStatus }) {
  console.log(`\nRunning test: ${name}`);
  const form = new FormData();
  
  for (const [key, value] of Object.entries(payload)) {
    if (key === "file" && value) {
      form.append("file", fs.createReadStream(value), { filename: 'dummy.jpg', contentType: 'image/jpeg' });
    } else if (value !== undefined) {
      form.append(key, value);
    }
  }

  try {
    const res = await fetch("http://localhost:4321/api/register-member", {
      method: "POST",
      body: form
    });
    
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch (e) { json = text; }

    if (res.status === expectedStatus) {
      console.log(`✅ PASS: ${name} (Status ${res.status})`);
      console.log(`Response:`, json);
    } else {
      console.log(`❌ FAIL: ${name}`);
      console.log(`Expected status ${expectedStatus}, got ${res.status}`);
      console.log(`Response:`, json);
    }
  } catch (err) {
    console.log(`❌ ERROR: ${name}`, err.message);
  }
}

async function runTests() {
  // Create a dummy file
  const dummyFile = path.join(process.cwd(), 'dummy.jpg');
  fs.writeFileSync(dummyFile, "dummy image content");

  await testEdgeCase({
    name: "Valid request",
    expectedStatus: 200,
    payload: {
      name: "John Doe",
      email: "john@example.com",
      parent: "Jane Doe",
      dob: "1990-01-01",
      address: "123 Main St",
      lok_sabha: "New Delhi",
      vidhan_sabha: "New Delhi",
      ward: "Ward 1",
      voter_id: "ABC1234567",
      declaration_agreed: "true",
      file: dummyFile
    }
  });

  await testEdgeCase({
    name: "Missing voter_id",
    expectedStatus: 400,
    payload: {
      name: "John Doe",
      email: "john@example.com",
      parent: "Jane Doe",
      dob: "1990-01-01",
      address: "123 Main St",
      lok_sabha: "New Delhi",
      vidhan_sabha: "New Delhi",
      ward: "Ward 1",
      declaration_agreed: "true",
      file: dummyFile
    }
  });

  await testEdgeCase({
    name: "Missing required string fields (should they be 400?)",
    expectedStatus: 400, // or 500 if DB fails, or 200 if logic allows it
    payload: {
      voter_id: "ABC1234567",
      file: dummyFile
    }
  });

  await testEdgeCase({
    name: "Malformed DOB (empty string)",
    expectedStatus: 400,
    payload: {
      name: "John Doe",
      email: "john@example.com",
      parent: "Jane Doe",
      dob: "", // empty string
      address: "123 Main St",
      lok_sabha: "New Delhi",
      vidhan_sabha: "New Delhi",
      ward: "Ward 1",
      voter_id: "ABC1234567",
      declaration_agreed: "true",
      file: dummyFile
    }
  });
  
  await testEdgeCase({
    name: "Invalid DOB format (not a date)",
    expectedStatus: 400,
    payload: {
      name: "John Doe",
      email: "john@example.com",
      parent: "Jane Doe",
      dob: "invalid-date",
      address: "123 Main St",
      lok_sabha: "New Delhi",
      vidhan_sabha: "New Delhi",
      ward: "Ward 1",
      voter_id: "ABC1234567",
      declaration_agreed: "true",
      file: dummyFile
    }
  });

  // Clean up
  fs.unlinkSync(dummyFile);
}

runTests();
