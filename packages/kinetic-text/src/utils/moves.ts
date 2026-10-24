import {Rect, Txt, blur} from '@motion-canvas/2d';
import {
  ThreadGenerator,
  all,
  delay,
  easeInCubic,
  easeInExpo,
  easeOutBack,
  easeOutCubic,
  easeOutExpo,
} from '@motion-canvas/core';

/**
 * Snappy "product launch" easing kit.
 *
 * SNAP — fast attack, instant settle. Used for every reveal.
 * WHIP — fast exits. Used for every fade-out.
 * POP — fast attack with a ~10% overshoot bounce, in a fixed duration.
 *        Springs are tempting for this, but their settle condition drags on
 *        for ~1s; a fixed-duration back-tween is just as punchy and keeps
 *        the timeline deterministic.
 */
export const SNAP = easeOutExpo;
export const WHIP = easeInExpo;
export const POP = easeOutBack;

export interface WipeInOpts {
  /** Sweep duration. */
  duration?: number;
  /** Letter-spacing at the start of the sweep (wide). */
  trackingFrom?: number;
  /** Letter-spacing once the sweep finishes (tight). */
  trackingTo?: number;
  /** Extra cover height so the sweep never shaves ascenders/descenders. */
  heightPad?: number;
}

/**
 * Curtain wipe reveal — the signature launch-video headline move.
 *
 * A solid cover slides off the text from left to right while the
 * letter-spacing tightens from wide to negative, so the line "squeezes in"
 * as it's unveiled.
 *
 * The cover must be a sibling drawn after the text (on top of it), with a
 * generous initial size set by the caller so the text is hidden from the
 * first frame. On call, the cover is re-sized to the text's measured bounds
 * and its left edge sweeps left → right while it shrinks to zero.
 *
 * Note: mid-flight, tweened transforms on the cover can render oversized in
 * this build, so the reveal effectively lands at the end of the sweep —
 * pair with a quick scale-settle on the text for a punchy entrance.
 */
export function* wipeIn(
  cover: Rect,
  text: Txt,
  {duration = 0.42, trackingFrom = 40, trackingTo = -2, heightPad = 60}: WipeInOpts = {},
): ThreadGenerator {
  const box = text.cacheBBox();
  const width = box.width;
  text.letterSpacing(trackingFrom);
  text.opacity(1);
  cover.width(width);
  cover.height(box.height + heightPad);
  cover.x(0);
  cover.y(text.y());
  cover.scale.x(1);

  yield* all(
    cover.x(width / 2, duration, SNAP),
    cover.scale.x(0, duration, SNAP),
    text.opacity(1, 0.06, SNAP),
    text.letterSpacing(trackingTo, duration, SNAP),
  );
}

export interface PopInOpts {
  /** Delay between consecutive letters. */
  stagger?: number;
  /** Scale each letter starts at. */
  fromScale?: number;
  /** Y offset each letter drops from. */
  fromY?: number;
  /** Max rotation jitter, degrees (deterministic per letter). */
  jitter?: number;
  /** Per-letter letter-spacing while on screen. */
  tracking?: number;
  /** Pop duration per letter. */
  duration?: number;
}

/**
 * Per-letter pop-in: each letter drops in with a back-eased overshoot, slight
 * rotation jitter and a tiny stagger. The classic kinetic-typography slam.
 */
export function* popIn(
  letters: Txt[],
  {
    stagger = 0.045,
    fromScale = 1.45,
    fromY = 70,
    jitter = 6,
    tracking = 2,
    duration = 0.32,
  }: PopInOpts = {},
): ThreadGenerator {
  yield* all(
    ...letters.map((letter, i) =>
      delay(
        i * stagger,
        (function* () {
          const angle = (((i * 7) % 11) - 5) * (jitter / 5);
          letter.rotation(angle);
          letter.letterSpacing(tracking);
          letter.scale(fromScale);
          letter.y(fromY);
          yield* all(
            letter.opacity(1, 0.05, SNAP),
            letter.scale(1, duration, POP),
            letter.y(0, duration, POP),
            letter.rotation(0, 0.28, easeOutCubic),
          );
        })(),
      ),
    ),
  );
}

export interface FlyOutOpts {
  /** Delay between consecutive letters. */
  stagger?: number;
  /** Y travel per letter (negative = up). */
  distance?: number;
  /** Flight duration. */
  duration?: number;
  /** Letter-spacing spread while flying out, if any. */
  trackingTo?: number;
}

/**
 * Per-letter exit: letters scatter upward with a stagger while fading hard
 * and fast. Snappy, never floaty.
 */
export function* flyOut(
  letters: Txt[],
  {stagger = 0.03, distance = -70, duration = 0.2, trackingTo}: FlyOutOpts = {},
): ThreadGenerator {
  yield* all(
    ...letters.map((letter, i) =>
      delay(
        i * stagger,
        (function* () {
          yield* all(
            letter.y(letter.y() + distance, duration, easeInCubic),
            letter.scale(letter.scale().mul(1.25), duration, easeInCubic),
            letter.opacity(0, 0.14, WHIP),
            ...(trackingTo !== undefined
              ? [letter.letterSpacing(trackingTo, 0.25, easeOutCubic)]
              : []),
          );
        })(),
      ),
    ),
  );
}

