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

    // Fix trailing comma after removing param
    const oldContent = content;
    content = content.replace(/\(\s*,/g, '(');
    
    // Also anywhere workspaceSlug is used but it was removed from arguments
    // For actions.ts files, they now need to fetch it!
    if (file.endsWith('actions.ts')) {
        if (content.includes('workspaceSlug') && !content.includes('getCurrentWorkspaceSlug')) {
            content = `import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";\n` + content;
        }
        
        // Find every async function declaration and add const workspaceSlug = await getCurrentWorkspaceSlug(); inside it if it uses workspaceSlug
        // But simpler: just replace `workspaceSlug` with `(await getCurrentWorkspaceSlug())` directly if it's an action?
        // Wait, some actions just use `${workspaceSlug}`.
        content = content.replace(/\$\{workspaceSlug\}/g, '${await getCurrentWorkspaceSlug()}');
        content = content.replace(/\(\s*workspaceSlug\s*,/g, '('); // just in case
    }

    if (oldContent !== content) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated commas in ${file}`);
    }
}
