const fs = require('fs');

let content = fs.readFileSync('admin.html', 'utf8');

content = content.replace(/<td>[^<]*\$\{p\.neighborhood\}<\/td>/g, '<td>📍 ${p.neighborhood}</td>');

fs.writeFileSync('admin.html', content, 'utf8');
console.log('Fixed admin.html pins safely!');
