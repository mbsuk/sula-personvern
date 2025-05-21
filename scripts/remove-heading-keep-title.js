// Script to remove the first Markdown heading but keep the title as a comment
// Usage: node scripts/remove-heading-keep-title.js

const fs = require('fs');
const path = require('path');

const folders = ['ansatte', 'innbygger'];

folders.forEach(folder => {
  const dir = path.join(__dirname, '..', folder);
  fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.md')) return;
    const filePath = path.join(dir, file);
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    let changed = false;
    // Find the first markdown heading
    const titleLineIdx = lines.findIndex(line => line.trim().startsWith('# '));
    if (titleLineIdx !== -1) {
      const title = lines[titleLineIdx].replace(/^# /, '').trim();
      // Remove the heading line
      lines.splice(titleLineIdx, 1);
      // Insert the title as a comment at the same place
      lines.splice(titleLineIdx, 0, `<!-- title: ${title} -->`);
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log('Updated:', filePath);
    }
  });
});
