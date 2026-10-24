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
  const endTxt = createRef<Txt>();
  const rule = createRef<Rect>();
  const sub = createRef<Txt>();
  const footer = createRef<Txt>();

  view.add(
    <Txt
      ref={eyebrow}
      text={'09 / END'}
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
      ref={endTxt}
      text={'the end'}
      fill={COLORS.paper}
      fontSize={88}
      fontWeight={700}
      fontFamily={FONT_DISPLAY}
      scale={1.08}
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
      y={70}
      opacity={0}
    />,
  );

  view.add(
    <Txt
      ref={sub}
      text={'perfection is overrated'}
      fill={COLORS.gray}
      fontSize={20}
      fontFamily={FONT_MONO}
      fontWeight={500}
      letterSpacing={4}
      y={140}
      opacity={0}
    />,
  );

  view.add(
    <Txt
      ref={footer}
      text={'made with motion canvas'}
      fill={COLORS.gray}
      fontSize={13}
      fontFamily={FONT_MONO}
      letterSpacing={2}
      x={-820}
      y={430}
      opacity={0}
    />,
  );

  yield* eyebrow().opacity(1, 0.4, easeOutExpo);

  yield* all(
    endTxt().opacity(1, 0.3, easeOutExpo),
    endTxt().scale(1, 0.4, easeOutBack),
  );

  yield* all(
    rule().opacity(1, 0.05),
    rule().width(200, 0.35, easeOutBack),
  );

  yield* all(
    sub().opacity(1, 0.5, easeOutExpo),
    sub().y(120, 0.5, easeOutCubic),
  );

  yield* footer().opacity(0.7, 0.6, easeOutExpo);

  yield* waitFor(0.8);

  yield* all(
    endTxt().opacity(0, 0.4),
    rule().opacity(0, 0.3),
    sub().opacity(0, 0.4),
    footer().opacity(0, 0.3),
    eyebrow().opacity(0, 0.3),
  );

  yield* waitFor(0.2);
});
