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
    if (file.endsWith('actions.ts')) {
        let content = fs.readFileSync(file, 'utf-8');
        let lines = content.split('\n');
        
        let useServerIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('"use server";') || lines[i].includes("'use server';")) {
                useServerIndex = i;
                break;
            }
        }
        
        if (useServerIndex > 0) {
            const useServerLine = lines.splice(useServerIndex, 1)[0];
            lines.unshift(useServerLine);
            fs.writeFileSync(file, lines.join('\n'), 'utf-8');
            console.log(`Fixed use server in ${file}`);
        }
    }
}
