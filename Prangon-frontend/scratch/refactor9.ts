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
    
    // Remove workspaceSlug prop from InviteMemberDialog
    content = content.replace(/<InviteMemberDialog\s+workspaceSlug=\{[^}]+\}\s*\/>/g, '<InviteMemberDialog />');
    // Remove workspaceSlug prop from anywhere else if we missed it
    // Actually just for components that don't need it.
    // It's probably easier to just remove `workspaceSlug={workspaceSlug}` globally in app/owner IF it's failing? No, some components do need it.
    // Wait, let's just do it for InviteMemberDialog and MemberRowActions and InvitationRowActions
    content = content.replace(/<InviteMemberDialog\s+workspaceSlug=\{[^}]+\}\s*\/?>/g, '<InviteMemberDialog />');
    
    if (oldContent !== content) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated props in ${file}`);
    }
}
