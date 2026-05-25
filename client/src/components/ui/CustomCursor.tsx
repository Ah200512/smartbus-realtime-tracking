import { useEffect, useState, useCallback, useRef } from 'react';

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);

  const posRef = useRef({ x: -100, y: -100 });
  const outerRef = useRef({ x: -100, y: -100 });
  const innerElRef = useRef<HTMLDivElement>(null);
  const outerElRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const trackedElements = useRef(new WeakSet<Element>());

  // Check for mobile / reduced motion (reactive to resize)
  const [disabled, setDisabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return (
      'ontouchstart' in window ||
      window.innerWidth < 768 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDisabled = () => {
      setDisabled(
        'ontouchstart' in window ||
        window.innerWidth < 768 ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };

    window.addEventListener('resize', checkDisabled);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', checkDisabled);

    return () => {
      window.removeEventListener('resize', checkDisabled);
      mq.removeEventListener('change', checkDisabled);
    };
  }, []);

  const animate = useCallback(() => {
    const lerp = 0.15;
    outerRef.current.x += (posRef.current.x - outerRef.current.x) * lerp;
    outerRef.current.y += (posRef.current.y - outerRef.current.y) * lerp;

    // Direct DOM updates (no re-renders)
    if (innerElRef.current) {
      innerElRef.current.style.left = `${posRef.current.x - 4}px`;
      innerElRef.current.style.top = `${posRef.current.y - 4}px`;
    }
    if (outerElRef.current) {
      const size = outerElRef.current.dataset.hovering === 'true' ? 24 : 18;
      outerElRef.current.style.left = `${outerRef.current.x - size}px`;
      outerElRef.current.style.top = `${outerRef.current.y - size}px`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (disabled) return;

    setVisible(true);

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    const onDown = () => setClicked(true);
    const onUp = () => setClicked(false);
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    rafRef.current = requestAnimationFrame(animate);

    // Hover detection using WeakSet to prevent duplicate listeners
    const hoverEnter = () => setHovering(true);
    const hoverLeave = () => setHovering(false);

    const addHoverListeners = () => {
      const interactables = document.querySelectorAll(
        'a, button, input, textarea, select, [role="button"], [data-cursor-hover]'
      );
      interactables.forEach((el) => {
        if (!trackedElements.current.has(el)) {
          trackedElements.current.add(el);
          el.addEventListener('mouseenter', hoverEnter);
          el.addEventListener('mouseleave', hoverLeave);
        }
      });
    };

    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [animate, disabled]);

  if (disabled || !visible) return null;

  return (
    <>
      {/* Hide default cursor globally */}
      <style>{`* { cursor: none !important; }`}</style>

      {/* Inner dot */}
      <div
        ref={innerElRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: -100,
          top: -100,
          width: clicked ? 6 : 8,
          height: clicked ? 6 : 8,
          borderRadius: '50%',
          backgroundColor: '#f97316',
          opacity: hidden ? 0 : 1,
          transition: 'width 0.15s, height 0.15s, opacity 0.3s',
        }}
      />

      {/* Outer ring with glow */}
      <div
        ref={outerElRef}
        data-hovering={hovering}
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: -100,
          top: -100,
          width: hovering ? 48 : 36,
          height: hovering ? 48 : 36,
          borderRadius: '50%',
          border: `2px solid ${hovering ? '#f97316' : 'rgba(249, 115, 22, 0.5)'}`,
          boxShadow: hovering
            ? '0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(249, 115, 22, 0.1)'
            : '0 0 10px rgba(249, 115, 22, 0.15)',
          opacity: hidden ? 0 : clicked ? 0.6 : 1,
          transition: 'width 0.3s ease-out, height 0.3s ease-out, border-color 0.3s, box-shadow 0.3s, opacity 0.3s',
        }}
      />
    </>
  );
}
