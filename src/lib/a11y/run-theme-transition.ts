import { trySafe } from '@skapxd/result';
import { reportDomainError } from '@/lib/errors/report-domain-error';
import { getRevealGeometry } from '@/lib/a11y/get-reveal-geometry';

const REVEAL_MS = 460;
const FALLBACK_TRANSITION_CLEANUP_MS = 450;
const OLD_THEME_FADE_OPACITY = 0.9;

/**
 * Aplica el cambio de tema con una transición suave y progresiva:
 * - View Transitions API con reveal radial desde la esquina del menú.
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

  const supportsViewTransition = 'startViewTransition' in document;
  if (!supportsViewTransition) {
    root.classList.add('theme-transition');
    apply();
    setTimeout(() => root.classList.remove('theme-transition'), FALLBACK_TRANSITION_CLEANUP_MS);
    return;
  }

  root.classList.add('theme-transition-dom-lock');
  const transition = document.startViewTransition(apply);
  const ready = await trySafe(() => transition.ready);
  if (!ready.ok) {
    root.classList.remove('theme-transition-dom-lock');
    reportDomainError('No se pudo preparar la transición de tema.', ready.error);
    return;
  }

  const animated = await trySafe(() => {
    const { origin, radius } = getRevealGeometry();

    root.animate(
      { opacity: [1, OLD_THEME_FADE_OPACITY] },
      { duration: REVEAL_MS, easing: 'ease-out', pseudoElement: '::view-transition-old(root)' },
    );
    root.animate(
      {
        clipPath: [`circle(0px at ${origin})`, `circle(${radius}px at ${origin})`],
        transform: ['scale(0.985)', 'scale(1)'],
      },
      {
        duration: REVEAL_MS,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        pseudoElement: '::view-transition-new(root)',
      },
    );

    return transition.finished;
  });

  root.classList.remove('theme-transition-dom-lock');
  if (!animated.ok) {
    reportDomainError('No se pudo animar la transición de tema.', animated.error);
  }
}
