const fs = require('fs');
const path = require('path');

const localDir = __dirname;
function getFiles(dir, ext) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.vercel')) {
                results = results.concat(getFiles(file, ext));
            }
        } else {
            if (file.endsWith(ext)) {
                results.push(file);
            }
        }
    });
    return results;
}

const htmlFiles = getFiles(localDir, '.html');
for (let file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');

    // Fix corrupted characters correctly
    content = content.replace(/mÃƒâ€šÂ²/g, 'm²');
    content = content.replace(/NicaragÃƒÆ’Â¼ense/g, 'Nicaragüense');
    content = content.replace(/CONFIGURACIÃƒâ€œN/g, 'CONFIGURACIÓN');
    content = content.replace(/Ã‚¿/g, '¿');
    content = content.replace(/Ã‚Â¡/g, '¡');
    content = content.replace(/Ã¢Â\xADÂ /g, '⭐'); // xAD is soft hyphen often hidden
    content = content.replace(/Ã¢Â­Â /g, '⭐');
    content = content.replace(/Ã°Å¸â€œÂ /g, '📍');

    fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed encodings!');
