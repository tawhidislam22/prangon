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
    
    // Replace `const { workspaceSlug, projectId } = await params;`
    // with `const { projectId } = await params;`
    content = content.replace(/const\s+\{\s*workspaceSlug\s*,\s*([^}]+)\}\s*=\s*await\s+params;/g, 'const { $1 } = await params;');
    // Or if workspaceSlug is at the end:
    content = content.replace(/const\s+\{\s*([^,]+)\s*,\s*workspaceSlug\s*\}\s*=\s*await\s+params;/g, 'const { $1 } = await params;');
    
    if (oldContent !== content) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated params in ${file}`);
    }
}
