(() => {
    "use strict";

    const ROCKET_ROOT_SELECTOR = ".rocket-scene";
    const STAR_COUNT = 150;

    const SPRINKLE_SPREAD = 30;
    const SPRINKLE_DRIFT_X_RANGE = 150;
    const SPRINKLE_FALL_MIN = 100;
    const SPRINKLE_FALL_RANGE = 300;
    const SPRINKLE_MIN_DURATION = 0.5;
    const SPRINKLE_DURATION_RANGE = 0.7;
    const HOVER_BATCH = 12;
    const HOVER_THROTTLE = 80;
    const LAUNCH_COUNT = 40;
    const LAUNCH_INTERVAL = 20;
    const EXHAUST_OFFSET_Y = 180;
    const SMOKE_INTERVAL = 120;

    function getThemeFromDocument() {
        const t = document.documentElement.getAttribute("data-theme");
        return t === "light" ? "light" : "dark";
    }

    function setThemeOnRocketRoot(root, theme) {
        root.setAttribute("data-theme", theme);
    }

    function buildStars(starContainer) {
        if (!starContainer) return;

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

    function createSprinkle(x, y) {
        const s = document.createElement("div");
        s.className = "sprinkle";

        const ox = (Math.random() - 0.5) * SPRINKLE_SPREAD;
        const oy = (Math.random() - 0.5) * SPRINKLE_SPREAD;

        s.style.left = x + ox + "px";
        s.style.top = y + oy + "px";

        const tx = (Math.random() - 0.5) * SPRINKLE_DRIFT_X_RANGE + "px";
        const ty = Math.random() * SPRINKLE_FALL_RANGE + SPRINKLE_FALL_MIN + "px";
        const duration = Math.random() * SPRINKLE_DURATION_RANGE + SPRINKLE_MIN_DURATION;

        s.style.setProperty("--tx", tx);
        s.style.setProperty("--ty", ty);
        s.style.setProperty("--duration", duration + "s");

        document.body.appendChild(s);

        window.setTimeout(() => s.remove(), duration * 1000 + 100);
    }

    function installSprinkles(rocketContainer) {
        if (!rocketContainer) return;

        const trigger = rocketContainer.querySelector(".exhaust-trigger");
        if (!trigger) return;

        let isHovering = false;
        let lastSpawnTime = 0;

        const onEnter = () => {
            isHovering = true;
        };
        const onLeave = () => {
            isHovering = false;
        };
        const onMove = (e) => {
            if (!isHovering) return;

            const now = performance.now();
            if (now - lastSpawnTime < HOVER_THROTTLE) return;
            lastSpawnTime = now;

            for (let i = 0; i < HOVER_BATCH; i++) createSprinkle(e.clientX, e.clientY);
        };

        trigger.addEventListener("mouseenter", onEnter);
        trigger.addEventListener("mouseleave", onLeave);
        trigger.addEventListener("mousemove", onMove);
    }

    function spawnExhaustBurst(rocketContainer) {
        const rect = rocketContainer.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + EXHAUST_OFFSET_Y;

        for (let i = 0; i < LAUNCH_COUNT; i++) {
            window.setTimeout(() => createSprinkle(cx, cy), i * LAUNCH_INTERVAL);
        }
    }

    function createSmoke(rocketContainer) {
        const rect = rocketContainer.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + EXHAUST_OFFSET_Y;

        const smoke = document.createElement("div");
        smoke.className = "smoke";

        smoke.style.left = cx + (Math.random() - 0.5) * 20 + "px";
        smoke.style.top = cy + "px";

        const size = Math.random() * 15 + 8;
        smoke.style.width = size + "px";
        smoke.style.height = size + "px";
        smoke.style.background = `rgba(${150 + Math.random() * 50}, ${150 + Math.random() * 50}, ${160 + Math.random() * 50}, 0.3)`;

        const sx = (Math.random() - 0.5) * 80 + "px";
        const sy = Math.random() * 120 + 60 + "px";
        smoke.style.setProperty("--sx", sx);
        smoke.style.setProperty("--sy", sy);

        const dur = Math.random() * 1.5 + 1;
        smoke.style.animation = `smokeDrift ${dur}s ease-out forwards`;

        document.body.appendChild(smoke);
        window.setTimeout(() => smoke.remove(), dur * 1000 + 100);
    }

    function installSmoke(rocketContainer) {
        if (!rocketContainer) return;

        window.setInterval(() => {
            if (rocketContainer.classList.contains("launching")) return;
            createSmoke(rocketContainer);
        }, SMOKE_INTERVAL);
    }

    function installLaunchTransition(root, rocketContainer) {
        const links = document.querySelectorAll(".posts-grid .post-card a");
        if (!links.length) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        links.forEach((link) => {
            link.addEventListener("click", (event) => {
                if (rocketContainer && rocketContainer.dataset.launching === "true") {
                    event.preventDefault();
                    return;
                }

                if (reducedMotion || !rocketContainer) return;

                event.preventDefault();
                rocketContainer.dataset.launching = "true";

                const destination = link.href;
                let navigated = false;
                const navigate = () => {
                    if (navigated) return;
                    navigated = true;
                    window.location.href = destination;
                };

                rocketContainer.addEventListener("animationend", navigate, { once: true });
                window.setTimeout(navigate, 1400);

                spawnExhaustBurst(rocketContainer);
                rocketContainer.classList.add("launching");
            });
        });
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

        const rocketContainer = root.querySelector(".rocket-container");
        installSprinkles(rocketContainer);
        installSmoke(rocketContainer);

        installLaunchTransition(root, rocketContainer);
    }

    function initAllRockets() {
        const roots = document.querySelectorAll(ROCKET_ROOT_SELECTOR);
        roots.forEach(initRocket);
    }

    function playLandingAnimation(rocketContainer) {
        rocketContainer.classList.remove("launching");
        delete rocketContainer.dataset.launching;

        rocketContainer.classList.add("landing");
        spawnExhaustBurst(rocketContainer);

        const finish = () => rocketContainer.classList.remove("landing");
        rocketContainer.addEventListener("animationend", finish, { once: true });
        window.setTimeout(finish, 1400);
    }

    function resetLaunchState() {
        document.querySelectorAll(".rocket-container").forEach((el) => {
            if (el.classList.contains("launching") || el.dataset.launching === "true") {
                playLandingAnimation(el);
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAllRockets);
    } else {
        initAllRockets();
    }

    // When the browser restores this page from bfcache (e.g. via the back button),
    // no load/DOMContentLoaded fires, so the "launching" class (and its `forwards`
    // animation end-state that hides the rocket) would otherwise persist forever.
    window.addEventListener("pageshow", (event) => {
        if (!event.persisted) return;
        resetLaunchState();
    });
})();
