document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. スムーススクロール (Lenis) の初期化
    // ==========================================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 高級感のある滑らかな減速
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ==========================================================================
    // 2. 慣性カスタムカーソル (遅延追従)
    // ==========================================================================
    // アニメーションループでイージング（遅延）を表現
    function renderCursor() {
        // ドットは素早く追従
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

        // リングは少し遅れて優雅に追従
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // 特定の要素（ボタンやリンク、カード）にホバーした時のエフェクト
    const hoverElements = document.querySelectorAll('[data-cursor="pointer"], a, button');
    hoverElements.forEach((el) => {
        el.addEventListener("mouseenter", () => document.body.classList.add("is-hovered"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("is-hovered"));
    });


    // ==========================================================================
    // 3. GSAP アニメーション
    // ==========================================================================
    // ScrollTriggerプラグインを有効化
    gsap.registerPlugin(ScrollTrigger);

    // --- ヒーロータイトルの1文字ずつの分割処理 ---
    const splitTextElements = document.querySelectorAll(".split-text span, .split-text em");
    splitTextElements.forEach((el) => {
        const text = el.textContent;
        el.innerHTML = "";
        // 1文字ずつ <span> で囲む
        [...text].forEach((char) => {
            const span = document.createElement("span");
            span.classList.add("char");
            // スペースの場合はそのまま保持
            span.textContent = char === " " ? "\u00A0" : char;
            el.appendChild(span);
        });
    });

    // --- ヒーローセクションのオープニングタイムライン ---
    const tl = gsap.timeline();
    tl.fromTo(".hero-label", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out" })
      .to(".hero-title .char", { y: "0%", duration: 1.2, ease: "power4.out", stagger: 0.03 }, "-=0.8")
      .fromTo(".hero-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.8")
      .fromTo(".btn-hero", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.8")

    // --- 各セクションのスクロールインアニメーション ---
    const fadeUpTargets = document.querySelectorAll(".fade-up-trigger");
    fadeUpTargets.forEach((target) => {
        gsap.fromTo(target, 
            { opacity: 0, y: 40 }, 
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: target,
                    start: "top 85%", // 画面の下方15%の位置に要素が入ったらスタート
                    toggleActions: "play none none none" // 一度だけ再生
                }
            }
        );
    });
});