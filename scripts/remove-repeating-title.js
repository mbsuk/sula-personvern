// Script to remove repeating title and underline from markdown files in 'ansatte' and 'innbygger' folders
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
      // Remove all lines after the title line that only contain '=' (any length, possibly with whitespace)
      let i = titleLineIdx + 1;
      while (i < lines.length) {
        if (lines[i].trim() === '' || /^=+$/.test(lines[i].trim())) {
          if (/^=+$/.test(lines[i].trim())) {
            lines.splice(i, 1);
            changed = true;
            continue;
          }
          i++;
        } else {
          break;
        }
      }
      // Remove the next non-empty line if it matches the title (ignoring whitespace)
      const title = lines[titleLineIdx].replace(/^# /, '').trim();
      for (let j = i; j < lines.length; j++) {
        if (lines[j].trim() === '') continue;
        if (lines[j].trim() === title) {
          lines.splice(j, 1);
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
