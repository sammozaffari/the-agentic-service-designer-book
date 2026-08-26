document.addEventListener('DOMContentLoaded', () => {
  // 1. Detect environment and resolve paths dynamically
  const path = window.location.pathname;
  const isChapter = path.includes('/chapters/');
  const prefix = isChapter ? '../' : './';
  const filename = path.split('/').pop() || 'index.html';

  // Path resolver helper
  const resolveLink = (target) => {
    if (isChapter) {
      if (target.startsWith('chapters/')) {
        return target.substring(9); // remove 'chapters/'
      }
      return '../' + target;
    } else {
      return './' + target;
    }
  };

  // Inject Custom Styles for Morphing Animation and Accordions
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    #menu-drawer {
      position: fixed;
      top: 0;
      z-index: 55; /* above header z-index of 50 */
      background-color: #FBBF24;
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-right: 1px solid #000;
      border-bottom: 1px solid #000;
      box-shadow: none;
      cursor: pointer; /* cursor for click on whole button when closed */
    }
    #menu-drawer:not(.drawer-open):hover {
      background-color: #F59E0B;
    }
    #menu-drawer:not(.drawer-open) * {
      cursor: pointer !important;
      user-select: none;
    }
    #logo-link {
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    #logo-link.logo-pushed {
      transform: translateX(-100%) !important;
      transition-delay: 0.22s !important;
      pointer-events: none !important;
    }
    #menu-drawer.drawer-open {
      top: 0 !important;
      height: 100vh !important;
      z-index: 100 !important; /* above backdrop */
      background-image: url('${prefix}assets/gradients/gradient_menu_yellow.png') !important;
      background-size: cover !important;
      background-position: center !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      border-bottom: none !important;
      cursor: default; /* standard cursor inside open menu */
      animation: expandDownLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes expandDownLeft {
      0% {
        clip-path: polygon(100% 0, 100% 0, 100% 0, 100% 0);
      }
      100% {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      }
    }
    @media (max-width: 640px) {
      #menu-drawer.drawer-open {
        width: 100% !important;
        left: 0 !important;
      }
    }
    #drawer-icon-btn {
      border: none !important;
      outline: none !important;
      background: transparent !important;
      box-shadow: none !important;
      cursor: pointer !important;
    }
    #drawer-icon-btn:hover, #drawer-icon-btn:focus, #drawer-icon-btn:active {
      border: none !important;
      outline: none !important;
      background: transparent !important;
      box-shadow: none !important;
    }
    #drawer-btn-text {
      transition: opacity 0.3s ease-in-out;
    }
    #menu-drawer.drawer-open #drawer-btn-text {
      opacity: 0 !important;
      pointer-events: none !important;
    }
    #drawer-title-text {
      transition: opacity 0.3s ease-in-out;
      opacity: 0;
    }
    #menu-drawer.drawer-open #drawer-title-text {
      opacity: 1 !important;
    }
    #drawer-toggle-icon {
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease-in-out;
    }
    #menu-drawer.drawer-open #drawer-toggle-icon {
      transform: rotate(405deg); /* 360 + 45 deg to morph + to x */
    }
    
    /* Avoid Tailwind !important conflicts by handling opacity/pointer-events in custom CSS */
    #drawer-body {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease-in-out;
      transition-delay: 0s;
    }
    #menu-drawer.drawer-open #drawer-body {
      opacity: 1 !important;
      pointer-events: auto !important;
      transition-delay: 0.2s; /* wait for panel to expand */
    }
    
    #drawer-footer {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease-in-out;
      transition-delay: 0s;
    }
    #menu-drawer.drawer-open #drawer-footer {
      opacity: 1 !important;
      pointer-events: auto !important;
      transition-delay: 0.2s;
    }
    
    /* Accordion Button sliding hover effect */
    .menu-part-btn {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 20px 24px;
      color: #000;
      text-decoration: none;
      z-index: 10;
      border-bottom: 1px solid #000;
      background: transparent;
      cursor: pointer;
    }
    .menu-part-btn .bg-slide {
      position: absolute;
      inset: 0;
      display: flex;
      width: 200%;
      height: 100%;
      z-index: 0;
      transition: transform 0.4s cubic-bezier(0.44, 0, 0.56, 1);
      pointer-events: none;
    }
    .menu-part-btn .bg-slide-primary {
      width: 50%;
      height: 100%;
      background-color: #000;
    }
    .menu-part-btn .bg-slide-secondary {
      width: 50%;
      height: 100%;
      background-color: transparent;
    }
    .menu-part-btn:hover .bg-slide {
      transform: translateX(-50%);
    }
    .menu-part-btn .nav-text-wrapper {
      position: relative;
      z-index: 1;
      overflow: hidden;
      height: 1.4em;
      line-height: 1.4;
      display: flex;
      flex-direction: column;
      pointer-events: none;
    }
    .menu-part-btn .nav-text {
      display: inline-block;
      transition: transform 0.4s cubic-bezier(0.44, 0, 0.56, 1);
      color: #000;
    }
    .menu-part-btn .nav-text-clone {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      transition: transform 0.4s cubic-bezier(0.44, 0, 0.56, 1);
      color: #fff;
    }
    .menu-part-btn:hover .nav-text {
      transform: translateY(-100%);
    }
    .menu-part-btn:hover .nav-text-clone {
      transform: translateY(-100%);
    }
    .menu-part-btn .menu-part-icon {
      position: relative;
      z-index: 1;
      transition: color 0.4s cubic-bezier(0.44, 0, 0.56, 1);
      color: #000;
    }
    .menu-part-btn:hover .menu-part-icon {
      color: #fff;
    }
  `;
  document.head.appendChild(styleEl);

  // 2. Define the parts mapping to pre-expand the active section
  let activePartIndex = 0; 
  if (['preface.html', 'copyright.html', '01.html', '02.html', '03.html', '04.html'].includes(filename)) {
    activePartIndex = 1;
  } else if (['05.html', '06.html', '07.html', '08.html'].includes(filename)) {
    activePartIndex = 2;
  } else if (['09.html', '10.html', '11.html', '12.html'].includes(filename)) {
    activePartIndex = 3;
  } else if (['13.html', '14.html'].includes(filename)) {
    activePartIndex = 4;
  } else if (['A.html', 'B.html', 'C.html'].includes(filename)) {
    activePartIndex = 5;
  }

  // Helper to generate active classes
  const isLinkActive = (file) => filename === file;
  const getLinkClass = (file) => {
    return isLinkActive(file)
      ? 'flex items-center gap-2 py-1.5 text-black font-bold border-l-2 border-black pl-2'
      : 'flex items-center gap-2 py-1.5 text-black/70 hover:text-black hover:underline transition-colors pl-2';
  };

  // 3. Construct drawer HTML
  const drawerHTML = `
    <!-- Backdrop Overlay -->
    <div id="menu-drawer-backdrop" class="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-500"></div>

    <!-- Drawer Panel serving as the button and the expanded menu -->
    <div id="menu-drawer">
      
      <!-- Drawer Header (centered aligned items) -->
      <div class="flex h-14 w-full items-center justify-between px-3 sm:px-6 shrink-0 relative border-b border-transparent transition-colors duration-500 select-none">
        <!-- "Read the Book" text (fades out when open) -->
        <span id="drawer-btn-text" class="font-mono text-xs sm:text-sm font-medium text-black">
          <span class="hidden sm:inline">Read the Book</span>
          <span class="inline sm:hidden">Book</span>
        </span>
        
        <!-- "Book Chapters" text (fades in when open) -->
        <span id="drawer-title-text" class="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-black/60 font-bold absolute left-3 sm:left-6" style="font-family: 'Beausite Classic Medium', sans-serif">
          Book Chapters
        </span>

        <!-- The rotating icon (+ to x), styling close button without hover borders/backgrounds, making it bigger -->
        <button id="drawer-icon-btn" class="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center size-10 sm:size-12 cursor-pointer rounded-none border border-transparent bg-transparent" aria-label="Toggle menu">
          <i data-lucide="plus" id="drawer-toggle-icon" class="w-6 h-6 sm:w-8 sm:h-8 text-black transition-transform"></i>
        </button>
      </div>

      <!-- Drawer Content (Scrollable, transparent to see gradient) -->
      <div id="drawer-body" class="flex-1 overflow-y-auto select-none bg-transparent">
        
        <!-- Quick Nav (Home / About) -->
        <div class="flex border-b border-black divide-x divide-black bg-white/30 backdrop-blur-sm">
          <a href="${resolveLink('index.html')}" class="flex-1 text-center py-3 font-mono text-xs uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors duration-200 ${filename === 'index.html' ? 'font-bold bg-white/40' : ''}">
            Home
          </a>
          <a href="${resolveLink('about.html')}" class="flex-1 text-center py-3 font-mono text-xs uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors duration-200 ${filename === 'about.html' ? 'font-bold bg-white/40' : ''}">
            About
          </a>
        </div>

        <div class="flex flex-col divide-y divide-black bg-transparent">
          
          <!-- PART 1: Foundations -->
          <div class="menu-part-section border-b border-black" data-part="1">
            <button class="menu-part-btn">
              <span class="bg-slide">
                <span class="bg-slide-secondary"></span>
                <span class="bg-slide-primary"></span>
              </span>
              <span class="nav-text-wrapper text-2xl sm:text-3xl font-bold tracking-tight">
                <span class="nav-text">Foundations <sup class="font-mono text-xs text-black/40">01</sup></span>
                <span class="nav-text-clone">Foundations <sup class="font-mono text-xs text-white/60">01</sup></span>
              </span>
              <i data-lucide="plus" class="menu-part-icon size-5"></i>
            </button>
            <div class="menu-part-content hidden bg-white/25 px-6 py-4 flex flex-col gap-2 font-mono text-xs">
              <a href="${resolveLink('chapters/preface.html')}" class="${getLinkClass('preface.html')}">Preface</a>
              <a href="${resolveLink('chapters/copyright.html')}" class="${getLinkClass('copyright.html')}">Copyright & License</a>
              <a href="${resolveLink('chapters/01.html')}" class="${getLinkClass('01.html')}">Ch 01: The Agentic Design Paradigm</a>
              <a href="${resolveLink('chapters/02.html')}" class="${getLinkClass('02.html')}">Ch 02: Your Agent Toolkit</a>
              <a href="${resolveLink('chapters/03.html')}" class="${getLinkClass('03.html')}">Ch 03: Teaching Agents to Design</a>
              <a href="${resolveLink('chapters/04.html')}" class="${getLinkClass('04.html')}">Ch 04: Design-as-Code</a>
            </div>
          </div>

          <!-- PART 2: Connected Canvas -->
          <div class="menu-part-section border-b border-black" data-part="2">
            <button class="menu-part-btn">
              <span class="bg-slide">
                <span class="bg-slide-secondary"></span>
                <span class="bg-slide-primary"></span>
              </span>
              <span class="nav-text-wrapper text-2xl sm:text-3xl font-bold tracking-tight">
                <span class="nav-text">Canvas Tools <sup class="font-mono text-xs text-black/40">02</sup></span>
                <span class="nav-text-clone">Canvas Tools <sup class="font-mono text-xs text-white/60">02</sup></span>
              </span>
              <i data-lucide="plus" class="menu-part-icon size-5"></i>
            </button>
            <div class="menu-part-content hidden bg-white/25 px-6 py-4 flex flex-col gap-2 font-mono text-xs">
              <a href="${resolveLink('chapters/05.html')}" class="${getLinkClass('05.html')}">Ch 05: Paper and Pencil</a>
              <a href="${resolveLink('chapters/06.html')}" class="${getLinkClass('06.html')}">Ch 06: Open Design and OpenPencil</a>
              <a href="${resolveLink('chapters/07.html')}" class="${getLinkClass('07.html')}">Ch 07: Huashu Design</a>
              <a href="${resolveLink('chapters/08.html')}" class="${getLinkClass('08.html')}">Ch 08: Design Systems and Tokens</a>
            </div>
          </div>

          <!-- PART 3: Advanced Topics -->
          <div class="menu-part-section border-b border-black" data-part="3">
            <button class="menu-part-btn">
              <span class="bg-slide">
                <span class="bg-slide-secondary"></span>
                <span class="bg-slide-primary"></span>
              </span>
              <span class="nav-text-wrapper text-2xl sm:text-3xl font-bold tracking-tight">
                <span class="nav-text">Advanced Topics <sup class="font-mono text-xs text-black/40">03</sup></span>
                <span class="nav-text-clone">Advanced Topics <sup class="font-mono text-xs text-white/60">03</sup></span>
              </span>
              <i data-lucide="plus" class="menu-part-icon size-5"></i>
            </button>
            <div class="menu-part-content hidden bg-white/25 px-6 py-4 flex flex-col gap-2 font-mono text-xs">
              <a href="${resolveLink('chapters/09.html')}" class="${getLinkClass('09.html')}">Ch 09: Motion and Video</a>
              <a href="${resolveLink('chapters/10.html')}" class="${getLinkClass('10.html')}">Ch 10: MCP Integrations</a>
              <a href="${resolveLink('chapters/11.html')}" class="${getLinkClass('11.html')}">Ch 11: Multi-Agent Design Teams</a>
              <a href="${resolveLink('chapters/12.html')}" class="${getLinkClass('12.html')}">Ch 12: Production UI from Design</a>
            </div>
          </div>

          <!-- PART 4: Practice & Outlook -->
          <div class="menu-part-section border-b border-black" data-part="4">
            <button class="menu-part-btn">
              <span class="bg-slide">
                <span class="bg-slide-secondary"></span>
                <span class="bg-slide-primary"></span>
              </span>
              <span class="nav-text-wrapper text-2xl sm:text-3xl font-bold tracking-tight">
                <span class="nav-text">Practice & Outlook <sup class="font-mono text-xs text-black/40">04</sup></span>
                <span class="nav-text-clone">Practice & Outlook <sup class="font-mono text-xs text-white/60">04</sup></span>
              </span>
              <i data-lucide="plus" class="menu-part-icon size-5"></i>
            </button>
            <div class="menu-part-content hidden bg-white/25 px-6 py-4 flex flex-col gap-2 font-mono text-xs">
              <a href="${resolveLink('chapters/13.html')}" class="${getLinkClass('13.html')}">Ch 13: Real-World Case Studies</a>
              <a href="${resolveLink('chapters/14.html')}" class="${getLinkClass('14.html')}">Ch 14: The Future of Agentic Design</a>
            </div>
          </div>

          <!-- PART 5: Appendices -->
          <div class="menu-part-section border-b border-black" data-part="5">
            <button class="menu-part-btn">
              <span class="bg-slide">
                <span class="bg-slide-secondary"></span>
                <span class="bg-slide-primary"></span>
              </span>
              <span class="nav-text-wrapper text-2xl sm:text-3xl font-bold tracking-tight">
                <span class="nav-text">Appendices <sup class="font-mono text-xs text-black/40">05</sup></span>
                <span class="nav-text-clone">Appendices <sup class="font-mono text-xs text-white/60">05</sup></span>
              </span>
              <i data-lucide="plus" class="menu-part-icon size-5"></i>
            </button>
            <div class="menu-part-content hidden bg-white/25 px-6 py-4 flex flex-col gap-2 font-mono text-xs">
              <a href="${resolveLink('chapters/A.html')}" class="${getLinkClass('A.html')}">Appendix A: Tool Comparison Matrix</a>
              <a href="${resolveLink('chapters/B.html')}" class="${getLinkClass('B.html')}">Appendix B: MCP Server Reference</a>
              <a href="${resolveLink('chapters/C.html')}" class="${getLinkClass('C.html')}">Appendix C: Prompt Library</a>
            </div>
          </div>

        </div>
      </div>

      <!-- Drawer Footer (glassmorphic) -->
      <div id="drawer-footer" class="border-t border-black p-6 bg-white/40 backdrop-blur-md shrink-0">
        <p class="font-mono text-[9px] uppercase tracking-wider text-black/50 leading-relaxed">&copy; 2026 MEHRAN MOZAFFARI. ALL RIGHTS RESERVED.</p>
      </div>

    </div>
  `;

  // Inject drawer into DOM
  document.body.insertAdjacentHTML('afterbegin', drawerHTML);

  // 4. Position and toggle logic
  const logoLink = document.getElementById('logo-link');
  const placeholder = document.getElementById('menu-placeholder');
  const drawer = document.getElementById('menu-drawer');
  const backdrop = document.getElementById('menu-drawer-backdrop');

  function updateClosedStyles() {
    if (drawer && !drawer.classList.contains('drawer-open')) {
      if (logoLink && placeholder) {
        drawer.style.left = logoLink.offsetLeft + logoLink.offsetWidth + 'px';
        drawer.style.width = placeholder.offsetWidth + 'px';
        drawer.style.height = '56px';
        drawer.style.top = '0px';
      } else {
        // Fallback
        drawer.style.left = '88px';
        drawer.style.width = '550px';
        drawer.style.height = '56px';
        drawer.style.top = '0px';
      }
    }
  }

  // Initialize position
  updateClosedStyles();
  window.addEventListener('resize', updateClosedStyles);

  function openDrawer() {
    drawer.classList.add('drawer-open');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100', 'pointer-events-auto');
    
    const logoW = logoLink ? logoLink.offsetWidth : 88;
    const placeholderW = placeholder ? placeholder.offsetWidth : 550;
    
    if (logoLink) {
      logoLink.classList.add('logo-pushed');
    }
    
    const isMobile = window.innerWidth <= 640;
    if (isMobile) {
      drawer.style.left = '0px';
      drawer.style.width = '100%';
    } else {
      drawer.style.left = '0px';
      drawer.style.width = (logoW + placeholderW) + 'px';
    }
    drawer.style.height = '100vh';
    drawer.style.top = '0px';
  }

  function closeDrawer() {
    drawer.classList.remove('drawer-open');
    backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    
    if (logoLink) {
      logoLink.classList.remove('logo-pushed');
    }
    
    // Restore closed position inline styles
    updateClosedStyles();
  }

  // Click handler for drawer button (closed) or close button (open)
  drawer.addEventListener('click', (e) => {
    const isOpen = drawer.classList.contains('drawer-open');
    if (!isOpen) {
      openDrawer();
    } else {
      const closeBtn = document.getElementById('drawer-icon-btn');
      if (closeBtn && (closeBtn === e.target || closeBtn.contains(e.target))) {
        e.stopPropagation();
        closeDrawer();
      }
    }
  });

  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Escape key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // 5. Accordion expand/collapse behavior
  const partSections = document.querySelectorAll('.menu-part-section');
  partSections.forEach((section) => {
    const btn = section.querySelector('.menu-part-btn');
    const content = section.querySelector('.menu-part-content');
    const icon = section.querySelector('.menu-part-icon');
    const partNum = parseInt(section.getAttribute('data-part'));

    function togglePart(expand) {
      const isHidden = content.classList.contains('hidden');
      const shouldExpand = expand !== undefined ? expand : isHidden;

      if (shouldExpand) {
        content.classList.remove('hidden');
        if (icon) icon.setAttribute('data-lucide', 'minus');
      } else {
        content.classList.add('hidden');
        if (icon) icon.setAttribute('data-lucide', 'plus');
      }
      // Re-render the icons for this section
      if (window.lucide) {
        window.lucide.createIcons({
          attrs: {
            class: 'menu-part-icon size-5 transition-transform duration-200'
          },
          nameAttr: 'data-lucide'
        });
      }
    }

    // Bind click inside accordion
    btn.addEventListener('click', (e) => {
      // Prevent click bubbling up and triggering drawer toggle
      e.stopPropagation();
      togglePart();
    });

    // Pre-expand if it matches the active part index
    if (partNum === activePartIndex) {
      togglePart(true);
    }
  });

  // Re-run lucide to render all newly added drawer icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
