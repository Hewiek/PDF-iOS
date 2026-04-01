import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '..', 'src');
const entries = { js: {}, html: {} };

// 扫描 pages 和 elements 目录
const scanDirs = ['pages', 'elements'];

scanDirs.forEach(group => {
  const groupPath = path.join(root, group);
  if (!fs.existsSync(groupPath)) return;

  const items = fs.readdirSync(groupPath);
  items.forEach(name => {
    const folder = path.join(groupPath, name);
    if (!fs.statSync(folder).isDirectory()) return;

    const jsEntry = path.join(folder, 'index.tsx');
    if (fs.existsSync(jsEntry)) {
      const key = `${group}/${name}`;
      entries.js[key] = jsEntry;
      entries.html[key] = path.join(folder, 'index.html');
    }
  });
});

fs.writeFileSync(path.resolve(__dirname, '..', 'entries.json'), JSON.stringify(entries, null, 2), 'utf8');
console.log('Generated entries.json with', Object.keys(entries.js).length, 'js entries and', Object.keys(entries.html).length, 'html entries');
