import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY!);

async function run() {
  const email = "volunteer@example.com";
  console.log("Checking:", email);
  const res = await supabase.from("profiles").select("id, email").eq("email", email).maybeSingle();
  console.log("Result:", res.data, res.error);
}
run();
