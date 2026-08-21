import fs from 'node:fs';

const required = ['index.html', 'style.css', 'src/game/00-core.js', 'src/game/12-bootstrap.js'];
let failed = false;
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    failed = true;
  }
}

const html = fs.existsSync('index.html') ? fs.readFileSync('index.html', 'utf8') : '';
if (html && !html.includes('style.css')) { console.error('index.html does not reference style.css'); failed = true; }
for (const file of fs.readdirSync('src/game').filter(f=>f.endsWith('.js')).sort()) {
  const ref=`src/game/${file}`;
  if (html && !html.includes(ref)) { console.error(`index.html does not reference ${ref}`); failed = true; }
}
if (failed) process.exit(1);
console.log('Project structure validation passed.');
