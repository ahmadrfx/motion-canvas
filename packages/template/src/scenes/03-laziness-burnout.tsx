import {Circle, Line, Node, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInCubic,
  easeOutBack,
  waitFor,
} from '@motion-canvas/core';
import {shake} from '../utils/camera-shake';
import {COLORS, FONT_DISPLAY} from '../utils/theme';

export default makeScene2D(function* (view) {
  view.fill(COLORS.dark);

  const container = createRef<Node>();
  const word1 = createRef<Txt>();
  const strikeX1 = createRef<Line>();
  const strikeX2 = createRef<Line>();
  const word2 = createRef<Txt>();
  const strikeCircle = createRef<Circle>();
  const strikeLine = createRef<Line>();

  view.add(
    <Node ref={container}>
      <Txt
        ref={word1}
        text={'LAZINESS'}
        fill={COLORS.paper}
        fontSize={92}
        fontWeight={700}
        fontFamily={FONT_DISPLAY}
        letterSpacing={6}
        opacity={0}
      />
      <Line
        ref={strikeX1}
        points={[[-70, -40], [70, 40]]}
        stroke={COLORS.red}
        lineWidth={10}
        lineCap={'round'}
        end={0}
      />
      <Line
        ref={strikeX2}
        points={[[-70, 40], [70, -40]]}
        stroke={COLORS.red}
        lineWidth={10}
        lineCap={'round'}
        end={0}
      />
      <Txt
        ref={word2}
        text={'BURNOUT'}
        fill={COLORS.paper}
        fontSize={92}
        fontWeight={700}
        fontFamily={FONT_DISPLAY}
        letterSpacing={6}
        opacity={0}
      />
      <Circle
        ref={strikeCircle}
        size={170}
        stroke={COLORS.red}
        lineWidth={10}
        scale={0.6}
        opacity={0}
      />
      <Line
        ref={strikeLine}
        points={[[-34, -46], [34, 46]]}
        stroke={COLORS.red}
        lineWidth={10}
        lineCap={'round'}
        end={0}
      />
    </Node>,
  );

  yield* all(
    word1().opacity(1, 0.06),
    word1().scale(1.25, 0.18, easeOutBack).to(1, 0.08),
  );
  yield* waitFor(0.05);

  yield* all(
    strikeX1().end(1, 0.07, easeInCubic),
    strikeX2().end(1, 0.07, easeInCubic),
  );
  yield* shake(container);

  yield* waitFor(0.15);

  yield* all(
    word1().opacity(0, 0.08),
    strikeX1().opacity(0, 0.08),
    strikeX2().opacity(0, 0.08),
  );

  yield* all(
    word2().opacity(1, 0.08),
    word2().scale(1.2, 0.16, easeOutBack).to(1, 0.06),
  );
  yield* waitFor(0.05);

  yield* all(
    strikeCircle().opacity(1, 0.04),
    strikeCircle().scale(1, 0.16, easeOutBack),
    strikeLine().end(1, 0.08, easeInCubic),
  );
  yield* shake(container);

  yield* waitFor(0.2);

  yield* all(
    word2().opacity(0, 0.1),
    strikeCircle().opacity(0, 0.08),
    strikeLine().opacity(0, 0.08),
  );
});
