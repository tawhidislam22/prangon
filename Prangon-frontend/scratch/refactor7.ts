import fs from 'fs';
import path from 'path';

const srcDir = 'e:/Prangon/Prangon-frontend/src';
const ownerDir = path.join(srcDir, 'app', 'owner');

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

const allFiles = getFiles(ownerDir);

for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    // Only inject workspaceSlug?: string; if it has interface ***Props {
    const oldContent = content;
    content = content.replace(/(interface\s+\w*Props\s*\{\s*)/g, '$1workspaceSlug?: string;\n  ');

    if (oldContent !== content) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated interfaces in ${file}`);
    }
}
