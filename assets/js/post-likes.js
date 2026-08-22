/*
  Floating heart on post pages. Each reader can click up to MAX_LIKES times:
  every click fills the heart one step further and adds one to the shared count
  in Supabase, through the increment_likes() function that is the only write
  path the anon key is granted. The reader's own level is kept in localStorage
  so a refilled heart survives a reload.

  Everything here is best-effort: with no config, a blocked request or a browser
  that refuses storage, the heart still fills and nothing lands in the console.
*/
(() => {
    "use strict";

    const ROOT_SELECTOR = ".post-likes";
    const STORAGE_KEY = "likedPosts";
    const TABLE = "post_likes";
    const RPC = "increment_likes";

    const MAX_LIKES = 10;
    // Fill height as a percentage of the glyph box: the floor clears the
    // heart's bottom tip, the ceiling clears its top. CSS transitions between
    // them, so no rAF is needed and a backgrounded tab cannot strand the fill.
    const FILL_MIN = 10;
    const FILL_MAX = 86;
    const FILL_CURVE = 0.7;

    function readStore() {
        try {
            const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
            return parsed && typeof parsed === "object" ? parsed : {};
        } catch (err) {
            return {};
        }
    }

    function readLevel(slug) {
        const stored = readStore()[slug];
        if (typeof stored === "number") {
            return Math.max(0, Math.min(MAX_LIKES, Math.round(stored)));
        }
        // Earlier versions stored a bare `true` for a single like.
        return stored ? 1 : 0;
    }

    function writeLevel(slug, level) {
        try {
            const store = readStore();
            store[slug] = level;
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        } catch (err) {
            /* private mode: the level just does not survive the reload */
        }
    }

    function setupWidget(root) {
        const button = root.querySelector(".post-likes__btn");
        const glyph = root.querySelector(".post-likes__glyph");
        const counter = root.querySelector(".post-likes__count");
        const slug = root.dataset.likesSlug;

        if (!button || !glyph || !slug) {
            return;
        }

        const url = root.dataset.likesUrl;
        const key = root.dataset.likesKey;
        const remote = Boolean(url && key && counter);
        const headers = remote
            ? { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" }
            : null;

        let level = readLevel(slug);
        let count = null;
        // Clicks are sent one at a time so the counts come back in order.
        let queue = Promise.resolve();

        function paintFill() {
            // The heart is narrow at the bottom, so equal height steps would
            // make the first clicks nearly invisible. This curve trades height
            // for roughly even *area* per click.
            const progress = Math.pow(level / MAX_LIKES, FILL_CURVE);
            const pct = FILL_MIN + (FILL_MAX - FILL_MIN) * progress;
            root.style.setProperty("--like-fill", pct.toFixed(2) + "%");
        }

        function renderLevel() {
            const full = level >= MAX_LIKES;

            root.classList.toggle("is-liked", level > 0);
            root.classList.toggle("is-full", full);
            // Kept focusable rather than disabled, so the state stays readable
            // to screen readers and the keyboard; the click handler ignores
            // presses past the maximum.
            button.setAttribute("aria-pressed", level > 0 ? "true" : "false");
            button.title = level
                ? "Liked " + level + " of " + MAX_LIKES + (full ? " — thank you!" : "")
                : "Like this post";
            button.setAttribute("aria-label", button.title);

            paintFill();
        }

        function renderCount() {
            if (!counter || count === null) {
                return;
            }
            counter.textContent = String(count);
            counter.hidden = false;
        }

        function pop() {
            root.classList.remove("is-popping");
            // Restart the animation on every click, not just the first.
            void glyph.offsetWidth;
            root.classList.add("is-popping");
        }

        function fetchCount() {
            const query =
                url + "/rest/v1/" + TABLE + "?slug=eq." + encodeURIComponent(slug) + "&select=likes";

            fetch(query, { headers })
                .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
                .then((rows) => {
                    const remoteCount = rows && rows.length ? rows[0].likes : 0;
                    // The optimistic count may already be ahead of this read.
                    count = count === null ? remoteCount : Math.max(count, remoteCount);
                    renderCount();
                })
                .catch(() => {
                    /* leave the count hidden */
                });
        }

        function sendLike() {
            return fetch(url + "/rest/v1/rpc/" + RPC, {
                method: "POST",
                headers,
                body: JSON.stringify({ post_slug: slug })
            })
                .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
                .then((newCount) => {
                    if (typeof newCount === "number") {
                        // Counts only ever grow, so never step backwards.
                        count = count === null ? newCount : Math.max(count, newCount);
                        renderCount();
                    }
                });
        }

        function rollBack() {
            level = Math.max(0, level - 1);
            writeLevel(slug, level);
            renderLevel();

            if (count !== null) {
                count = Math.max(0, count - 1);
                renderCount();
            }
        }

        button.addEventListener("click", () => {
            if (level >= MAX_LIKES) {
                return;
            }

            level += 1;
            writeLevel(slug, level);
            renderLevel();
            pop();

            if (!remote) {
                return;
            }

            if (count !== null) {
                count += 1;
                renderCount();
            }

            queue = queue.then(() => sendLike().catch(rollBack));
        });

        // A stored level fills in on load with the same transition, which reads
        // as a small reveal and cannot get stranded the way rAF can.
        renderLevel();

        if (remote) {
            fetchCount();
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const root = document.querySelector(ROOT_SELECTOR);
        if (root) {
            setupWidget(root);
        }
    });
})();
