    // ── NAVIGATION ──
    const btns = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    const body = document.body;
    const validChars = ['springfield', 'rudolf', 'vega', 'azusa'];

     // ── FUNGSI UTAMA PERPINDAHAN HALAMAN ──
    function switchPage(target, updateUrl = false) {
      // 1. Atur tombol navigasi yang aktif
      btns.forEach(b => {
        if (b.dataset.target === target) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      // 2. Sembunyikan halaman lain
      pages.forEach(p => {
        p.classList.remove('active');
        p.style.opacity = 0;
      });

      // 3. Update dataset di body
      body.dataset.char = target;

      // 4. Tampilkan halaman terpilih dengan animasi
      const page = document.getElementById('page-' + target);
      if (page) {
        page.classList.add('active');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            page.style.opacity = 1;
          });
        });
      }

      // 5. Scroll ke atas dan jalankan ulang animasi reveal
      window.scrollTo({ top: 0, behavior: 'instant' });
      initReveal();

      // 6. Update URL browser jika navigasi dipicu dari klik (agar URL ikut berubah)
      if (updateUrl) {
        const newUrl = `${window.location.pathname}?char=${target}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      }
    }

    // ── EVENT LISTENER NAVIGASI (KLIK) ──
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        switchPage(target, true); // true agar URL di browser ikut terupdate
      });
    });

    // ── FUNGSI MEMBACA PARAMETER URL ──
    function checkUrlParameter() {
      const urlParams = new URLSearchParams(window.location.search);
      const charParam = urlParams.get('char') ? urlParams.get('char').toLowerCase() : null;

      if (charParam && validChars.includes(charParam)) {
        switchPage(charParam, false); // false agar tidak membuat riwayat URL ganda
      } else {
        switchPage('springfield', false); // Default jika kosong/salah
      }
    }

    // Jalankan saat halaman pertama kali dibuka
    checkUrlParameter();

    // Jalankan setiap kali tombol BACK / FORWARD browser diklik
    window.addEventListener('popstate', () => {
      checkUrlParameter();
    });
    
    // ── SCROLL REVEAL ──
    function initReveal() {
      const reveals = document.querySelectorAll('.page.active .reveal');
      reveals.forEach(el => {
        el.classList.remove('visible');
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), 80);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      reveals.forEach(el => observer.observe(el));
    }

    initReveal();

    // ── STAT POP-IN ──
    const styleEl = document.createElement('style');
    styleEl.textContent = `@keyframes stat-pop { 0%{opacity:0;transform:translateY(8px) scale(0.95)} 100%{opacity:1;transform:translateY(0) scale(1)} }`;
    document.head.appendChild(styleEl);

    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'stat-pop 0.5s cubic-bezier(0.22,1,0.36,1) forwards';
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-val').forEach(el => statObserver.observe(el));

    // ── CURSOR LINE ──
    const line = document.getElementById('cursorLine');
    let lineX = 0, currentX = 0;
    document.addEventListener('mousemove', e => { lineX = e.clientX; line.style.opacity = '1'; });
    document.addEventListener('mouseleave', () => { line.style.opacity = '0'; });
    (function animateLine() {
      currentX += (lineX - currentX) * 0.08;
      line.style.transform = `translateX(${currentX}px)`;
      requestAnimationFrame(animateLine);
    })();