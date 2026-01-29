(() => {
    "use strict";

    const ROCKET_ROOT_SELECTOR = ".rocket-scene";
    const STAR_COUNT = 150;

    function getThemeFromDocument() {
        const t = document.documentElement.getAttribute("data-theme");
        return t === "light" ? "light" : "dark";
    }

    function setThemeOnRocketRoot(root, theme) {
        // Prefer scoping theme to the rocket root to avoid affecting site CSS.
        // Your rocket CSS should use: .rocket-scene[data-theme="dark"] { ... }
        root.setAttribute("data-theme", theme);
    }

    function buildStars(starContainer) {
        if (!starContainer) return;

        // Clear if this is re-initialized (e.g., in partial hot reload)
        starContainer.textContent = "";

        for (let i = 0; i < STAR_COUNT; i++) {
            const star = document.createElement("div");
            star.className = "star-bg";

            star.style.left = Math.random() * 100 + "%";
            star.style.top = Math.random() * 100 + "%";

            const size = Math.random() * 2;
            star.style.width = size + "px";
            star.style.height = size + "px";

            star.style.setProperty("--duration", Math.random() * 3 + 2 + "s");
            star.style.animationDelay = Math.random() * 5 + "s";

            starContainer.appendChild(star);
        }
    }

    function installSprinkles(root, triggerEl) {
        if (!root || !triggerEl) return;

        let isHovering = false;

        const onEnter = () => {
            isHovering = true;
        };
        const onLeave = () => {
            isHovering = false;
        };

        const onMove = (e) => {
            if (!isHovering) return;

            // Use trigger-relative coordinates so we can position inside the rocket root.
            const triggerRect = triggerEl.getBoundingClientRect();
            const rootRect = root.getBoundingClientRect();

            const localX = e.clientX - rootRect.left;
            const localY = e.clientY - rootRect.top;

            // Create a few sprinkles per move
            for (let i = 0; i < 4; i++) createSprinkle(root, localX, localY);
        };

        triggerEl.addEventListener("mouseenter", onEnter);
        triggerEl.addEventListener("mouseleave", onLeave);
        triggerEl.addEventListener("mousemove", onMove);
    }

    function createSprinkle(root, x, y) {
        const s = document.createElement("div");
        s.className = "sprinkle";

        // Slight random offset around cursor
        const ox = (Math.random() - 0.5) * 30;
        const oy = (Math.random() - 0.5) * 30;

        s.style.left = x + ox + "px";
        s.style.top = y + oy + "px";

        // Fall vector + rotation
        const tx = (Math.random() - 0.5) * 150 + "px";
        const ty = Math.random() * 300 + 100 + "px";
        const rot = Math.random() * 360 * 2 + "deg";

        s.style.setProperty("--tx", tx);
        s.style.setProperty("--ty", ty);
        s.style.setProperty("--rot", rot);

        const dur = Math.random() * 0.7 + 0.6;
        s.style.animation = `tumbleFall ${dur}s linear forwards`;

        // Ensure positioning is relative to the rocket root box.
        // Your CSS should set `.rocket-scene { position: relative; overflow: hidden; }`
        root.appendChild(s);

        window.setTimeout(() => s.remove(), dur * 1000 + 120);
    }

    function initRocket(root) {
        if (!root || root.dataset.rocketInitialized === "true") return;
        root.dataset.rocketInitialized = "true";

        // Theme sync (scoped to this rocket instance)
        setThemeOnRocketRoot(root, getThemeFromDocument());

        // Observe site theme changes: when you toggle html[data-theme], update rocket root
        const themeObserver = new MutationObserver(() => {
            setThemeOnRocketRoot(root, getThemeFromDocument());
        });
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        // Also support legacy postMessage theme changes (if you already do that somewhere)
        window.addEventListener("message", (event) => {
            const data = event && event.data;
            if (!data || data.type !== "set-theme") return;
            setThemeOnRocketRoot(root, data.theme === "light" ? "light" : "dark");
        });

        const starContainer = root.querySelector("#star-container");
        buildStars(starContainer);

        const trigger = root.querySelector("#trigger");
        installSprinkles(root, trigger);
    }

    function initAllRockets() {
        const roots = document.querySelectorAll(ROCKET_ROOT_SELECTOR);
        roots.forEach(initRocket);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAllRockets);
    } else {
        initAllRockets();
    }
})();
