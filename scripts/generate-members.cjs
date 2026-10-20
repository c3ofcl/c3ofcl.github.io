const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const membersDir = path.join(rootDir, 'members');
const membersTxtPath = path.join(rootDir, 'members.txt');
const outputPath = path.join(membersDir, 'members.json');

/* parse members.txt and preserve order */
if (!fs.existsSync(membersDir)) {
    console.error(`Members directory not found at: ${membersDir}`);
    process.exit(1);
}

const existingDirs = new Set(
    fs.readdirSync(membersDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
        .map((entry) => entry.name.toLowerCase())
);

const membersList = [];
const processedIds = new Set();
const isCI = process.env.GITHUB_ACTIONS === 'true';

if (fs.existsSync(membersTxtPath)) {
    const lines = fs.readFileSync(membersTxtPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const parts = trimmed.split(/\s+/);
        // check for external URL: "username https://..."
        if (parts.length >= 2 && /^https?:\/\//i.test(parts[1])) {
            const originalUsername = parts[0].trim();
            const url = parts[1].trim();
            const id = originalUsername.toLowerCase();
            if (!processedIds.has(id)) {
                membersList.push({
                    id: id,
                    name: originalUsername,
                    url: url,
                    isExternal: true,
                });
                processedIds.add(id);
            }
        } else {
            // normal internal repo: "username/repo"
            const originalUsername = trimmed.split('/')[0].trim();
            const id = originalUsername.toLowerCase();
            const dirExists = existingDirs.has(id);

            // in CI, only include successfully cloned directories; locally include if dir exists or if no dirs exist yet
            if (!isCI || dirExists) {
                if (!processedIds.has(id)) {
                    membersList.push({
                        id: id,
                        name: originalUsername,
                    });
                    processedIds.add(id);
                }
            }
        }
    }
}

// fallback: add any directories in members/ not mentioned in members.txt
for (const dirName of existingDirs) {
    if (!processedIds.has(dirName)) {
        membersList.push({
            id: dirName,
            name: dirName,
        });
        processedIds.add(dirName);
    }
}

/* write json file */
fs.writeFileSync(outputPath, JSON.stringify(membersList, null, 2) + '\n', 'utf-8');
console.log(`Generated ${outputPath} with ${membersList.length} members:`);
membersList.forEach((m) => {
    const type = m.isExternal ? `(External: ${m.url})` : '(Internal)';
    console.log(` - ${m.id} -> ${m.name} ${type}`);
});
