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

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;

            const originalUsername = trimmed.split('/')[0].trim();
            if (originalUsername) {
                list.push({
                    id: originalUsername.toLowerCase(),
                    name: originalUsername,
                });
            }
        }
        return list;
    } catch {
        return [];
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
        const card = document.createElement('a');
        card.href = `/members/${encodeURIComponent(member.id)}/`;
        card.className = 'member-card';
        card.id = `member-${member.id}`;

        const initial = (member.name && member.name.charAt(0)) ? member.name.charAt(0).toUpperCase() : 'M';

        card.innerHTML = `
            <div class="member-avatar" aria-hidden="true">${escapeHtml(initial)}</div>
            <div class="member-info">
                <h2 class="member-name">${escapeHtml(member.name)}</h2>
                <span class="member-label">Portfolio <span class="member-arrow" aria-hidden="true">&rarr;</span></span>
            </div>
        `;

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
