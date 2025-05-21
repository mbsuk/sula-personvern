// Script to remove repeating title from markdown files in 'ansatte' and 'innbygger' folders
// Usage: node scripts/remove-repeating-title.js

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
    // Find the first markdown title
    const titleLineIdx = lines.findIndex(line => line.trim().startsWith('# '));
    if (titleLineIdx !== -1) {
      const title = lines[titleLineIdx].replace(/^# /, '').trim();
      // Remove the next non-empty line if it matches the title (ignoring = and whitespace)
      for (let i = titleLineIdx + 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        // Remove markdown underline (=== or ---)
        if (/^=+$/.test(lines[i].trim()) || /^-+$/.test(lines[i].trim())) {
          lines.splice(i, 1);
          changed = true;
          i--;
          continue;
        }
        if (lines[i].trim() === title) {
          lines.splice(i, 1);
          changed = true;
        }
        break;
      }
    }
    if (changed) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log('Updated:', filePath);
    }
  });
});
