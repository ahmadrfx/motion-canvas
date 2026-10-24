import {Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
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
  view.fill(COLORS.paper);

  const eyebrow = createRef<Txt>();
  const head = createRef<Layout>();
  const question = createRef<Txt>();
  const mark = createRef<Txt>();
  const rule = createRef<Rect>();

  view.add(
    <Txt
      ref={eyebrow}
      text={'01 / BEGIN'}
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
    <Layout
      ref={head}
      direction={'row'}
      alignItems={'baseline'}
      gap={6}
      opacity={0}
      scale={1.12}
    >
      <Txt
        ref={question}
        text={'Question'}
        fill={COLORS.ink}
        fontSize={88}
        fontWeight={700}
        fontFamily={FONT_DISPLAY}
      />
      <Txt
        ref={mark}
        text={'?'}
        fill={COLORS.blue}
        fontSize={88}
        fontWeight={700}
        fontFamily={FONT_DISPLAY}
      />
    </Layout>,
  );

  view.add(
    <Rect
      ref={rule}
      width={0}
      height={6}
      radius={3}
      fill={COLORS.blue}
      y={80}
      opacity={0}
    />,
  );

  yield* eyebrow().opacity(1, 0.4, easeOutExpo);

  yield* all(
    head().opacity(1, 0.25, easeOutExpo),
    head().scale(1, 0.45, easeOutBack),
  );

  yield* all(
    rule().opacity(1, 0.05),
    rule().width(220, 0.35, easeOutBack),
  );

  yield* waitFor(0.25);

  yield* all(
    head().opacity(0, 0.3),
    question().letterSpacing(24, 0.35, easeOutCubic),
    mark().opacity(0, 0.2),
    rule().width(0, 0.3),
    rule().opacity(0, 0.2),
    eyebrow().opacity(0, 0.2),
  );
});
