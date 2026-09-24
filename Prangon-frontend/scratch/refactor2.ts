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

    // Remove `workspaceSlug: string;` from params definitions
    const oldContent = content;
    content = content.replace(/workspaceSlug\s*:\s*string\s*;?/g, '');
    
    // If it left an empty Promise<{}>, remove params entirely if we can, but simpler just to let it be Promise<{}> for now? 
    // Wait, if it's an empty object `{}` but the route has NO dynamic segments, Next.js throws an error because params shouldn't be defined with properties it doesn't have.
    // Actually, `params: Promise<{}>` might be fine, but if it says `params?: Promise<any>` or we just omit params...
    // Let's replace `params: Promise<{ }>` with `params?: Promise<any>`
    content = content.replace(/params\s*:\s*Promise<\{\s*\}>/g, 'params?: Promise<any>');

    if (oldContent !== content) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated types in ${file}`);
    }
}
