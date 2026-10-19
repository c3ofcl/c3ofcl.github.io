/**
 * C3 website common components
 * custom elements: <site-header>, <site-footer>
 */

class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header class="site-header">
            <nav class="site-nav" aria-label="Main Navigation">
                <a href="/" class="site-logo">
                    <img src="/images/c3_logo_text_black.png" alt="C3 | Creative Computing Club" class="site-logo-img">
                </a>

                <button type="button" class="site-menu-toggle" aria-expanded="false" aria-label="メニューを開閉する">
                    <span class="site-menu-toggle-bar"></span>
                    <span class="site-menu-toggle-bar"></span>
                    <span class="site-menu-toggle-bar"></span>
                </button>

                <ul class="site-menu">
                    <li><a href="/" class="site-menu-link">ホーム</a></li>
                    <li><a href="/members/" class="site-menu-link">メンバー</a></li>
                </ul>
            </nav>
        </header>
        `;

        this.initMenu();
    }

    initMenu() {
        const toggle = this.querySelector('.site-menu-toggle');
        const menu = this.querySelector('.site-menu');
        if (!toggle || !menu) return;

        const setOpen = (open) => {
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            menu.classList.toggle('is-active', open);
        };

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            setOpen(!isOpen);
        });

        document.addEventListener('click', (e) => {
            if (!this.contains(e.target) && menu.classList.contains('is-active')) {
                setOpen(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('is-active')) {
                setOpen(false);
                toggle.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && menu.classList.contains('is-active')) {
                setOpen(false);
            }
        });
    }
}

class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="site-footer">
            <p class="site-footer-text">
                &copy;2026 C3 | Creative Computing Club.
                <br />All Rights Reserved.
            </p>
        </footer>
        `;
    }
}

if (!customElements.get('site-header')) {
    customElements.define('site-header', SiteHeader);
}

if (!customElements.get('site-footer')) {
    customElements.define('site-footer', SiteFooter);
}
