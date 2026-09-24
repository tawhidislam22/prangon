import fs from 'fs';
import path from 'path';

const srcDir = 'e:/Prangon/Prangon-frontend/src';

function getFiles(dir: string, fileList: string[] = []): string[] {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isDirectory()) {
            getFiles(path.join(dir, file), fileList);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            fileList.push(path.join(dir, file));
        }
    }
    return fileList;
}

const allFiles = getFiles(srcDir);

for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    const oldContent = content;

    // 1. replace `/w/${...}/dashboard` -> `/owner/dashboard`
    content = content.replace(/\/w\/\$\{[^}]+\}\/dashboard/g, '/owner/dashboard');
    
    // 2. replace `/w/` strings in general if they are exact
    content = content.replace(/\/w\/\$\{[^}]+\}/g, '/owner');

    // 3. For any leftover static string like `/w/hello/dashboard` (unlikely in code, but maybe in strings)
    // We already replaced the dynamic ones.
    
    if (oldContent !== content) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated paths in ${file}`);
    }
}
