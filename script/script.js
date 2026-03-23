let pct = 0;
    const pe = document.getElementById('ldpct');
    const lt = setInterval(() => {
      pct = Math.min(pct + Math.random() * 16, 100);
      pe.textContent = Math.floor(pct) + '%';
      if (pct >= 100) {
        clearInterval(lt);
        setTimeout(() => {
          document.getElementById('loader').classList.add('out');
          triggerHero();
        }, 250);
      }
    }, 90);

    function triggerHero() {
      document.querySelectorAll('.rl').forEach(el => {
        setTimeout(() => el.classList.add('vis'), parseInt(el.dataset.d || 0));
      });
      document.querySelectorAll('.sr').forEach(el => el.classList.add('vis'));
      startCU();
    }
    const cur = document.getElementById('cur'),
      cr = document.getElementById('cur-r');
    let rx = 0,
      ry = 0,
      mx = 0,
      my = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top = my + 'px';
    });
    (function a() {
      rx += (mx - rx) * .12;
      ry += (my - ry) * .12;
      cr.style.left = rx + 'px';
      cr.style.top = ry + 'px';
      requestAnimationFrame(a);
    })();
    const cv = document.getElementById('ptc'),
      ctx = cv.getContext('2d');
    let W, H, pts = [];

    function resize() {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 70; i++) pts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.4 + .3,
      o: Math.random() * .45 + .08
    });
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,135,${p.o})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,255,135,${.07*(1-d/110)})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      requestAnimationFrame(draw);
    })();
    window.addEventListener('scroll', () => document.getElementById('nav').classList.toggle('sc', scrollY > 50));
    const obs = new IntersectionObserver(en => en.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        obs.unobserve(e.target);
      }
    }), {
      threshold: .1
    });
    document.querySelectorAll('.sr').forEach(el => obs.observe(el));

    function startCU() {
      document.querySelectorAll('.cu').forEach(el => {
        const to = parseFloat(el.dataset.to),
          dec = parseInt(el.dataset.dec || 0),
          dur = 1800,
          s = performance.now();
        (function step(now) {
          const t = Math.min((now - s) / dur, 1),
            e = 1 - Math.pow(1 - t, 4);
          el.textContent = (to * e).toFixed(dec);
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = to.toFixed(dec);
        })(performance.now());
      });
    }
    const cobs = new IntersectionObserver(en => {
      if (en[0].isIntersecting) {
        startCU();
        cobs.disconnect();
      }
    }, {
      threshold: .3
    });
    const hst = document.querySelector('.hero-stats');
    if (hst) cobs.observe(hst);
    document.querySelectorAll('.mbtn').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform =
          `translate(${(e.clientX-(r.left+r.width/2))*.22}px,${(e.clientY-(r.top+r.height/2))*.22}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
        setTimeout(() => el.style.transition = '', 500);
      });
    });
    document.querySelectorAll('.sk-card').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) {
          e.preventDefault();
          t.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });