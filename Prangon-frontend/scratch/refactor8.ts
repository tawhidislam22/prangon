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
allFiles.push(path.join(srcDir, 'app/(dashboardLayout)/dashboard/page.tsx'));

for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    const oldContent = content;
    
    // In many files, we pass `workspaceSlug={workspaceSlug}` but `workspaceSlug` is `string | null` now.
    // Let's just find `const workspaceSlug = await getCurrentWorkspaceSlug();` and append `if (!workspaceSlug) return null;`
    // Actually, `const workspaceSlug = await getCurrentWorkspaceSlug() || "";` is much easier!
    content = content.replace(/const workspaceSlug = await getCurrentWorkspaceSlug\(\);/g, 'const workspaceSlug = (await getCurrentWorkspaceSlug()) || "";');

    if (oldContent !== content) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated nullability in ${file}`);
    }
}
