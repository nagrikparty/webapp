import { POST } from './src/pages/api/register-member.ts';

async function testApi() {
  console.log("Testing Missing File");
  const fd1 = new FormData();
  fd1.append("name", "Test");
  fd1.append("voter_id", "12345");
  
  const req1 = new Request("http://localhost/api/register-member", {
    method: "POST",
    body: fd1
  });

  const res1 = await POST({ request: req1 } as any);
  console.log("Missing file status:", res1.status);
  console.log("Missing file body:", await res1.text());

  console.log("Testing String File");
  const fd2 = new FormData();
  fd2.append("name", "Test");
  fd2.append("voter_id", "12345");
  fd2.append("file", "This is just a string, not a file");

  const req2 = new Request("http://localhost/api/register-member", {
    method: "POST",
    body: fd2
  });
  
  try {
    const res2 = await POST({ request: req2 } as any);
    console.log("String file status:", res2.status);
    console.log("String file body:", await res2.text());
  } catch(e) {
    console.log("String file error:", e);
  }

}

testApi().catch(console.error);
