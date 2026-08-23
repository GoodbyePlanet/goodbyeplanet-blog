/*
  Read-only like counts on the post list. Every card carries its slug, the grid
  carries the Supabase config (see layouts/_default/list.html), and all the
  counts are filled from a single request:

      GET /rest/v1/post_likes?slug=in.(a,b,...)&select=slug,likes

  Rows only exist once a post has been liked, so a slug that comes back missing
  has no count and its card is left exactly as it rendered. Nothing here writes,
  clicks or touches localStorage — that is the post page's widget, in
  assets/js/post-likes.js.
*/
(() => {
    "use strict";

    const GRID_SELECTOR = ".posts-grid[data-likes-url]";
    const CARD_SELECTOR = "[data-likes-slug]";
    const TABLE_FALLBACK = "post_likes";

    function render(node, likes) {
        const count = node.querySelector(".post-card__likes-count");
        if (!count || !(likes > 0)) {
            return;
        }

        count.textContent = String(likes);
        // Labelled on the wrapper so the heart and the number read as one
        // thing, and not as a control inside the card's link.
        count.setAttribute("aria-hidden", "true");
        node.setAttribute("role", "img");
        node.setAttribute("aria-label", likes + (likes === 1 ? " like" : " likes"));
        node.classList.add("is-loaded");
    }

    function fill(grid) {
        const url = grid.dataset.likesUrl;
        const key = grid.dataset.likesKey;
        const table = grid.dataset.likesTable || TABLE_FALLBACK;

        if (!url || !key) {
            return;
        }

        const nodes = new Map();
        grid.querySelectorAll(CARD_SELECTOR).forEach((node) => {
            const slug = node.dataset.likesSlug;
            if (slug) {
                nodes.set(slug, node);
            }
        });

        if (!nodes.size) {
            return;
        }

        // PostgREST's in.() takes a bare comma-separated list; the whole list
        // is one query parameter, so it is encoded as a single value.
        const list = Array.from(nodes.keys()).join(",");
        const query =
            url + "/rest/v1/" + table + "?slug=in.(" + encodeURIComponent(list) + ")&select=slug,likes";

        fetch(query, { headers: { apikey: key, Authorization: "Bearer " + key } })
            .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
            .then((rows) => {
                (rows || []).forEach((row) => {
                    const node = nodes.get(row.slug);
                    if (node) {
                        render(node, row.likes);
                    }
                });
            })
            .catch(() => {
                /* best effort: the cards keep their blank space */
            });
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(GRID_SELECTOR).forEach(fill);
    });
})();
