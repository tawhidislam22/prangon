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

    // Remove `workspaceSlug` from function calls if they end with Action
    // Like: Action(workspaceSlug) -> Action()
    // Or: Action(workspaceSlug, something) -> Action(something)
    // We can use a regex that matches `Action(workspaceSlug)` or `Action(workspaceSlug, `
    const oldContent = content;
    
    // 1. match Action(workspaceSlug)
    content = content.replace(/Action\(\s*workspaceSlug\s*\)/g, 'Action()');
    
    // 2. match Action(workspaceSlug, ...)
    content = content.replace(/Action\(\s*workspaceSlug\s*,/g, 'Action(');

    if (oldContent !== content) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated action calls in ${file}`);
    }
}
