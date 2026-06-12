import { POST } from "./test-bundle.mjs";

async function run() {
  console.log("Testing POST handler directly");

  // Test 1: file is a string (simulating invalid file upload type)
  const fd1 = new FormData();
  fd1.append("name", "Test");
  fd1.append("voter_id", "VALID123");
  fd1.append("file", "I am a string, not a file");

  const req1 = new Request("http://localhost/api/register-member", {
    method: "POST",
    body: fd1
  });

  try {
    const res1 = await POST({ request: req1 });
    console.log("Test 1 Status:", res1.status);
    console.log("Test 1 Body:", await res1.text());
  } catch (e) {
    console.error("Test 1 Exception:", e);
  }

  // Test 2: voter_id missing
  const fd2 = new FormData();
  fd2.append("name", "Test");
  fd2.append("file", new Blob(["abc"], { type: "image/png" }), "test.png");

  const req2 = new Request("http://localhost/api/register-member", {
    method: "POST",
    body: fd2
  });

  try {
    const res2 = await POST({ request: req2 });
    console.log("Test 2 Status:", res2.status);
    console.log("Test 2 Body:", await res2.text());
  } catch (e) {
    console.error("Test 2 Exception:", e);
  }

}

run();
