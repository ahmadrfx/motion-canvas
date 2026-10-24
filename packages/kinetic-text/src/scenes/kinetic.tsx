import {Circle, Grid, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';
import {shake} from '../utils/camera-shake';
import {
  POP,
  SNAP,
  WHIP,
  burnOut,
  chipIn,
  flash,
  flyOut,
  popIn,
  slamIn,
  sweepIn,
  trackSlam,
  whooshOut,
  wipeIn,
} from '../utils/moves';
import {COLORS, FONT_DISPLAY, FONT_MONO} from '../utils/theme';

export default makeScene2D(function* (view) {
  view.fill(COLORS.dark);

  const container = createRef<Node>();
  const grid = createRef<Grid>();
  const glow = createRef<Node>();
  const chip = createRef<Rect>();
  const dot = createRef<Circle>();
  const cover = createRef<Rect>();
  const headline = createRef<Txt>();
  const body = createRef<Txt>();
  const ship = createRef<Txt>();
  const now = createRef<Txt>();
  const go = createRef<Txt>();
  const goBar = createRef<Rect>();
  const bar = createRef<Rect>();
  const footer = createRef<Txt>();
  const flashRect = createRef<Rect>();

  const accentLetters = 'SHOW UP'.split('').map(() => createRef<Txt>());

  view.add(
    <Node ref={container}>
      <Grid
        ref={grid}
        width={1440}
        height={810}
        spacing={80}
        stroke={'#ffffff'}
        lineWidth={1}
        opacity={0}
      />
      {/* Soft blue glow. NOTE: a radial-gradient fill breaks sibling text
          rendering in this build (text renders 2x and displaced), so the
          falloff is faked with three concentric discs instead. */}
      <Node ref={glow} opacity={0}>
        <Circle size={1400} fill={'rgba(47,107,255,0.035)'} />
        <Circle size={1000} fill={'rgba(47,107,255,0.055)'} />
        <Circle size={640} fill={'rgba(47,107,255,0.08)'} />
      </Node>
      <Rect
        ref={chip}
        layout
        direction={'row'}
        gap={10}
        alignItems={'center'}
        padding={[12, 22]}
        radius={22}
        fill={COLORS.darkSoft}
        y={-300}
        opacity={0}
      >
        <Circle ref={dot} size={10} fill={COLORS.blue} />
        <Txt
          text={'DAY 001'}
          fill={COLORS.paper}
          fontSize={14}
          fontFamily={FONT_MONO}
          fontWeight={500}
          letterSpacing={3}
        />
      </Rect>
      <Txt
        ref={headline}
        text={'MOMENTUM.'}
        fill={COLORS.paper}
        fontSize={140}
        fontWeight={700}
        fontFamily={FONT_DISPLAY}
        letterSpacing={-2}
        y={20}
        opacity={1}
      />
      <Txt
        ref={body}
        text={'not perfect · not pretty · just forward'}
        fill={COLORS.gray}
        fontSize={22}
        fontFamily={FONT_MONO}
        fontWeight={500}
        letterSpacing={2}
        y={90}
        opacity={0}
      />
      <Rect layout direction={'row'} alignItems={'center'} y={90}>
        {accentLetters.map((ref, i) => (
          <Txt
            ref={ref}
            text={'SHOW UP'[i]}
            fill={i < 4 ? COLORS.blue : COLORS.paper}
            fontSize={96}
            fontWeight={700}
            fontFamily={FONT_DISPLAY}
            letterSpacing={2}
            opacity={0}
          />
        ))}
      </Rect>
      <Txt
        ref={ship}
        text={'KEEP GOING'}
        fill={COLORS.paper}
        fontSize={150}
        fontWeight={700}
        fontFamily={FONT_DISPLAY}
        letterSpacing={2}
        y={80}
        opacity={0}
      />
      <Txt
        ref={now}
        text={'NOW'}
        fill={COLORS.red}
        fontSize={210}
        fontWeight={700}
        fontFamily={FONT_DISPLAY}
        letterSpacing={4}
        y={60}
        opacity={0}
      />
      <Txt
        ref={go}
        text={'GO.'}
        fill={COLORS.blue}
        fontSize={260}
        fontWeight={700}
        fontFamily={FONT_DISPLAY}
        letterSpacing={4}
        y={90}
        opacity={0}
      />
    </Node>,
  );

  view.add(
    <Rect
      ref={cover}
      width={2000}
      height={400}
      fill={COLORS.dark}
      y={20}
    />,
  );
  view.add(
    <Rect
      ref={goBar}
      width={0}
      height={10}
      radius={5}
      fill={COLORS.blue}
      scaleX={0}
    />,
  );
  view.add(
    <Rect
      ref={flashRect}
      width={1920}
      height={1080}
      fill={'rgba(47,107,255,0.25)'}
      opacity={0}
    />,
  );
  view.add(
    <Rect
      ref={bar}
      width={0}
      height={5}
      radius={2.5}
      fill={COLORS.blue}
      y={-490}
      opacity={0}
    />,
  );
  view.add(
    <Txt
      ref={footer}
      text={'kinetic / 010s'}
      fill={COLORS.gray}
      fontSize={13}
      fontFamily={FONT_MONO}
      letterSpacing={2}
      x={-820}
      y={430}
      opacity={0}
    />,
  );

  function* content() {
    // 0.00 — backdrop breathes in
    yield* all(
      grid().opacity(0.05, 0.5, easeOutCubic),
      glow().opacity(1, 0.6, easeOutCubic),
    );

    // 0.10 — chip drops in, dot pulses
    yield* chipIn(chip(), -300);
    dot().scale(1.9);
    yield* dot().scale(1, 0.3, POP);

    // 0.62 — headline wipes in with tracking tighten
    yield* wipeIn(cover(), headline());
    headline().scale(1.05);
    yield* headline().scale(1, 0.25, POP);

    // 1.05 — subline rises in
    body().y(120);
    yield* all(
      body().opacity(1, 0.12, SNAP),
      body().y(90, 0.3, POP),
    );
    yield* waitFor(0.1);

    // 1.55 — headline whooshes out
    yield* all(
      whooshOut(headline()),
      body().opacity(0, 0.1, WHIP),
    );

    // 1.95 — SHOW UP pops in letter by letter
    yield* popIn(accentLetters.map(ref => ref()));
    yield* waitFor(0.25);

    // ~3.2 — letters scatter out
    yield* flyOut(accentLetters.map(ref => ref()), {trackingTo: 60});

    // ~3.6 — KEEP GOING blurs in from a slam
    yield* all(
      slamIn(ship()),
      flash(flashRect(), {peak: 0.8}),
    );
    yield* shake(container, 10, 0.1);
    yield* waitFor(0.45);
    yield* whooshOut(ship(), {trackingTo: 50, duration: 0.26});

    // ~5.2 — NOW hits harder, in red
    flashRect().fill('rgba(242,74,58,0.25)');
    yield* all(
      slamIn(now(), {fromScale: 2.6, blurFrom: 50}),
      flash(flashRect(), {peak: 1}),
    );
    yield* shake(container, 13, 0.12);
    yield* waitFor(0.55);
    yield* whooshOut(now(), {trackingTo: 90, duration: 0.34});

    // ~6.9 — GO. slams its tracking shut and strikes an underline
    const goBox = go().cacheBBox();
    goBar().width(goBox.width + 30);
    goBar().y(go().y() + goBox.bottom + 12);
    flashRect().fill('rgba(47,107,255,0.25)');
    yield* all(
      trackSlam(go()),
      sweepIn(goBar(), {delayTime: 0.1}),
      flash(flashRect(), {peak: 0.9}),
    );
    yield* shake(container, 9, 0.1);
    yield* waitFor(0.7);

    // ~8.5 — slow burn out into the end card
    yield* all(
      burnOut(go(), {trackingTo: 170, duration: 0.95}),
      goBar().scale.x(0, 0.6, easeInOutCubic),
      goBar().opacity(0, 0.5),
      chip().opacity(0, 0.4),
      footer().opacity(0.7, 0.4, easeOutCubic),
    );
  }

  function* barFill() {
    yield* bar().opacity(0.5, 0.3);
    yield* bar().width(1240, 7.9, easeInOutCubic);
    yield* bar().opacity(0, 0.4);
  }

  yield* all(content(), barFill());
});
