import {Line, Node, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInCubic,
  easeOutCubic,
  easeOutExpo,
  waitFor,
} from '@motion-canvas/core';
import {shake} from '../utils/camera-shake';
import {COLORS, FONT_DISPLAY, FONT_MONO} from '../utils/theme';

export default makeScene2D(function* (view) {
  view.fill('#06070A');

  const container = createRef<Node>();
  const word = createRef<Txt>();
  const strike = createRef<Line>();
  const note = createRef<Txt>();

  view.add(
    <Node ref={container}>
      <Txt
        ref={word}
        text={'PERFECTIONISM'}
        fill={COLORS.gray}
        fontSize={44}
        fontWeight={500}
        fontFamily={FONT_DISPLAY}
        letterSpacing={40}
        opacity={0}
      />
      <Line
        ref={strike}
        points={[[-500, 44], [500, -44]]}
        stroke={COLORS.red}
        lineWidth={6}
        lineCap={'round'}
        end={0}
      />
      <Txt
        ref={note}
        text={'the impossible standard'}
        fill={COLORS.red}
        fontSize={18}
        fontFamily={FONT_MONO}
        letterSpacing={4}
        y={100}
        opacity={0}
      />
    </Node>,
  );

  yield* all(
    word().opacity(1, 0.5, easeOutExpo),
    word().letterSpacing(10, 0.9, easeOutCubic),
  );

  yield* waitFor(0.15);

  yield* strike().end(1, 0.2, easeInCubic);
  yield* shake(container, 5, 0.1);

  yield* waitFor(0.15);

  yield* note().opacity(1, 0.4, easeOutExpo);

  yield* waitFor(0.5);

  yield* all(
    word().opacity(0, 0.3),
    strike().opacity(0, 0.2),
    note().opacity(0, 0.3),
  );
});
