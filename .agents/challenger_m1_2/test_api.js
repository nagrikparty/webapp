import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";

async function runTest() {
  const form = new FormData();
  form.append("voter_id", "ABC1234567");
  // Omitting all required fields like name, dob, etc.
  // And sending declaration_agreed = false
  form.append("declaration_agreed", "false");
  
  // Create a dummy image file
  fs.writeFileSync("dummy.jpg", "fake image data");
  form.append("file", fs.createReadStream("dummy.jpg"), {
    contentType: "image/jpeg",
    filename: "dummy.jpg",
  });

  try {
    const res = await fetch("http://localhost:4321/api/register-member", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

runTest();
