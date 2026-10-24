import {blur, Layout, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  easeInCubic,
  easeOutBack,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';
import {COLORS, FONT_DISPLAY} from '../utils/theme';

export default makeScene2D(function* (view) {
  view.fill(COLORS.paper);

  const speeds: Array<[number, number]> = Array.from({length: 9}, (_, i) => {
    const y = -440 + i * 110;
    const w = 160 + (i % 3) * 140;
    return [y, w];
  });
  const lineRefs = speeds.map(() => createRef<Rect>());

  const zoomBlur = blur(14);

  const txt1 = createRef<Txt>();
  const txt2 = createRef<Layout>();

  for (const [i, [y, w]] of speeds.entries()) {
    view.add(
      <Rect
        ref={lineRefs[i]}
        width={w}
        height={2}
        radius={1}
        fill={COLORS.ink}
        y={y}
        x={-1200}
        opacity={0}
      />,
    );
  }

  view.add(
    <Txt
      ref={txt1}
      text={'something started'}
      fill={COLORS.ink}
      fontSize={64}
      fontWeight={700}
      fontFamily={FONT_DISPLAY}
      letterSpacing={-1}
      scale={2.4}
      filters={[zoomBlur]}
      opacity={0}
    />,
  );

  view.add(
    <Layout
      ref={txt2}
      direction={'row'}
      alignItems={'baseline'}
      gap={10}
      scale={0.75}
      opacity={0}
    >
      <Txt
        text={'proud'}
        fill={COLORS.blue}
        fontSize={76}
        fontWeight={700}
        fontFamily={FONT_DISPLAY}
      />
      <Txt
        text={'of it.'}
        fill={COLORS.ink}
        fontSize={76}
        fontWeight={700}
        fontFamily={FONT_DISPLAY}
      />
    </Layout>,
  );

  yield* all(
    ...lineRefs.map((line, i) =>
      chain(
        waitFor(i * 0.03),
        all(line().opacity(0.7, 0.02), line().x(1200, 0.55, easeInCubic)),
        line().opacity(0, 0.05),
      ),
    ),
    all(
      txt1().opacity(1, 0.03),
      txt1().scale(1, 0.24, easeOutCubic),
      zoomBlur.value(0, 0.24, easeOutCubic),
    ),
  );

  yield* all(
    txt1().scale(0.25, 0.16, easeInCubic),
    txt1().x(700, 0.16, easeInCubic),
    txt1().opacity(0, 0.14),
    zoomBlur.value(10, 0.16),
  );

  yield* all(
    txt2().opacity(1, 0.08),
    txt2().scale(1, 0.24, easeOutBack),
  );

  yield* waitFor(0.4);

  yield* all(
    txt2().opacity(0, 0.3),
    txt2().y(-40, 0.4, easeOutCubic),
  );
});
