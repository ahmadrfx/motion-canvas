import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeOutBack,
  easeOutCubic,
  easeOutExpo,
  waitFor,
} from '@motion-canvas/core';
import {COLORS, FONT_DISPLAY, FONT_MONO} from '../utils/theme';

export default makeScene2D(function* (view) {
  view.fill(COLORS.dark);

  const eyebrow = createRef<Txt>();
  const top = createRef<Txt>();
  const sub = createRef<Txt>();
  const accent = createRef<Txt>();
  const rule = createRef<Rect>();

  view.add(
    <Txt
      ref={eyebrow}
      text={'02 / THE COST'}
      fill={COLORS.gray}
      fontSize={16}
      fontFamily={FONT_MONO}
      letterSpacing={4}
      x={-820}
      y={-430}
      opacity={0}
    />,
  );

  view.add(
    <Txt
      ref={top}
      text={'NO ONE'}
      fill={COLORS.paper}
      fontSize={120}
      fontWeight={700}
      fontFamily={FONT_DISPLAY}
      letterSpacing={4}
      y={-70}
      scale={1.15}
      opacity={0}
    />,
  );

  view.add(
    <Txt
      ref={sub}
      text={'talks about the cost of trying to be'}
      fill={COLORS.gray}
      fontSize={20}
      fontFamily={FONT_MONO}
      fontWeight={500}
      letterSpacing={3}
      y={40}
      opacity={0}
    />,
  );

  view.add(
    <Txt
      ref={accent}
      text={'EXCEPTIONAL ?'}
      fill={COLORS.blue}
      fontSize={46}
      fontWeight={700}
      fontFamily={FONT_DISPLAY}
      letterSpacing={4}
      y={170}
      scale={0.9}
      opacity={0}
    />,
  );

  view.add(
    <Rect
      ref={rule}
      width={0}
      height={6}
      radius={3}
      fill={COLORS.blue}
      y={205}
      opacity={0}
    />,
  );

  yield* eyebrow().opacity(1, 0.4, easeOutExpo);

  yield* all(
    top().opacity(1, 0.12),
    top().scale(1, 0.35, easeOutBack),
  );

  yield* waitFor(0.15);

  yield* all(
    sub().opacity(1, 0.3, easeOutExpo),
    sub().y(20, 0.35, easeOutCubic),
  );

  yield* waitFor(0.15);

  yield* all(
    accent().opacity(1, 0.2, easeOutExpo),
    accent().scale(1, 0.35, easeOutBack),
    rule().opacity(1, 0.05),
    rule().width(340, 0.4, easeOutBack),
  );

  yield* waitFor(0.3);

  yield* all(
    top().letterSpacing(40, 0.35, easeOutCubic),
    top().opacity(0, 0.3),
    sub().opacity(0, 0.25),
    accent().letterSpacing(30, 0.35),
    accent().opacity(0, 0.25),
    rule().width(0, 0.3),
    rule().opacity(0, 0.2),
    eyebrow().opacity(0, 0.2),
  );
});
