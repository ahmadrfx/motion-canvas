import {Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  easeOutExpo,
  waitFor,
} from '@motion-canvas/core';
import {COLORS, FONT_DISPLAY, FONT_MONO} from '../utils/theme';

export default makeScene2D(function* (view) {
  view.fill(COLORS.paper);

  const eyebrow = createRef<Txt>();
  const line1 = createRef<Txt>();
  const line2 = createRef<Txt>();

  view.add(
    <Txt
      ref={eyebrow}
      text={'06 / THE WHY'}
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
      ref={line1}
      text={'I wanted to be'}
      fill={COLORS.ink}
      fontSize={64}
      fontWeight={500}
      fontFamily={FONT_DISPLAY}
      y={-10}
      opacity={0}
    />,
  );

  view.add(
    <Txt
      ref={line2}
      text={'that for others'}
      fill={COLORS.blue}
      fontSize={64}
      fontWeight={700}
      fontFamily={FONT_DISPLAY}
      y={90}
      opacity={0}
    />,
  );

  yield* eyebrow().opacity(1, 0.4, easeOutExpo);

  yield* all(
    line1().opacity(1, 0.3, easeOutExpo),
    line1().y(-50, 0.35, easeOutCubic),
  );

  yield* waitFor(0.12);

  yield* all(
    line2().opacity(1, 0.3, easeOutExpo),
    line2().y(30, 0.35, easeOutCubic),
  );

  yield* waitFor(0.35);

  yield* all(
    line1().x(-40, 1.4, easeInOutCubic),
    line2().x(-40, 1.4, easeInOutCubic),
  );

  yield* all(
    line1().opacity(0, 0.4),
    line2().opacity(0, 0.4),
    eyebrow().opacity(0, 0.3),
  );
});
