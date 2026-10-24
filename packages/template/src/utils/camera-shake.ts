import {easeOutCubic} from '@motion-canvas/core';

/**
 * Camera shake — quick X/Y jolts then snap back.
 *
 * Usage: yield* shake(container);
 * where container is a createRef<Rect>() wrapping everything in the scene.
 */
export function* shake(container: any, intensity = 6, duration = 0.08) {
  const t = duration * 0.25;
  yield* container().x(intensity, t, easeOutCubic);
  yield* container().x(-intensity * 0.7, t, easeOutCubic);
  yield* container().x(intensity * 0.3, t, easeOutCubic);
  yield* container().x(0, t, easeOutCubic);
}
