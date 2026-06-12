import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY!);

async function run() {
  const email = `test_${Date.now()}@example.com`;
  console.log("Signing up:", email);
  const res = await supabase.auth.signUp({
    email,
    password: "Password123!"
  });
  console.log("SignUp Result:", res.data, res.error);
}
run();
