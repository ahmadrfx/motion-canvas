import {Circle, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  chain,
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
  const head = createRef<Txt>();
  const sub = createRef<Txt>();
  const bar = createRef<Rect>();
  const dots = Array.from({length: 5}, () => createRef<Circle>());

  const dotPos: Array<[number, number]> = [
    [300, 150],
    [340, 60],
    [360, -30],
    [340, -120],
    [300, -200],
  ];
  const dotSizes = [26, 36, 46, 56, 66];

  view.add(
    <Txt
      ref={eyebrow}
      text={'04 / THE WANT'}
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
      ref={head}
      text={'i wanted to make work'}
      fill={COLORS.ink}
      fontSize={44}
      fontWeight={500}
      fontFamily={FONT_DISPLAY}
      x={-340}
      y={-40}
      textAlign={'left'}
      opacity={0}
    />,
  );

  view.add(
    <Txt
      ref={sub}
      text={'that felt…'}
      fill={COLORS.blue}
      fontSize={58}
      fontWeight={700}
      fontFamily={FONT_DISPLAY}
      x={-340}
      y={40}
      textAlign={'left'}
      opacity={0}
    />,
  );

  view.add(
    <Rect
      ref={bar}
      width={26}
      height={0}
      radius={13}
      fill={COLORS.blue}
      x={240}
      opacity={0}
    />,
  );

  for (let i = 0; i < 5; i++) {
    view.add(
      <Circle
        ref={dots[i]}
        size={0}
        fill={COLORS.blue}
        opacity={0}
        x={dotPos[i][0]}
        y={dotPos[i][1]}
      />,
    );
  }

  yield* eyebrow().opacity(1, 0.4, easeOutExpo);

  yield* all(
    head().opacity(1, 0.3, easeOutExpo),
    head().x(-360, 0.4, easeOutCubic),
    sub().opacity(1, 0.3, easeOutExpo),
    sub().x(-360, 0.4, easeOutCubic),
  );

  yield* all(
    bar().opacity(1, 0.04),
    bar().height(400, 0.3, easeOutCubic),
  );

  yield* all(
    ...dots.map((d, i) =>
      chain(
        waitFor(i * 0.06),
        all(d().opacity(1, 0.05), d().size(dotSizes[i], 0.18, easeOutBack)),
      ),
    ),
  );

  yield* waitFor(0.25);

  yield* all(
    head().opacity(0, 0.2),
    sub().opacity(0, 0.2),
    bar().opacity(0, 0.15),
    ...dots.map(d => d().opacity(0, 0.12)),
    eyebrow().opacity(0, 0.15),
  );
});
