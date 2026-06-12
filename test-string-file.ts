import { POST } from "./src/pages/api/register-member.ts";

async function run() {
  const formData = new FormData();
  formData.append("name", "Test Name");
  formData.append("email", "test@example.com");
  formData.append("voter_id", "ABC12345");
  formData.append("declaration_agreed", "true");
  // Appending file as a STRING instead of a Blob/File
  formData.append("file", "This is just a string, not a file");

  const request = new Request("http://localhost/api/register-member", {
    method: "POST",
    body: formData,
  });

  const response = await POST({ request } as any);
  console.log("Status:", response.status);
  const text = await response.text();
  console.log("Response:", text);
}

run().catch(console.error);
