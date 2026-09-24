import fs from 'fs';
import path from 'path';

const srcDir = 'e:/Prangon/Prangon-frontend/src';
const ownerDir = path.join(srcDir, 'app', 'owner');

// 2. Find all TS/TSX files
function getFiles(dir: string, fileList: string[] = []): string[] {
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

// 3. Replace text in files
for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    // Replace /w/${workspaceSlug} or /w/[workspaceSlug] with /owner
    if (content.includes('/w/${workspaceSlug}')) {
        content = content.replace(/\/w\/\$\{workspaceSlug\}/g, '/owner');
        modified = true;
    }
    if (content.includes('/w/${workspace.slug}')) {
        content = content.replace(/\/w\/\$\{workspace\.slug\}/g, '/owner');
        modified = true;
    }
    if (content.includes('/w/[workspaceSlug]')) {
        content = content.replace(/\/w\/\[workspaceSlug\]/g, '/owner');
        modified = true;
    }
    // Also replace hardcoded paths just in case
    if (content.includes('href={`/w/${workspaceSlug}')) {
        content = content.replace(/href=\{`\/w\/\$\{workspaceSlug\}/g, 'href={`/owner');
        modified = true;
    }
    if (content.includes('href={`/w/${workspace.slug}')) {
        content = content.replace(/href=\{`\/w\/\$\{workspace\.slug\}/g, 'href={`/owner');
        modified = true;
    }
    if (content.includes('href={`/w/${workspaces[0].slug}')) {
        content = content.replace(/href=\{`\/w\/\$\{workspaces\[0\]\.slug\}/g, 'href={`/owner');
        modified = true;
    }

    // Server-side param extraction
    const destructuredParamsRegex = /const\s*\{\s*workspaceSlug\s*\}\s*=\s*(?:await\s+)?params;/g;
    if (destructuredParamsRegex.test(content) && file.includes('app\\owner')) {
        if (!content.includes('getCurrentWorkspaceSlug')) {
            content = `import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";\n` + content;
        }
        content = content.replace(destructuredParamsRegex, 'const workspaceSlug = await getCurrentWorkspaceSlug();');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated links in ${file}`);
    }
}
