// Script to remove the first Markdown heading and replace the top comment with YAML frontmatter with the title
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
    // Find the first comment at the top (<!-- ... -->)
    let commentLineIdx = -1;
    if (lines[0].trim().startsWith('<!--') && lines[0].trim().endsWith('-->')) {
      commentLineIdx = 0;
    }
    // Find the first markdown heading
    const titleLineIdx = lines.findIndex(line => line.trim().startsWith('# '));
    let title = '';
    if (titleLineIdx !== -1) {
      title = lines[titleLineIdx].replace(/^# /, '').trim();
      // Remove the heading line
      lines.splice(titleLineIdx, 1);
      changed = true;
    }
    // If there is a comment at the top, extract the title from it if possible
    if (commentLineIdx === 0) {
      const comment = lines[0];
      const match = comment.match(/title\s*[:=]\s*(.+?)(\s*-->)?$/i);
      if (match) {
        title = match[1].replace(/-->.*/, '').trim();
      }
      // Remove the comment line
      lines.splice(0, 1);
      changed = true;
    }
    // Insert YAML frontmatter with the title at the top (if not already present)
    if (title && !(lines[0].trim() === '---' && lines[1] && lines[1].trim().startsWith('title:'))) {
      lines.unshift('---');
      lines.unshift(`title: ${title}`);
      lines.unshift('---');
      // Remove the extra '---' at the start (should be only one block)
      lines[0] = '---';
      lines[2] = '---';
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log('Updated:', filePath);
    }
  });
});
