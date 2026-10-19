const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const membersDir = path.join(rootDir, 'members');
const membersTxtPath = path.join(rootDir, 'members.txt');
const outputPath = path.join(membersDir, 'members.json');

/* parse members.txt for casing */
const casingMap = new Map();

if (fs.existsSync(membersTxtPath)) {
    const lines = fs.readFileSync(membersTxtPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const originalUsername = trimmed.split('/')[0].trim();
        if (originalUsername) {
            casingMap.set(originalUsername.toLowerCase(), originalUsername);
        }
    }
}

/* read subdirectories */
if (!fs.existsSync(membersDir)) {
    console.error(`Members directory not found at: ${membersDir}`);
    process.exit(1);
}

const entries = fs.readdirSync(membersDir, { withFileTypes: true });
const memberDirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('.'));

/* sort alphabetically */
memberDirs.sort((a, b) => a.localeCompare(b));

/* build member list */
const membersList = memberDirs.map((dirName) => {
    const dirLower = dirName.toLowerCase();
    const displayName = casingMap.has(dirLower) ? casingMap.get(dirLower) : dirName;
    return {
        id: dirLower,
        name: displayName,
    };
});

/* write json file */
fs.writeFileSync(outputPath, JSON.stringify(membersList, null, 2) + '\n', 'utf-8');
console.log(`Generated ${outputPath} with ${membersList.length} members:`);
membersList.forEach((m) => console.log(` - ${m.id} -> ${m.name}`));
