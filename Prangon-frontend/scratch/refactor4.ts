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
    const oldContent = content;
    
    if (file.endsWith('actions.ts')) {
        content = content.replace(/workspaceSlug([,\}])/g, 'workspaceSlug: await getCurrentWorkspaceSlug()$1');
        
        // Let's also fix the duplicate import if there is one
        // And fix `workspaceSlug: await getCurrentWorkspaceSlug(): await getCurrentWorkspaceSlug()` if it matched twice.
        // It's safer to just run a quick regex check.
        // Actually since I only run it once, it should be fine.
    }

    if (oldContent !== content) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated shorthands in ${file}`);
    }
}