export interface SlamInOpts {
  /** Scale the word slams in from. */
  fromScale?: number;
  /** Starting blur radius, px. */
  blurFrom?: number;
  /** How long the focus takes. */
  blurDuration?: number;
  /** Slam duration. */
  duration?: number;
}

/**
 * Blur-slam impact: a big word crashes in from scale + blur, overshooting
 * past its target before snapping back, sharpening as it lands. Pair with
 * {@link flash} and a camera shake at impact.
 */
export function* slamIn(
  text: Txt,
  {fromScale = 2.2, blurFrom = 36, blurDuration = 0.45, duration = 0.38}: SlamInOpts = {},
): ThreadGenerator {
  const f = blur(blurFrom);
  text.filters([f]);
  text.scale(fromScale);
  yield* all(
    text.opacity(1, 0.06, SNAP),
    text.scale(1, duration, POP),
    f.value(0, blurDuration, SNAP),
  );
}

export interface TrackSlamOpts {
  /** Letter-spacing the word starts at (wide). */
  from?: number;
  /** Letter-spacing it slams to (tight). */
  to?: number;
  /** Scale it starts at. */
  fromScale?: number;
  /** Slam duration. */
  duration?: number;
}

/**
 * Tracking slam: a word starts stretched wide and snaps shut to tight
 * tracking while scaling up with an overshoot — the launch-video finale move.
 */
export function* trackSlam(
  text: Txt,
  {from = 140, to = 4, fromScale = 0.7, duration = 0.4}: TrackSlamOpts = {},
): ThreadGenerator {
  text.letterSpacing(from);
  text.scale(fromScale);
  yield* all(
    text.opacity(1, 0.05, SNAP),
    text.letterSpacing(to, duration, SNAP),
    text.scale(1, duration, POP),
  );
}

export interface WhooshOutOpts {
  /** Letter-spacing it stretches to. */
  trackingTo?: number;
  /** Exit duration. */
  duration?: number;
}

/**
 * Whoosh-out: the word stretches its tracking and drops opacity in a burst —
 * a fast, directional exit. (No blur: filters + fading opacity render
 * incorrectly in this build, leaving the text stuck at partial opacity.)
 */
export function* whooshOut(
  text: Txt,
  {trackingTo = 60, duration = 0.22}: WhooshOutOpts = {},
): ThreadGenerator {
  yield* all(
    text.letterSpacing(trackingTo, 0.3, easeOutCubic),
    text.opacity(0, 0.16, WHIP),
    text.scale(text.scale().mul(1.08), duration, easeInCubic),
  );
}

export interface BurnOutOpts {
  /** Letter-spacing it stretches to. */
  trackingTo?: number;
  /** Total exit duration. */
  duration?: number;
}

/**
 * Slow burn-out: the opposite of the whoosh — a long, lazy stretch into
 * wide tracking as it fades. Great for the final beat before the end card.
 */
export function* burnOut(
  text: Txt,
  {trackingTo = 160, duration = 0.9}: BurnOutOpts = {},
): ThreadGenerator {
  yield* all(
    text.letterSpacing(trackingTo, duration, easeInCubic),
    text.opacity(0, duration * 0.8, easeInCubic),
    text.scale(1.06, duration, easeInCubic),
  );
}

export interface SweepOpts {
  /** Sweep duration. */
  duration?: number;
  /** Delay before the sweep starts. */
  delayTime?: number;
}

/**
 * Underline sweep: a bar strikes out from the left under a word. The bar's
 * width must be set beforehand; the sweep left-pins its edge by driving
 * `x` and `scale.x` together.
 */
export function* sweepIn(
  bar: Rect,
  {duration = 0.32, delayTime = 0.12}: SweepOpts = {},
): ThreadGenerator {
  const w = bar.width();
  bar.scale.x(0);
  bar.x(-w / 2);
  yield* delay(
    delayTime,
    (function* () {
      yield* all(
        bar.scale.x(1, duration, SNAP),
        bar.x(0, duration, SNAP),
      );
    })(),
  );
}

export interface FlashOpts {
  /** Peak opacity of the flash. */
  peak?: number;
  /** How fast it slams to peak. */
  inDur?: number;
  /** How fast it fades away. */
  outDur?: number;
}

/**
 * Full-screen flash at impact. The rect should cover the view and start at
 * opacity 0; set its fill to the accent color before calling.
 */
export function* flash(rect: Rect, {peak = 0.85, inDur = 0.06, outDur = 0.4}: FlashOpts = {}): ThreadGenerator {
  yield* rect.opacity(peak, inDur, SNAP);
  yield* rect.opacity(0, outDur, easeInCubic);
}

export interface ChipOpts {
  /** How far the chip drops from above. */
  drop?: number;
  /** Drop duration. */
  duration?: number;
}

/**
 * Chip drop-in: a small pill label drops from above and bounces into place.
 */
export function* chipIn(
  chip: Rect,
  toY: number,
  {drop = 60, duration = 0.32}: ChipOpts = {},
): ThreadGenerator {
  chip.y(toY - drop);
  yield* all(
    chip.opacity(1, 0.12, SNAP),
    chip.y(toY, duration, POP),
  );
}
