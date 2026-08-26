(function () {
  function setSectionNavHeight() {
    var sectionNav = document.querySelector('nav.sticky.top-14');
    if (!sectionNav) return;
    document.documentElement.style.setProperty(
      '--section-nav-height',
      sectionNav.offsetHeight + 'px'
    );
  }

  function getScrollOffset() {
    var sectionNav = document.querySelector('nav.sticky.top-14');
    var headerHeight = 56;
    var sectionNavHeight = sectionNav ? sectionNav.offsetHeight : 44;
    return headerHeight + sectionNavHeight + 24;
  }

  function updateSidebarRail() {
    var rail = document.getElementById('chapter-sidebar-rail');
    var navWrap = document.getElementById('chapter-sidebar-nav-wrap');
    var body = document.getElementById('chapter-body');
    if (!rail || !navWrap || !body) return;

    if (window.innerWidth < 768) {
      navWrap.style.transform = '';
      return;
    }

    var topOffset = parseFloat(getComputedStyle(navWrap).top) || 104;
    var bodyRect = body.getBoundingClientRect();
    var navHeight = navWrap.offsetHeight;
    var y = 0;

    if (bodyRect.top > topOffset) {
      y = bodyRect.top - topOffset;
    }

    var navBottom = topOffset + y + navHeight;
    if (bodyRect.bottom < navBottom) {
      y += bodyRect.bottom - navBottom;
    }

    navWrap.style.transform = y ? 'translateY(' + y + 'px)' : '';
  }

  function updateActiveLink() {
    var sectionLinks = document.querySelectorAll('.sidebar-link[data-section]');
    if (!sectionLinks.length) return;

    var sections = [];
    var seen = {};

    sectionLinks.forEach(function (link) {
      var id = link.getAttribute('data-section');
      if (!id || seen[id]) return;
      var el = document.getElementById(id);
      if (!el) return;
      seen[id] = true;
      sections.push({ id: id, el: el });
    });

    if (!sections.length) return;

    var offset = getScrollOffset();
    var current = sections[0];

    for (var i = 0; i < sections.length; i++) {
      if (sections[i].el.getBoundingClientRect().top <= offset) {
        current = sections[i];
      }
    }

    sectionLinks.forEach(function (link) {
      link.classList.remove('active', 'text-black', 'font-semibold');
      link.classList.add('text-black/35');
    });

    document.querySelectorAll('.sidebar-link[data-section="' + current.id + '"]').forEach(function (link) {
      link.classList.remove('text-black/35');
      link.classList.add('active', 'text-black', 'font-semibold');
    });
  }

  function onScroll() {
    updateSidebarRail();
    updateActiveLink();
  }

  function initSidebarRail() {
    setSectionNavHeight();
    updateSidebarRail();
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', initSidebarRail, { passive: true });
  window.addEventListener('load', initSidebarRail);
  initSidebarRail();
})();
