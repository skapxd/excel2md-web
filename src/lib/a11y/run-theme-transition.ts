import { trySafe } from '@skapxd/result';

const REVEAL_ORIGIN = '92% 4%';
const REVEAL_MS = 550;

/**
 * Aplica el cambio de tema con una transición suave y progresiva:
 * - View Transitions API con reveal circular desde la esquina del menú ♿.
 * - Fallback: cross-fade de colores por CSS en navegadores sin la API.
 * - Sin animación si el usuario prefiere movimiento reducido.
 */
export async function runThemeTransition(apply: () => void): Promise<void> {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    apply();
    return;
  }

  if (!('startViewTransition' in document)) {
    root.classList.add('theme-transition');
    apply();
    setTimeout(() => root.classList.remove('theme-transition'), 450);
    return;
  }

  const transition = document.startViewTransition(apply);
  const ready = await trySafe(() => transition.ready);
  if (!ready.ok) return;

  root.animate(
    { clipPath: [`circle(0% at ${REVEAL_ORIGIN})`, `circle(150% at ${REVEAL_ORIGIN})`] },
    { duration: REVEAL_MS, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
  );
}
