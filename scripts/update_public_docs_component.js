import fs from "fs";
import path from "path";

const docs = JSON.parse(
  fs.readFileSync(
    "C:/Users/hudav/.gemini/antigravity/brain/3bdbea10-6f9c-47cb-b2c8-4300f99690a0/scratch/processed_docs.json",
    "utf8"
  )
);

const officialDocsArray = docs.map((d, index) => {
  return `  {
    id: "doc-${index + 1}",
    title: "${d.title.replace(/"/g, '\\"')}",
    slug: "${d.slug}",
    category: "${d.category}",
    description: "${d.description.replace(/"/g, '\\"')}",
    file_storage_path: "public-documents/${d.slug}-v1.pdf",
    file_sha256: "${d.file_sha256}",
    published_at: "${d.published_at}",
    version: "${d.version}",
  }`;
}).join(",\n");

const compPath = path.resolve("src/components/PublicDocumentsLibrary.tsx");
let content = fs.readFileSync(compPath, "utf8");

// Replace the OFFICIAL_DOCS array
const startIdx = content.indexOf("const OFFICIAL_DOCS: PublicDoc[] = [");
const endIdx = content.indexOf("];", startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const newOfficialDocs = `const OFFICIAL_DOCS: PublicDoc[] = [\n${officialDocsArray}\n];`;
  content = content.slice(0, startIdx) + newOfficialDocs + content.slice(endIdx + 2);
  fs.writeFileSync(compPath, content, "utf8");
  console.log("Successfully updated OFFICIAL_DOCS in PublicDocumentsLibrary.tsx!");
} else {
  console.error("Could not locate OFFICIAL_DOCS in PublicDocumentsLibrary.tsx");
}
