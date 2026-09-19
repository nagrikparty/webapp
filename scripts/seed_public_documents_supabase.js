import fs from "fs";
import path from "path";

const docs = JSON.parse(
  fs.readFileSync(
    "C:/Users/hudav/.gemini/antigravity/brain/3bdbea10-6f9c-47cb-b2c8-4300f99690a0/scratch/processed_docs.json",
    "utf8"
  )
);

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

const values = docs.map((d, index) => {
  const id = `00000000-0000-0000-0000-0000000000${(index + 1).toString().padStart(2, '0')}`;
  return `('${id}', '${escapeSql(d.category)}', '${escapeSql(d.slug)}', '${escapeSql(d.title)}', '${escapeSql(d.description)}', '${escapeSql(d.file_storage_path)}', '${d.version}', true, '${d.published_at}', '${d.file_sha256}', true)`;
}).join(",\n");

const sql = `
INSERT INTO public.public_documents (id, category, slug, title, description, file_path, version, is_published, published_at, file_sha256, is_active)
VALUES
${values}
ON CONFLICT (slug) DO UPDATE SET
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  file_path = EXCLUDED.file_path,
  version = EXCLUDED.version,
  is_published = EXCLUDED.is_published,
  published_at = EXCLUDED.published_at,
  file_sha256 = EXCLUDED.file_sha256,
  is_active = EXCLUDED.is_active;
`;

fs.writeFileSync(
  "C:/Users/hudav/.gemini/antigravity/brain/3bdbea10-6f9c-47cb-b2c8-4300f99690a0/scratch/seed_public_docs.sql",
  sql,
  "utf8"
);

console.log("Written seed_public_docs.sql successfully!");
