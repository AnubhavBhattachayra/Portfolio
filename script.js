/* ============================================================
   PORTFOLIO SCRIPT – Anubhav Bhattacharya
   ============================================================ */

/* ── 1. PARTICLE CANVAS ─────────────────────────────────── */
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let W, H, particles = [], animId;

    const cfg = {
        count: 80,
        speed: 0.3,
        radius: 1.4,
        color: 'rgba(247, 96, 30, ALPHA)',
        lineColor: 'rgba(247, 96, 30, ALPHA)',
        connectDist: 140,
    };

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H : Math.random() * H;
            this.vx = (Math.random() - 0.5) * cfg.speed;
            this.vy = (Math.random() - 0.5) * cfg.speed;
            this.r = Math.random() * cfg.radius + 0.5;
            this.alpha = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = cfg.color.replace('ALPHA', this.alpha);
            ctx.fill();
        }
    }

    function build() {
        particles = Array.from({ length: cfg.count }, () => new Particle());
    }

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < cfg.connectDist) {
                    const alpha = (1 - dist / cfg.connectDist) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = cfg.lineColor.replace('ALPHA', alpha);
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        connect();
        animId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => { resize(); });
    resize();
    build();
    loop();
})();


/* ── 2. NAVBAR SCROLL ───────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
});

// close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
    });
});

// smooth active link highlight
const sections = document.querySelectorAll('section[id]');
const allLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    allLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
}, { passive: true });


/* ── 3. TYPEWRITER EFFECT ───────────────────────────────── */
(function typewriter() {
    const el = document.getElementById('typewriter');
    const phrases = [
        'Building multilingual AI systems',
        'Researching LLMs for Indian languages',
        'Designing GAN-based medical pipelines',
        'Crafting agentic NLP workflows',
        'ML Engineer · Researcher · Builder',
    ];
    let pIdx = 0, cIdx = 0, deleting = false;
    const SPEED_TYPE = 55, SPEED_DEL = 30, PAUSE = 1800;

    function tick() {
        const phrase = phrases[pIdx];
        if (!deleting) {
            el.textContent = phrase.slice(0, ++cIdx);
            if (cIdx === phrase.length) {
                deleting = true;
                setTimeout(tick, PAUSE);
                return;
            }
        } else {
            el.textContent = phrase.slice(0, --cIdx);
            if (cIdx === 0) {
                deleting = false;
                pIdx = (pIdx + 1) % phrases.length;
            }
        }
        setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
    }
    tick();
})();


/* ── 4. SCROLL REVEAL ───────────────────────────────────── */
(function scrollReveal() {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // stagger siblings
                const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
                const idx = siblings.indexOf(entry.target);
                const delay = Math.min(idx * 70, 280);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
    });

    elements.forEach(el => observer.observe(el));
})();


/* ── 5. ACTIVE NAV STYLES ───────────────────────────────── */
(function injectActiveStyle() {
    const style = document.createElement('style');
    style.textContent = `
    .nav-link.active { color: var(--accent) !important; }
    .nav-link.active::after { width: 100%; }
    .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 6px); }
    .hamburger.active span:nth-child(2) { opacity: 0; }
    .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -6px); }
  `;
    document.head.appendChild(style);
})();


/* ── 6. SMOOTH HOVER TILT ON CARDS ─────────────────────── */
(function tiltEffect() {
    const cards = document.querySelectorAll('.project-card, .research-card, .ach-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const tiltX = ((y - cy) / cy) * 4;
            const tiltY = ((cx - x) / cx) * 4;
            card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();
