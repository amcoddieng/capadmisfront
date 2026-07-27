import { useEffect } from 'react';

export default function useAdvancedScroll() {
  useEffect(() => {
    // ── 1. Scroll progress bar ──
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${pct}%`;
    };

    // ── 2. Parallax elements ──
    const parallaxEls = document.querySelectorAll('[data-parallax]');

    const onScroll = () => {
      updateProgress();
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
          const offset = (rect.top - windowHeight / 2) * speed * -1;
          el.style.transform = `translateY(${offset}px)`;
        }
      });
    };

    // ── 3. Reveal animations ──
    const revealEls = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));

    // ── 4. Count-up triggers ──
    const countEls = document.querySelectorAll('[data-countup]');
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.dataset.countup);
            const suffix = el.dataset.suffix || '';
            const duration = 1800;
            const startTime = performance.now();

            const tick = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = target * eased;

              let display;
              if (target >= 1000) {
                display = Math.floor(current).toLocaleString('fr-FR');
              } else if (target % 1 !== 0) {
                display = current.toFixed(1);
              } else {
                display = Math.floor(current).toString();
              }
              el.textContent = display + suffix;

              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                el.textContent = (target >= 1000 ? target.toLocaleString('fr-FR') : target) + suffix;
              }
            };
            requestAnimationFrame(tick);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    countEls.forEach((el) => countObserver.observe(el));

    // ── 5. 3D Tilt cards ──
    const tiltEls = document.querySelectorAll('[data-tilt]');
    const tiltHandlers = [];

    tiltEls.forEach((el) => {
      const handleMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      };
      const handleLeave = () => {
        el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      };
      el.addEventListener('mousemove', handleMove);
      el.addEventListener('mouseleave', handleLeave);
      tiltHandlers.push({ el, handleMove, handleLeave });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
      countObserver.disconnect();
      tiltHandlers.forEach(({ el, handleMove, handleLeave }) => {
        el.removeEventListener('mousemove', handleMove);
        el.removeEventListener('mouseleave', handleLeave);
      });
      progressBar.remove();
    };
  }, []);
}
