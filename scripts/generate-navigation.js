// Script to generate navigation.yml from ansatte and innbygger folders
// Usage: node scripts/generate-navigation.js

const fs = require('fs');
const path = require('path');

const NAV_PATH = path.join(__dirname, '../_data/navigation.yml');
const ANSATTE_DIR = path.join(__dirname, '../ansatte');
const INNBYGGER_DIR = path.join(__dirname, '../innbygger');

function getTitleFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : path.basename(filePath, '.md');
}

function getNavChildren(dir, urlPrefix) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const filePath = path.join(dir, f);
      const title = getTitleFromFile(filePath);
      return {
        title,
        url: `/sula-personvern/${urlPrefix}/${path.basename(f, '.md')}`
      };
    });
}

function toYamlSection(title, children) {
  let yaml = `- title: ${title}\n  children:`;
  children.forEach(child => {
    yaml += `\n    - title: ${child.title}\n      url: ${child.url}`;
  });
  return yaml;
}

const ansatteChildren = getNavChildren(ANSATTE_DIR, 'ansatte');
const innbyggerChildren = getNavChildren(INNBYGGER_DIR, 'innbygger');

const yaml = [
  toYamlSection('Ansatte', ansatteChildren),
  toYamlSection('Innbygger', innbyggerChildren)
].join('\n\n');

fs.writeFileSync(NAV_PATH, yaml + '\n', 'utf8');
console.log('navigation.yml generated successfully.');
