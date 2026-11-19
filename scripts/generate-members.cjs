const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const membersDir = path.join(rootDir, 'members');
const membersTxtPath = path.join(rootDir, 'members.txt');
const outputPath = path.join(membersDir, 'members.json');

if (process.argv.includes('--list-repos')) {
    if (fs.existsSync(membersTxtPath)) {
        const lines = fs.readFileSync(membersTxtPath, 'utf-8').split(/\r?\n/);
        for (const line of lines) {
            const parsed = parseMemberLine(line);
            if (!parsed || parsed.isExternal || !parsed.repo) continue;
            console.log(`${parsed.id} ${parsed.repo}`);
        }
    }
    process.exit(0);
}

/**
 * Parse a line from members.txt
 * Supports:
 * - External URLs:
 *     "id name https://..."
 *     "id https://... name"
 *     "username https://..." (id and name default to username)
 *     "id=... name=... url=..."
 * - Internal repositories:
 *     "owner/repo" (id defaults to owner.toLowerCase(), name defaults to owner)
 *     "owner/repo DisplayName" (id defaults to owner.toLowerCase(), name is DisplayName)
 *     "id owner/repo DisplayName" (explicit id and name)
 *     "id=... name=... repo=..."
 */
function parseMemberLine(line) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return null;

    // 1. key=value format (e.g. id=v76nl name="wash" url=https://...)
    if (trimmed.includes('id=') || trimmed.includes('name=')) {
        const idMatch = trimmed.match(/\bid=([^\s]+)/i);
        const nameMatch = trimmed.match(/\bname=(?:"([^"]+)"|'([^']+)'|([^\s]+))/i);
        const urlMatch = trimmed.match(/\burl=([^\s]+)/i);
        const repoMatch = trimmed.match(/\brepo=([^\s]+)/i);

        let url = urlMatch ? urlMatch[1] : null;
        let repo = repoMatch ? repoMatch[1] : null;

        if (!url) {
            const rawUrlMatch = trimmed.match(/https?:\/\/[^\s]+/i);
            if (rawUrlMatch) url = rawUrlMatch[0];
        }
        if (!repo && !url) {
            const rawRepoMatch = trimmed.match(/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/);
            if (rawRepoMatch) repo = rawRepoMatch[0];
        }

        const rawId = idMatch ? idMatch[1] : (repo ? repo.split('/')[0] : '');
        if (!rawId) return null;

        const id = rawId.toLowerCase();
        const name = nameMatch ? (nameMatch[1] || nameMatch[2] || nameMatch[3]) : rawId;

        if (url) {
            return { id, name, url, isExternal: true };
        }
        return { id, name, repo: repo || null, isExternal: false };
    }

    // 2. External URL
    const urlMatch = trimmed.match(/https?:\/\/[^\s]+/i);
    if (urlMatch) {
        const url = urlMatch[0];
        const rest = trimmed.replace(url, '').trim();
        const tokens = rest.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
        const cleanTokens = tokens.map((t) => t.replace(/^["']|["']$/g, '').trim()).filter(Boolean);

        if (cleanTokens.length === 0) return null;

        let id = '';
        let name = '';

        if (cleanTokens.length === 1) {
            const token = cleanTokens[0];
            if (token.includes(':')) {
                const parts = token.split(':');
                id = parts[0].trim();
                name = parts.slice(1).join(':').trim() || id;
            } else {
                id = token;
                name = token;
            }
        } else {
            // First token is id, remaining tokens form name
            id = cleanTokens[0];
            name = cleanTokens.slice(1).join(' ');
        }

        return {
            id: id.toLowerCase(),
            name: name,
            url: url,
            isExternal: true,
        };
    }

    // 3. Internal repository or member directory
    const tokens = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    const cleanTokens = tokens.map((t) => t.replace(/^["']|["']$/g, '').trim()).filter(Boolean);
    if (cleanTokens.length === 0) return null;

    const repoIndex = cleanTokens.findIndex((t) => t.includes('/') && !t.startsWith('/'));

    if (repoIndex !== -1) {
        const repo = cleanTokens[repoIndex];
        const owner = repo.split('/')[0];

        if (repoIndex === 0) {
            // repo is first: "owner/repo [Name...]"
            const nameTokens = cleanTokens.slice(1);
            const name = nameTokens.length > 0 ? nameTokens.join(' ') : owner;
            return {
                id: owner.toLowerCase(),
                name: name,
                repo: repo,
                isExternal: false,
            };
        } else {
            // e.g. "custom_id owner/repo [Name...]"
            const id = cleanTokens[0];
            const nameTokens = cleanTokens.slice(repoIndex + 1);
            const name = nameTokens.length > 0 ? nameTokens.join(' ') : cleanTokens.slice(1).filter((_, i) => i !== repoIndex - 1).join(' ') || id;
            return {
                id: id.toLowerCase(),
                name: name,
                repo: repo,
                isExternal: false,
            };
        }
    } else {
        if (cleanTokens.length === 1) {
            const token = cleanTokens[0];
            if (token.includes(':')) {
                const parts = token.split(':');
                const id = parts[0].trim();
                const name = parts.slice(1).join(':').trim() || id;
                return { id: id.toLowerCase(), name, isExternal: false };
            }
            return {
                id: token.toLowerCase(),
                name: token,
                isExternal: false,
            };
        } else {
            const id = cleanTokens[0];
            const name = cleanTokens.slice(1).join(' ');
            return {
                id: id.toLowerCase(),
                name: name,
                isExternal: false,
            };
        }
    }
}

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
        const parsed = parseMemberLine(line);
        if (!parsed) continue;

        const { id, name, url, isExternal } = parsed;
        if (processedIds.has(id)) continue;

        if (isExternal) {
            membersList.push({
                id: id,
                name: name,
                url: url,
                isExternal: true,
            });
            processedIds.add(id);
        } else {
            const dirExists = existingDirs.has(id);
            // in CI, only include successfully cloned directories; locally include if dir exists or if no dirs exist yet
            if (!isCI || dirExists) {
                membersList.push({
                    id: id,
                    name: name,
                });
                processedIds.add(id);
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

module.exports = { parseMemberLine };
