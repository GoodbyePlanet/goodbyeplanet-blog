/* Expandable sections */
(function () {
  function toggle (button, target) {
    var expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    target.hidden = !target.hidden;
  }

  var expanders = document.querySelectorAll('[data-expands]');

  Array.prototype.forEach.call(expanders, function (expander) {
    var target = document.getElementById(expander.getAttribute('data-expands'));

    expander.addEventListener('click', function () {
      toggle(expander, target);
    })
  })
}());

/* Menu button */
(function () {
  var button = document.getElementById('menu-button');
  if (button) {
    var menu = document.getElementById('patterns-list');
    button.addEventListener('click', function() {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
    })
  }
}());

/* Persist navigation scroll point */
(function () {
  window.onbeforeunload = function () {
    var patternsNav = document.getElementById('patterns-nav');
    if (patternsNav) {
      var scrollPoint = patternsNav.scrollTop;
      localStorage.setItem('scrollPoint', scrollPoint);
    }
  }

  window.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('patterns-nav')) {
      if (window.location.href.indexOf('patterns/') !== -1) {
        document.getElementById('patterns-nav').scrollTop = parseInt(localStorage.getItem('scrollPoint'));
      } else {
        document.getElementById('patterns-nav').scrollTop = 0;
      }
    }
  })
}());

{{ if not .Site.Params.hideHeaderLinks }}
  /* Add "link here" links to <h2> headings */
  (function () {
    var headings = document.querySelectorAll('h2, h3, h4, h5, h6');

    Array.prototype.forEach.call(headings, function (heading) {
      var id = heading.getAttribute('id');

      if (id) {
        var newHeading = heading.cloneNode(true);
        newHeading.setAttribute('tabindex', '-1');

        var container = document.createElement('div');
        container.setAttribute('class', 'h2-container');
        container.appendChild(newHeading);

        heading.parentNode.insertBefore(container, heading);

        var link = document.createElement('a');
        link.setAttribute('href', '#' + id);
        link.innerHTML = '<svg aria-hidden="true" class="link-icon" viewBox="0 0 50 50" focusable="false"><use href="#rocket"></use></svg>';
        container.appendChild(link);

        heading.parentNode.removeChild(heading);
      }
    })
  }());
{{ end }}

/* Enable scrolling by keyboard of code samples */
(function () {
  var codeBlocks = document.querySelectorAll('pre, .code-annotated');

  Array.prototype.forEach.call(codeBlocks, function (block) {
    if (block.querySelector('code')) {
      block.setAttribute('role', 'region');
      block.setAttribute('aria-label', 'code sample');
      if (block.scrollWidth > block.clientWidth) {
        block.setAttribute('tabindex', '0');
      }
    }
  });
}());

/* Switch and persist theme */
(function() {
  var checkbox = document.getElementById('themer');

  function persistTheme(val) {
      localStorage.setItem('darkTheme', val);
  }

  function applyDarkTheme() {
      var darkTheme = document.getElementById('darkTheme');
      darkTheme.disabled = false;
  }

  function clearDarkTheme() {
      var darkTheme = document.getElementById('darkTheme');
      darkTheme.disabled = true;
  }

  function setDocumentThemeAttr() {
      // Keep a single source of truth the rocket (and anything else) can read.
      var isDark = localStorage.getItem('darkTheme') === 'true';
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  function updateThemeIcon() {
      var iconHost = document.getElementById('theme-icon');
      if (!iconHost) return;

      var isDark = localStorage.getItem('darkTheme') === 'true';

      var sunSvg =
            '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">' +
            '<circle cx="12" cy="12" r="4.25" stroke="currentColor" stroke-width="1.8"/>' +
            '<path d="M12 2.2v2.2M12 19.6v2.2M2.2 12h2.2M19.6 12h2.2M4.3 4.3l1.6 1.6M18.1 18.1l1.6 1.6M19.7 4.3l-1.6 1.6M5.9 18.1l-1.6 1.6"' +
            ' stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
            '</svg>';

      var moonSvg =
            '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">' +
            '<path d="M21 14.5c-1.2.6-2.6 1-4.1 1-4.7 0-8.4-3.8-8.4-8.4 0-1.5.4-2.9 1-4.1C5.7 4.1 3 7.3 3 11.2 3 16.6 7.4 21 12.8 21c3.9 0 7.1-2.7 8.2-6.5Z"' +
            ' stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
            '</svg>';

      iconHost.innerHTML = isDark ? moonSvg : sunSvg;

      var label = iconHost.closest('label');
      if (label) label.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  }

  function defaultDarkTheme() {
      {{- with .Site.Params.defaultDarkTheme }}
      if (localStorage.getItem('darkTheme') == null) {
          persistTheme('true');
          checkbox.checked = true;
      }
      {{- else }}
      if (localStorage.getItem('darkTheme') == null) {
          persistTheme('false');
          checkbox.checked = false;
      }
      {{ end }}
  }

  checkbox.addEventListener('change', function() {
      defaultDarkTheme();
      if (this.checked) {
          applyDarkTheme();
          persistTheme('true');
      } else {
          clearDarkTheme();
          persistTheme('false');
      }
      setDocumentThemeAttr();
      updateThemeIcon();
  });

  function showTheme() {
    if (localStorage.getItem('darkTheme') === 'true') {
        applyDarkTheme();
        checkbox.checked = true;
    } else {
        clearDarkTheme();
        checkbox.checked = false;
    }
    setDocumentThemeAttr();
    updateThemeIcon();
  }

  function showContent() {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = 1;
  }

  window.addEventListener('DOMContentLoaded', function () {
    defaultDarkTheme();
    showTheme();
    showContent();
  });
}());
