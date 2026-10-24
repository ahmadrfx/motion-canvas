import {Circle, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInCubic,
  easeOutBack,
  easeOutQuad,
  waitFor,
} from '@motion-canvas/core';
import {shake} from '../utils/camera-shake';
import {COLORS, FONT_DISPLAY} from '../utils/theme';

export default makeScene2D(function* (view) {
  view.fill(COLORS.dark);

  const container = createRef<Node>();
  const floor = createRef<Rect>();
  const ball = createRef<Circle>();
  const fText = createRef<Txt>();

  view.add(
    <Node ref={container}>
      <Rect
        ref={floor}
        width={0}
        height={12}
        radius={6}
        fill={COLORS.paper}
        y={160}
        opacity={0}
      />
      <Circle ref={ball} size={46} fill={COLORS.blue} y={-260} opacity={0} />
      <Txt
        ref={fText}
        text={'F*ck.'}
        fill={COLORS.paper}
        fontSize={52}
        fontWeight={700}
        fontFamily={FONT_DISPLAY}
        x={140}
        y={40}
        scale={1.5}
        opacity={0}
      />
    </Node>,
  );

  yield* all(
    floor().opacity(1, 0.05),
    floor().width(560, 0.3, easeOutBack),
    ball().opacity(1, 0.05),
  );

  yield* ball().y(160, 0.42, easeInCubic);

  yield* all(
    ball().scale([1.25, 0.55], 0.05),
  );
  yield* ball().scale(1, 0.1, easeOutBack);

  yield* ball().y(80, 0.22, easeOutQuad);
  yield* ball().y(160, 0.16, easeInCubic);

  yield* all(
    fText().opacity(1, 0.05),
    fText().scale(1, 0.16, easeOutBack),
    fText().rotation(-2, 0.14).to(0, 0.1),
  );
  yield* shake(container, 4, 0.06);

  yield* waitFor(0.3);

  yield* all(
    floor().opacity(0, 0.12),
    ball().opacity(0, 0.12),
    fText().opacity(0, 0.12),
  );
});
