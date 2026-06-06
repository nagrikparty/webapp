const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src', 'app', '[locale]');
const destPages = path.join(__dirname, 'src', 'pages', '[locale]');

const dirs = fs.readdirSync(srcApp).filter(f => fs.statSync(path.join(srcApp, f)).isDirectory());

dirs.forEach(dir => {
  const pageFile = path.join(srcApp, dir, 'page.tsx');
  if (fs.existsSync(pageFile)) {
    const destDir = path.join(destPages, dir);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    
    let astroContent = `---
import Layout from '@/layouts/Layout.astro';
---
<Layout title="Nagrik Party - ${dir}">
  <div class="pt-32 px-8 min-h-screen bg-off-white text-black">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold uppercase mb-8">${dir} PAGE</h1>
      <p>This page was migrated from Next.js to Astro. Replace this placeholder with the actual component content.</p>
    </div>
  </div>
</Layout>
`;
    fs.writeFileSync(path.join(destDir, 'index.astro'), astroContent);
    console.log(`Converted ${dir}`);
  }
});
