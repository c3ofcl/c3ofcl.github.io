/* load project list on dom ready */
document.addEventListener('DOMContentLoaded', () => {
    initProjectsGrid();
});

/* fetch and render projects */
async function initProjectsGrid() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    try {
        const projects = await fetchProjectsJson();
        renderProjects(grid, projects);
    } catch (error) {
        console.error('Failed to load projects:', error);
        grid.innerHTML = '<p class="projects-error">プロジェクト情報の読み込みに失敗しました。</p>';
    }
}

/* request project data */
async function fetchProjectsJson() {
    try {
        const response = await fetch('/projects/projects.json', { cache: 'no-cache' });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

/* build and append project cards */
function renderProjects(container, projects) {
    container.innerHTML = '';

    if (!projects || projects.length === 0) {
        container.innerHTML = '<p class="projects-empty">登録されているプロジェクトはありません。</p>';
        return;
    }

    const fragment = document.createDocumentFragment();

    projects.forEach((project) => {
        const isExternal = Boolean(
            project.isExternal ||
            (project.url && /^https?:\/\//i.test(project.url) && !project.url.includes('c3ofcl.github.io'))
        );

        const isPaused = project.status === 'paused' || project.statusLabel === '休止中';
        const statusClass = isPaused ? 'status-paused' : 'status-in-progress';
        const statusText = isPaused ? '休止中' : '進行中';

        const card = document.createElement('a');
        card.className = `project-card ${statusClass}`;
        if (isExternal) {
            card.classList.add('is-external');
        }
        card.id = `project-${project.id || 'item'}`;

        if (project.url && project.url !== '#') {
            card.href = project.url;
            if (isExternal) {
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
            }
        } else {
            card.href = '#';
            card.addEventListener('click', (e) => {
                e.preventDefault();
            });
        }

        const yearText = formatProjectYear(project.year);

        const actionLabel = isExternal
            ? '詳細を見る <span class="project-badge-external">外部</span>'
            : '詳細を見る <span class="project-arrow" aria-hidden="true">&rarr;</span>';

        card.innerHTML = `
            <div class="project-top">
                <h2 class="project-title" title="${escapeHtml(project.title)}">${escapeHtml(project.title)}</h2>
                <div class="project-meta">
                    <span class="project-year">${escapeHtml(yearText)}</span>
                    <span class="project-badge-status">${escapeHtml(statusText)}</span>
                </div>
                <p class="project-description">${escapeHtml(project.description || '')}</p>
            </div>
            <div class="project-footer">
                <span class="project-action-label">${actionLabel}</span>
            </div>
        `;

        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}

/* format single year or year range */
function formatProjectYear(yearInput) {
    if (!yearInput && yearInput !== 0) return '';

    /* array of years */
    if (Array.isArray(yearInput)) {
        const cleaned = yearInput
            .map((y) => String(y).replace(/年度/g, '').trim())
            .filter(Boolean);
        if (cleaned.length === 0) return '';
        if (cleaned.length === 1) return `${cleaned[0]}年度`;
        return `${cleaned[0]}〜${cleaned[cleaned.length - 1]}年度`;
    }

    const str = String(yearInput).trim();
    if (!str) return '';

    /* range string */
    const rangeMatch = str.match(/^([0-9]{4})(?:年度)?\s*(?:[-~〜–—]|to)\s*([0-9]{4}|現在)(?:年度)?$/i);
    if (rangeMatch) {
        const start = rangeMatch[1];
        const end = rangeMatch[2];
        return end === '現在' ? `${start}年度〜現在` : `${start}〜${end}年度`;
    }

    return str.endsWith('年度') ? str : `${str}年度`;
}

/* escape html characters */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
