import {Node} from '@motion-canvas/2d';
import {Reference, all, easeOutCubic} from '@motion-canvas/core';

/**
 * Camera shake — quick X/Y jolts with a rotation wiggle, then snap back.
 *
 * Usage: yield* shake(container, 10, 0.1);
 * where container is a ref-wrapped Node holding everything in the scene.
 */
export function* shake(container: Reference<Node>, intensity = 6, duration = 0.08) {
  const t = duration * 0.25;
  const rot = intensity * 0.05;
  yield* all(
    container().x(intensity, t, easeOutCubic),
    container().rotation(rot, t, easeOutCubic),
  );
  yield* all(
    container().x(-intensity * 0.7, t, easeOutCubic),
    container().rotation(-rot * 0.75, t, easeOutCubic),
  );
  yield* all(
    container().x(intensity * 0.3, t, easeOutCubic),
    container().rotation(rot * 0.4, t, easeOutCubic),
  );
  yield* all(
    container().x(0, t, easeOutCubic),
    container().rotation(0, t, easeOutCubic),
  );
}
