/* members directory script */

document.addEventListener('DOMContentLoaded', () => {
    initMembersGrid();
});

async function initMembersGrid() {
    const grid = document.getElementById('members-grid');
    if (!grid) return;

    try {
        let members = await fetchMembersJson();

        /* fallback if json is missing */
        if (!members || members.length === 0) {
            members = await fetchMembersTxtFallback();
        }

        renderMembers(grid, members);
    } catch (error) {
        console.error('Failed to load members:', error);
        grid.innerHTML = '<p class="members-error">メンバー情報の読み込みに失敗しました。</p>';
    }
}

/* fetch members from json */
async function fetchMembersJson() {
    try {
        const response = await fetch('/members/members.json', { cache: 'no-cache' });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

/* fallback from members.txt */
async function fetchMembersTxtFallback() {
    try {
        const response = await fetch('/members.txt', { cache: 'no-cache' });
        if (!response.ok) return [];
        const text = await response.text();
        const lines = text.split(/\r?\n/);
        const list = [];
        const processedIds = new Set();

        for (const line of lines) {
            const parsed = parseMemberTxtLine(line);
            if (!parsed || processedIds.has(parsed.id)) continue;

            processedIds.add(parsed.id);
            if (parsed.isExternal) {
                list.push({
                    id: parsed.id,
                    name: parsed.name,
                    url: parsed.url,
                    isExternal: true,
                });
            } else {
                list.push({
                    id: parsed.id,
                    name: parsed.name,
                });
            }
        }
        return list;
    } catch {
        return [];
    }
}

function parseMemberTxtLine(line) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return null;

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
        return { id, name, isExternal: false };
    }

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

/* render member cards */
function renderMembers(container, members) {
    container.innerHTML = '';

    if (!members || members.length === 0) {
        container.innerHTML = '<p class="members-empty">登録されているメンバーはありません。</p>';
        return;
    }

    const fragment = document.createDocumentFragment();

    members.forEach((member) => {
        const isExternal = Boolean(
            member.isExternal ||
            (member.url && /^https?:\/\//i.test(member.url) && !member.url.includes('c3ofcl.github.io'))
        );

        const card = document.createElement('a');
        if (isExternal && member.url) {
            card.href = member.url;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
        } else {
            card.href = member.url || `/members/${encodeURIComponent(member.id)}/`;
        }
        card.className = 'member-card';
        if (isExternal) {
            card.classList.add('is-external');
        }
        card.id = `member-${member.id}`;

        const initial = (member.name && member.name.charAt(0)) ? member.name.charAt(0).toUpperCase() : 'M';

        const avatar = document.createElement('div');
        avatar.className = 'member-avatar';
        avatar.setAttribute('aria-hidden', 'true');

        const initialSpan = document.createElement('span');
        initialSpan.className = 'member-avatar-initial';
        initialSpan.textContent = initial;
        avatar.appendChild(initialSpan);

        const username = member.id || member.name;
        if (username) {
            const img = document.createElement('img');
            img.className = 'member-avatar-img';
            img.alt = '';
            img.loading = 'lazy';
            img.decoding = 'async';
            img.onload = () => {
                initialSpan.style.display = 'none';
                avatar.classList.add('has-image');
            };
            img.onerror = () => {
                img.remove();
                avatar.classList.remove('has-image');
            };
            img.src = `https://github.com/${encodeURIComponent(username)}.png?size=96`;
            avatar.appendChild(img);
        }

        const actionLabel = isExternal
            ? 'Portfolio <span class="member-badge-external">外部</span>'
            : 'Portfolio <span class="member-arrow" aria-hidden="true">&rarr;</span>';

        const info = document.createElement('div');
        info.className = 'member-info';
        info.innerHTML = `
            <h2 class="member-name">${escapeHtml(member.name)}</h2>
            <span class="member-label">${actionLabel}</span>
        `;

        card.appendChild(avatar);
        card.appendChild(info);

        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}

/* escape html */
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
