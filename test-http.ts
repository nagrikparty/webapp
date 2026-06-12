async function test() {
  const url = "http://localhost:4321/api/register-member";

  console.log("--- Test 1: Sending file as a string field ---");
  const form1 = new FormData();
  form1.append("name", "Test");
  form1.append("voter_id", "VOTER123");
  form1.append("file", "I am just a string, not a file upload");
  
  try {
    const res1 = await fetch(url, { method: "POST", body: form1 });
    console.log("Status:", res1.status);
    console.log("Body:", await res1.text());
  } catch (e) {
    console.error(e);
  }

  console.log("\n--- Test 2: Missing voter_id ---");
  const form2 = new FormData();
  form2.append("name", "Test");
  form2.append("file", new Blob(["mock file"], { type: "image/png" }), "test.png");
  
  try {
    const res2 = await fetch(url, { method: "POST", body: form2 });
    console.log("Status:", res2.status);
    console.log("Body:", await res2.text());
  } catch (e) {
    console.error(e);
  }

  console.log("\n--- Test 3: Normal valid submission ---");
  const form3 = new FormData();
  form3.append("name", "Test Valid");
  form3.append("voter_id", "VALID456");
  form3.append("file", new Blob(["valid image data"], { type: "image/jpeg" }), "id.jpg");

  try {
    const res3 = await fetch(url, { method: "POST", body: form3 });
    console.log("Status:", res3.status);
    console.log("Body:", await res3.text());
  } catch (e) {
    console.error(e);
  }
}

test();
