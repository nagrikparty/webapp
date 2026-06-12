import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

async function run() {
  const { data, error } = await supabase.from("profiles").select("*");
  console.log("Profiles:", data);
  console.log("Error:", error);
}

run();
