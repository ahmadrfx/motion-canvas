import {Txt, makeScene2D} from '@motion-canvas/2d';
import {ThreadGenerator, easeOutCubic, waitFor} from '@motion-canvas/core';
import {BLUE, FONT_SANS, FONT_SCRIPT, WHITE} from '../utils/theme';

/* ------------------------------------------------------------------ */
/*  Kinetic typography "text stomp" — 1080×1920, ~12.5 s              */
/* ------------------------------------------------------------------ */

interface LandOpts {
  /** Horizontal offset from center. */
  x?: number;
  /** Vertical position (canvas coords, 0 = center). */
  y?: number;
  /** Hard-cut flip the background as this word lands. */
  flip?: boolean;
  /** Stay at ~65 % tint — never settle to full opacity. */
  muted?: boolean;
  /** Use the flowing script accent font instead of the primary sans. */
  script?: boolean;
}

export default makeScene2D(function* (view) {
  // ---- state -------------------------------------------------------
  view.fill(BLUE);
  let bgIsBlue = true;
  const active: Txt[] = [];

  const textColor = (): string => (bgIsBlue ? WHITE : BLUE);

  const flipBg = () => {
    bgIsBlue = !bgIsBlue;
    view.fill(bgIsBlue ? BLUE : WHITE);
    const c = textColor();
    active.forEach(w => w.fill(c));
  };

  /** Hard-clear every visible word. Background is *not* flipped here —
   *  the next `land()` call that carries `flip: true` handles that. */
  const clearAll = () => {
    active.forEach(w => w.remove());
    active.length = 0;
  };

  /** Land a single word: hard-cut appear at 65 % opacity,
   *  then settle to 100 % over ~4 frames (0.07 s at 60 fps).
   *  Muted words stay at 65 %. */
  const land = function* (
    text: string,
    size: number,
    opts: LandOpts = {},
  ): ThreadGenerator {
    if (opts.flip) flipBg();

    const word = new Txt({
      text,
      fontSize: size,
      fontFamily: opts.script ? FONT_SCRIPT : FONT_SANS,
      fontWeight: opts.script ? 400 : 800,
      fill: textColor(),
      letterSpacing: opts.script || size < 120 ? 0 : -4,
      x: opts.x ?? 0,
      y: opts.y ?? 0,
      opacity: 0.65,
    });
    view.add(word);
    active.push(word);

    if (!opts.muted) {
      yield* word.opacity(1, 0.07, easeOutCubic);
    }
  };

  /* ---- beat pacing ------------------------------------------------ */
  // Staggered delays (0.22 – 0.40 s) so the rhythm feels musical
  // rather than metronomic.

  // ================================================================ S1
  // "You don't always need a perfect plan to build something of your own."
  // ================================================================
  yield* waitFor(0.35);
  yield* land('you', 70, {y: -580});
  yield* waitFor(0.35);
  yield* land("don't", 48, {y: -510, flip: true});
  yield* waitFor(0.22);
  yield* land('always', 170, {y: -415});
  yield* waitFor(0.30);
  yield* land('need', 72, {x: -155, y: -295, flip: true});
  yield* waitFor(0.22);
  yield* land('a', 42, {x: 58, y: -295});
  yield* waitFor(0.30);
  yield* land('perfect', 145, {y: -185});
  yield* waitFor(0.25);
  yield* land('plan', 60, {y: -80, muted: true, flip: true});
  yield* waitFor(0.22);
  yield* land('to', 42, {y: -12});
  yield* waitFor(0.28);
  yield* land('build', 85, {y: 65, flip: true});
  yield* waitFor(0.35);
  yield* land('something', 155, {y: 180});
  yield* waitFor(0.28);
  yield* land('of', 42, {x: -192, y: 310, flip: true});
  yield* waitFor(0.22);
  yield* land('your', 56, {x: -78, y: 310});
  yield* waitFor(0.30);
  yield* land('own', 170, {x: 150, y: 305, script: true, flip: true});
  yield* waitFor(0.65);
  clearAll();

  // ================================================================ S2
  // "Build it because you care."
  // ================================================================
  yield* waitFor(0.30);
  yield* land('Build', 88, {y: -175, flip: true});
  yield* waitFor(0.35);
  yield* land('it', 48, {x: -162, y: -100});
  yield* waitFor(0.22);
  yield* land('because', 48, {x: -42, y: -100, flip: true});
  yield* waitFor(0.28);
  yield* land('you', 56, {x: 118, y: -100});
  yield* waitFor(0.30);
  yield* land('care', 150, {y: 8, flip: true});
  yield* waitFor(0.60);
  clearAll();

  // ================================================================ S3
  // "It feels right because it's yours."
  // ================================================================
  yield* waitFor(0.22);
  yield* land('It', 70, {x: -182, y: -135});
  yield* waitFor(0.35);
  yield* land('feels', 110, {x: -22, y: -135, flip: true});
  yield* waitFor(0.22);
  yield* land('right', 110, {x: 162, y: -135});
  yield* waitFor(0.28);
  yield* land('because', 48, {x: -102, y: -20, flip: true});
  yield* waitFor(0.22);
  yield* land("it's", 48, {x: 88, y: -20});
  yield* waitFor(0.30);
  yield* land('yours', 150, {y: 115, flip: true});
  yield* waitFor(2.70);
});
