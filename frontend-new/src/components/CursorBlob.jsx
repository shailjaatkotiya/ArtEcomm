import React, { useEffect, useRef } from 'react';

// Fluid follow-cursor ported from the reference site: a small white blob that
// trails the pointer with easing + speed-stretch, and swells into an arrow when
// hovering anything interactive. Only mounts for fine pointers (desktop).
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label';

const CursorBlob = () => {
  const ref = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;

    const blob = ref.current;
    if (!blob) return;

    document.documentElement.classList.add('has-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;
    let locked = false; // true while hovering an interactive element
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onOver = (e) => {
      if (e.target.closest?.(INTERACTIVE)) {
        locked = true;
        blob.style.width = '44px';
        blob.style.height = '44px';
        blob.style.fontSize = '16px';
        blob.innerHTML = '→';
      }
    };

    const onOut = (e) => {
      if (e.target.closest?.(INTERACTIVE)) {
        locked = false;
        blob.style.width = '11px';
        blob.style.height = '11px';
        blob.style.fontSize = '0px';
        blob.innerHTML = '';
      }
    };

    const tick = () => {
      x += (mouseX - x) * 0.18;
      y += (mouseY - y) * 0.18;

      if (locked) {
        blob.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      } else {
        const dx = mouseX - x;
        const dy = mouseY - y;
        const speed = Math.sqrt(dx * dx + dy * dy);
        const stretch = Math.min(speed * 0.6, 18);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        blob.style.transform =
          `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}deg) ` +
          `scale(${1 + stretch / 60}, ${1 - stretch / 150})`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return <div ref={ref} className="cursor-blob" aria-hidden="true" />;
};

export default CursorBlob;
