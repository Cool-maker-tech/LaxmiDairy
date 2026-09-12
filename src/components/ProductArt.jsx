/**
 * ============================================================================
 *  PRODUCT ILLUSTRATIONS
 * ============================================================================
 *  Drawn artwork for every kind of thing the shop sells, used wherever a
 *  photograph has not been supplied yet.
 *
 *  The point is that a missing photo should look like a decision, not an
 *  omission. A tinted rectangle with a letter in it reads as "broken"; an
 *  illustrated counter reads as a brand. Drop a real photo into
 *  `public/products/` and it takes over automatically — see SmartImage.
 *
 *  House style, kept identical across every drawing so a grid of them reads as
 *  one set:
 *    • 400 × 500 frame (the 4:5 the cards use)
 *    • a soft tinted ground, warmer at the top left
 *    • one circular "spotlight" behind the subject
 *    • flat shapes, no gradients on the subject itself, one gold accent
 *    • a single soft shadow ellipse so everything sits on the same surface
 * ============================================================================
 */

const PALETTE = {
  cream: '#FDF6E6',
  creamDeep: '#F3E3BE',
  mava: '#EBD5A8',
  mavaDeep: '#DCC088',
  caramel: '#C69A5C',
  emerald: '#0B3B2E',
  emeraldMid: '#146249',
  emeraldSoft: '#3F9B7B',
  gold: '#C9A227',
  goldSoft: '#E7D3A1',
  clay: '#B5714A',
  clayDeep: '#8E5334',
  pista: '#7E9B54',
  saffron: '#D98C2B',
  white: '#FFFDF8',
  ink: '#14160F',
}

/** Ground tints per category, so the menu still reads as grouped sections. */
const GROUNDS = {
  shrikhand: ['#F6ECD6', '#E8D6B0'],
  peda: ['#F3E6CD', '#E2CB9E'],
  matho: ['#F5EFE1', '#E2D5B8'],
  rabdi: ['#F1E9D8', '#DDCDA8'],
  mithai: ['#F7EDD8', '#E5D2A6'],
  dairy: ['#EFF3EC', '#D5E0D3'],
  counter: ['#F5F0E4', '#DFD4BC'],
  default: ['#F4EEE2', '#DED2BA'],
}

/* -------------------------------------------------------------------------
 *  Variation
 *
 *  Four shrikhands drawn identically make a menu look like a printing error.
 *  Each product passes its slug as a seed, which nudges the ground tint, the
 *  garnish arrangement and the tilt — small differences, but enough that a row
 *  of cards reads as four sweets rather than one sweet copied four times.
 * ---------------------------------------------------------------------- */

const hash = (s = '') => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/** Garnish layouts, picked by seed. */
const GARNISHES = [
  [
    [214, 194, -16, 'c'],
    [246, 208, 22, 'p'],
    [196, 184, 6, 'c'],
  ],
  [
    [152, 196, 14, 'p'],
    [182, 186, -8, 'c'],
    [232, 202, 28, 'p'],
    [206, 176, 4, 's'],
  ],
  [
    [168, 188, -22, 'c'],
    [236, 190, 10, 'c'],
    [202, 208, 18, 'p'],
  ],
  [
    [190, 180, 8, 's'],
    [224, 198, -14, 'p'],
    [160, 204, 24, 'c'],
    [252, 180, -4, 'c'],
  ],
]

/* -------------------------------------------------------------------------
 *  Shared furniture
 *
 *  Everything is drawn with a soft emerald outline over flat fills. Outlines
 *  are what make these legible at card size: without them cream-on-cream
 *  subjects dissolve into their own background.
 * ---------------------------------------------------------------------- */

const LINE = '#274A3C'
const stroke = (w = 3) => ({
  stroke: LINE,
  strokeWidth: w,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
})

/** The soft shadow every subject sits on. */
const Shadow = ({ cy = 404, rx = 104, ry = 15, opacity = 0.14 }) => (
  <ellipse cx="200" cy={cy} rx={rx} ry={ry} fill={PALETTE.emerald} opacity={opacity} />
)

/**
 * A footed brass bowl. Contents are drawn separately and sit *inside* the rim,
 * narrower than it, so the vessel still reads as a vessel.
 */
function Bowl({ rimY = 246, rimW = 216, depth = 104, fill = PALETTE.mava }) {
  const half = rimW / 2
  const bottom = rimY + depth
  return (
    <>
      {/* foot */}
      <path
        d={`M 172 ${bottom - 4} L 228 ${bottom - 4} L 236 ${bottom + 26} L 164 ${bottom + 26} Z`}
        fill={PALETTE.mavaDeep}
      />
      <path
        d={`M 172 ${bottom - 4} L 228 ${bottom - 4} L 236 ${bottom + 26} L 164 ${bottom + 26} Z`}
        {...stroke(2.6)}
      />
      <ellipse cx="200" cy={bottom + 26} rx="36" ry="7" fill={PALETTE.mavaDeep} />
      <ellipse cx="200" cy={bottom + 26} rx="36" ry="7" {...stroke(2.6)} />

      {/* body */}
      <path
        d={`M ${200 - half} ${rimY}
            C ${200 - half} ${rimY + depth * 0.86}, ${200 - half * 0.52} ${bottom}, 200 ${bottom}
            C ${200 + half * 0.52} ${bottom}, ${200 + half} ${rimY + depth * 0.86}, ${200 + half} ${rimY} Z`}
        fill={fill}
      />
      {/* a band of shade on the lower half, so it has volume */}
      <path
        d={`M ${200 - half * 0.93} ${rimY + depth * 0.42}
            C ${200 - half * 0.78} ${rimY + depth * 0.9}, ${200 - half * 0.45} ${bottom}, 200 ${bottom}
            C ${200 + half * 0.45} ${bottom}, ${200 + half * 0.78} ${rimY + depth * 0.9}, ${200 + half * 0.93} ${rimY + depth * 0.42}
            C ${200 + half * 0.6} ${rimY + depth * 0.66}, ${200 - half * 0.6} ${rimY + depth * 0.66}, ${200 - half * 0.93} ${rimY + depth * 0.42} Z`}
        fill={PALETTE.mavaDeep}
        opacity="0.55"
      />
      <path
        d={`M ${200 - half} ${rimY}
            C ${200 - half} ${rimY + depth * 0.86}, ${200 - half * 0.52} ${bottom}, 200 ${bottom}
            C ${200 + half * 0.52} ${bottom}, ${200 + half} ${rimY + depth * 0.86}, ${200 + half} ${rimY}`}
        {...stroke(3.2)}
      />

      {/* rim, drawn last so it sits over the contents */}
      <ellipse cx="200" cy={rimY} rx={half} ry={half * 0.2} fill={PALETTE.mavaDeep} />
      <ellipse cx="200" cy={rimY} rx={half} ry={half * 0.2} {...stroke(3.2)} />
      <ellipse cx="200" cy={rimY - 5} rx={half - 9} ry={(half - 9) * 0.19} fill={PALETTE.mava} />
      <ellipse cx="200" cy={rimY - 5} rx={half - 9} ry={(half - 9) * 0.19} {...stroke(2.4)} />
    </>
  )
}

/** A tall tumbler. `fill` is the drink; `level` is how full, 0–1. */
function Glass({ fill, level = 0.84, topper = null, top = 178, h = 206, w = 116 }) {
  const half = w / 2
  const taper = 13
  const drinkTop = top + h * (1 - level)
  const inset = (drinkTop - top) * (taper / h)
  return (
    <>
      {/* drink */}
      <path
        d={`M ${200 - half + inset} ${drinkTop}
            L ${200 + half - inset} ${drinkTop}
            L ${200 + half - taper} ${top + h}
            L ${200 - half + taper} ${top + h} Z`}
        fill={fill}
      />
      {topper}
      {/* catch-light */}
      <rect x={200 - half + 15} y={top + 26} width="10" height={h - 62} rx="5" fill={PALETTE.white} opacity="0.45" />
      {/* body */}
      <path
        d={`M ${200 - half} ${top} L ${200 + half} ${top} L ${200 + half - taper} ${top + h} L ${200 - half + taper} ${top + h} Z`}
        {...stroke(3.2)}
      />
      <path d={`M ${200 - half + taper} ${top + h} L ${200 + half - taper} ${top + h}`} {...stroke(3.2)} />
      {/* rim */}
      <ellipse cx="200" cy={top} rx={half} ry="12" fill={PALETTE.white} opacity="0.6" />
      <ellipse cx="200" cy={top} rx={half} ry="12" {...stroke(3.2)} />
    </>
  )
}

/** Chopped nuts and saffron — the garnish half of these sweets share. */
function Nuts({ points, size = 6 }) {
  return points.map(([x, y, rot, tone], i) => (
    <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
      <rect
        x={x}
        y={y}
        width={size * 1.8}
        height={size}
        rx={size / 2}
        fill={tone === 'p' ? PALETTE.pista : tone === 's' ? PALETTE.saffron : PALETTE.caramel}
      />
      <rect x={x} y={y} width={size * 1.8} height={size} rx={size / 2} {...stroke(1.6)} />
    </g>
  ))
}

/* -------------------------------------------------------------------------
 *  The drawings
 * ---------------------------------------------------------------------- */

const ART = {
  /** Thick set shrikhand, piled above the rim and garnished to one side. */
  shrikhand: ({ v, tint }) => (
    <>
      <Shadow />
      {/* the mound first: it must sit behind the rim */}
      <path
        d="M 104 248 C 108 190, 148 158, 200 156 C 252 158, 292 190, 296 248 Z"
        fill={tint ?? PALETTE.cream}
      />
      <path
        d="M 104 248 C 108 190, 148 158, 200 156 C 252 158, 292 190, 296 248 Z"
        {...stroke(3)}
      />
      {/* a spiral worked into the surface, deliberately off-centre */}
      <path
        d="M 150 214 C 168 190, 232 190, 250 216 C 234 200, 178 202, 168 226"
        {...stroke(3.4)}
        opacity="0.5"
      />
      {/* garnish, never centred and never paired, so it cannot read as a face */}
      <path d={v % 2 ? 'M 226 174 c 9 -8 18 -5 21 4' : 'M 154 180 c 9 -8 18 -5 21 4'} {...stroke(3.6)} stroke={PALETTE.saffron} />
      <Nuts points={GARNISHES[v]} />
      <Bowl />
    </>
  ),

  /** Three peda on a plate, thumb-pressed, one nut each. */
  peda: ({ v, tint }) => {
    /*
     * `off` shifts the thumb-press and its nut away from centre. Dead-centre
     * dots on two side-by-side peda read as a pair of eyes; a hand does not
     * press them identically anyway.
     */
    const peda = (x, y, r, nut, off = 0) => (
      <>
        <ellipse cx={x} cy={y + 6} rx={r} ry={r * 0.86} fill={PALETTE.mavaDeep} />
        <ellipse cx={x} cy={y} rx={r} ry={r * 0.86} fill={tint ?? PALETTE.cream} />
        <ellipse cx={x} cy={y} rx={r} ry={r * 0.86} {...stroke(3)} />
        <ellipse cx={x + off} cy={y - 3} rx={r * 0.24} ry={r * 0.2} fill={PALETTE.mava} />
        <ellipse cx={x + off} cy={y - 3} rx={r * 0.24} ry={r * 0.2} {...stroke(2)} />
        <circle cx={x + off} cy={y - 4} r={r * 0.1} fill={nut === 'p' ? PALETTE.pista : PALETTE.saffron} />
      </>
    )
    return (
      <>
        <Shadow cy={400} rx={118} />
        {peda(200, 250, 58, v % 2 ? 'p' : 's', -7)}
        {/* plate */}
        <ellipse cx="200" cy="348" rx="136" ry="34" fill={PALETTE.mavaDeep} />
        <ellipse cx="200" cy="340" rx="136" ry="34" fill={PALETTE.mava} />
        <ellipse cx="200" cy="340" rx="136" ry="34" {...stroke(3.2)} />
        <ellipse cx="200" cy="338" rx="108" ry="25" {...stroke(2.2)} opacity="0.45" />
        {peda(138, 314, 54, v % 2 ? 's' : 'p', 9)}
        {peda(262, 314, 54, v > 1 ? 'p' : 's', -5)}
      </>
    )
  },

  /** Matho: looser than shrikhand, a spoon resting in it. */
  matho: ({ v, tint }) => (
    <>
      <Shadow />
      <path d="M 104 248 C 110 206, 150 184, 200 183 C 250 184, 290 206, 296 248 Z" fill={tint ?? PALETTE.white} />
      <path d="M 104 248 C 110 206, 150 184, 200 183 C 250 184, 290 206, 296 248 Z" {...stroke(3)} />
      <path d="M 132 214 C 160 198, 240 198, 268 214" {...stroke(3.2)} opacity="0.35" />
      <Nuts points={GARNISHES[v]} />
      {/* spoon, leaning out of the bowl */}
      <g transform="rotate(-26 286 216)">
        <rect x="282" y="150" width="10" height="74" rx="5" fill={PALETTE.mava} />
        <rect x="282" y="150" width="10" height="74" rx="5" {...stroke(2.4)} />
        <ellipse cx="287" cy="232" rx="30" ry="20" fill={PALETTE.goldSoft} />
        <ellipse cx="287" cy="232" rx="30" ry="20" {...stroke(2.8)} />
      </g>
      <Bowl rimY={248} rimW={216} depth={100} fill={PALETTE.goldSoft} />
    </>
  ),

  /** Rabdi: reduced milk in layers, generously topped. */
  rabdi: ({ v, tint }) => (
    <>
      <Shadow />
      <path d="M 104 246 C 110 198, 150 172, 200 170 C 250 172, 290 198, 296 246 Z" fill={tint ?? PALETTE.mava} />
      <path d="M 104 246 C 110 198, 150 172, 200 170 C 250 172, 290 198, 296 246 Z" {...stroke(3)} />
      {/* the folded skins that make rabdi rabdi */}
      <path d="M 118 206 C 146 186, 254 186, 282 206" {...stroke(6)} stroke={PALETTE.cream} />
      <path d="M 118 206 C 146 186, 254 186, 282 206" {...stroke(2.4)} opacity="0.5" />
      <path d="M 112 228 C 146 208, 254 208, 288 228" {...stroke(6)} stroke={PALETTE.creamDeep} />
      <path d="M 112 228 C 146 208, 254 208, 288 228" {...stroke(2.4)} opacity="0.45" />
      <Nuts points={[...GARNISHES[v], [206, 230, -16, 'c'], [160, 236, 6, 's']]} />
      <Bowl rimY={248} rimW={216} depth={104} fill={PALETTE.caramel} />
    </>
  ),

  /** Kaju katli: diamond pieces with silver varak, on a tray. */
  mithai: ({ v, tint }) => {
    const diamond = (x, y, w = 52, h = 40) => (
      <>
        <path d={`M ${x} ${y - h} L ${x + w} ${y} L ${x} ${y + h} L ${x - w} ${y} Z`} fill={PALETTE.mava} />
        <path d={`M ${x} ${y - h} L ${x + w} ${y} L ${x} ${y + h - 5} L ${x - w} ${y} Z`} fill={tint ?? PALETTE.cream} />
        <path d={`M ${x} ${y - h} L ${x + w * 0.62} ${y - h * 0.3} L ${x} ${y + h * 0.06} L ${x - w * 0.62} ${y - h * 0.3} Z`} fill={PALETTE.white} opacity="0.9" />
        <path d={`M ${x} ${y - h} L ${x + w} ${y} L ${x} ${y + h} L ${x - w} ${y} Z`} {...stroke(3)} />
      </>
    )
    return (
      <>
        <Shadow cy={400} rx={126} ry={14} />
        {diamond(200, 224)}
        {diamond(126, 262, 48, 37)}
        {diamond(274, 262, 48, 37)}
        {/* tray */}
        <path d="M 58 300 L 342 300 L 330 362 L 70 362 Z" fill={PALETTE.goldSoft} />
        <path d="M 58 300 L 342 300 L 330 362 L 70 362 Z" {...stroke(3.2)} />
        <path d="M 58 300 L 342 300" {...stroke(3.2)} />
        {/* one piece lying on the tray */}
        <g transform={`rotate(${v % 2 ? -9 : 8} 200 330)`}>{diamond(200, 330, 48, 30)}</g>
      </>
    )
  },

  /** A tall glass of milk with a jug behind it. */
  milk: () => (
    <>
      <Shadow rx={112} />
      {/* jug */}
      <path d="M 268 244 L 336 244 L 326 372 L 278 372 Z" fill={PALETTE.creamDeep} />
      <path d="M 268 244 L 336 244 L 326 372 L 278 372 Z" {...stroke(3)} />
      <path d="M 334 268 q 26 8 24 34 q -2 24 -26 26" {...stroke(7)} stroke={PALETTE.creamDeep} />
      <path d="M 334 268 q 26 8 24 34 q -2 24 -26 26" {...stroke(2.6)} />
      <ellipse cx="302" cy="244" rx="34" ry="10" fill={PALETTE.white} />
      <ellipse cx="302" cy="244" rx="34" ry="10" {...stroke(2.8)} />
      <Glass fill={PALETTE.white} level={0.86} topper={<ellipse cx="200" cy="206" rx="52" ry="11" fill={PALETTE.cream} />} />
    </>
  ),

  /** Curd set in an earthen matka with a muslin tie. */
  curd: () => (
    <>
      <Shadow rx={104} />
      <path
        d="M 146 226 C 100 254, 96 342, 132 376 C 160 398, 240 398, 268 376 C 304 342, 300 254, 254 226 Z"
        fill={PALETTE.clay}
      />
      <path
        d="M 146 226 C 100 254, 96 342, 132 376 C 160 398, 240 398, 268 376 C 304 342, 300 254, 254 226 Z"
        {...stroke(3.2)}
      />
      {/* thrown rings */}
      <path d="M 108 292 C 148 306, 252 306, 292 292" {...stroke(2.6)} opacity="0.4" />
      <path d="M 112 324 C 152 338, 248 338, 288 324" {...stroke(2.6)} opacity="0.32" />
      {/* the curd, set to the rim */}
      <ellipse cx="200" cy="226" rx="66" ry="18" fill={PALETTE.white} />
      <ellipse cx="200" cy="226" rx="66" ry="18" {...stroke(2.8)} />
      {/* rim */}
      <path d="M 134 226 C 134 206, 266 206, 266 226" {...stroke(11)} stroke={PALETTE.clayDeep} />
      <path d="M 134 226 C 134 206, 266 206, 266 226" {...stroke(2.8)} />
      {/* muslin tie */}
      <path d="M 126 254 C 168 270, 232 270, 274 254" {...stroke(9)} stroke={PALETTE.goldSoft} />
      <path d="M 126 254 C 168 270, 232 270, 274 254" {...stroke(2.4)} />
    </>
  ),

  /** A block of paneer with a slice cut away, and two cubes. */
  paneer: () => {
    const cube = (x, y, w, h, d) => (
      <>
        <path d={`M ${x} ${y} L ${x + w} ${y} L ${x + w + d} ${y - d} L ${x + d} ${y - d} Z`} fill={PALETTE.white} />
        <path d={`M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`} fill={PALETTE.cream} />
        <path d={`M ${x + w} ${y} L ${x + w + d} ${y - d} L ${x + w + d} ${y + h - d} L ${x + w} ${y + h} Z`} fill={PALETTE.creamDeep} />
        <path
          d={`M ${x} ${y} L ${x + d} ${y - d} L ${x + w + d} ${y - d} L ${x + w + d} ${y + h - d} L ${x + w} ${y + h} L ${x} ${y + h} Z M ${x} ${y} L ${x + w} ${y} L ${x + w + d} ${y - d} M ${x + w} ${y} L ${x + w} ${y + h}`}
          {...stroke(2.8)}
        />
      </>
    )
    return (
      <>
        <Shadow cy={398} rx={124} ry={13} />
        {/* board */}
        <path d="M 52 340 L 348 340 L 336 380 L 64 380 Z" fill={PALETTE.caramel} opacity="0.45" />
        <path d="M 52 340 L 348 340 L 336 380 L 64 380 Z" {...stroke(2.6)} opacity="0.5" />
        {cube(128, 244, 132, 96, 34)}
        {/* the cut slice, leaning away */}
        <g transform="rotate(-8 96 300)">{cube(58, 290, 46, 50, 18)}</g>
        {cube(286, 300, 40, 40, 16)}
      </>
    )
  },

  /** A jar of ghee with a spoon resting against it. */
  ghee: () => (
    <>
      <Shadow rx={100} />
      {/* spoon behind */}
      <g transform="rotate(13 300 240)">
        <rect x="296" y="238" width="10" height="126" rx="5" fill={PALETTE.mava} />
        <rect x="296" y="238" width="10" height="126" rx="5" {...stroke(2.4)} />
        <ellipse cx="301" cy="230" rx="24" ry="16" fill={PALETTE.goldSoft} />
        <ellipse cx="301" cy="230" rx="24" ry="16" {...stroke(2.6)} />
      </g>
      {/* jar */}
      <path d="M 132 238 L 268 238 L 268 366 q 0 14 -16 14 L 148 380 q -16 0 -16 -14 Z" fill={PALETTE.gold} />
      <path d="M 132 238 L 268 238 L 268 254 L 132 254 Z" fill={PALETTE.saffron} opacity="0.5" />
      {/* grain */}
      <circle cx="172" cy="298" r="8" fill={PALETTE.goldSoft} opacity="0.6" />
      <circle cx="218" cy="326" r="10" fill={PALETTE.goldSoft} opacity="0.5" />
      <circle cx="242" cy="288" r="7" fill={PALETTE.goldSoft} opacity="0.55" />
      <circle cx="192" cy="352" r="7" fill={PALETTE.goldSoft} opacity="0.45" />
      <rect x="148" y="272" width="11" height="82" rx="5.5" fill={PALETTE.white} opacity="0.45" />
      <path d="M 132 238 L 268 238 L 268 366 q 0 14 -16 14 L 148 380 q -16 0 -16 -14 Z" {...stroke(3.2)} />
      {/* neck + lid */}
      <rect x="144" y="216" width="112" height="24" rx="6" fill={PALETTE.mava} />
      <rect x="144" y="216" width="112" height="24" rx="6" {...stroke(2.8)} />
      <rect x="136" y="196" width="128" height="24" rx="8" fill={PALETTE.emeraldMid} />
      <rect x="136" y="196" width="128" height="24" rx="8" {...stroke(2.8)} />
    </>
  ),

  /** Chaas: thin, lightly spiced, cumin suspended in it. */
  buttermilk: () => (
    <>
      <Shadow rx={104} />
      <Glass
        fill="#F8F5EA"
        level={0.88}
        topper={
          <>
            <ellipse cx="200" cy="202" rx="52" ry="12" fill={PALETTE.white} />
            <circle cx="178" cy="199" r="8" fill={PALETTE.white} />
            <circle cx="216" cy="197" r="7" fill={PALETTE.white} />
            <circle cx="178" cy="199" r="8" {...stroke(2)} opacity="0.5" />
            <circle cx="216" cy="197" r="7" {...stroke(2)} opacity="0.5" />
            <Nuts
              points={[
                [176, 272, 30, 'c'],
                [214, 304, -20, 'p'],
                [190, 336, 12, 'c'],
                [220, 250, 44, 'p'],
              ]}
              size={4.5}
            />
          </>
        }
      />
      {/* curry leaf on the rim */}
      <path d="M 246 178 c 18 -14 38 -11 44 3 c -14 13 -33 12 -44 -3 Z" fill={PALETTE.pista} />
      <path d="M 246 178 c 18 -14 38 -11 44 3 c -14 13 -33 12 -44 -3 Z" {...stroke(2.4)} />
      <path d="M 250 180 c 16 -7 29 -6 40 1" {...stroke(2)} opacity="0.5" />
    </>
  ),

  /** Rasgulla: three spheres sitting in their syrup. */
  rasgulla: () => (
    <>
      <Shadow cy={402} rx={118} ry={14} />
      <path d="M 78 288 C 78 356, 124 388, 200 388 C 276 388, 322 356, 322 288 Z" fill={PALETTE.goldSoft} />
      <path d="M 78 288 C 78 356, 124 388, 200 388 C 276 388, 322 356, 322 288 Z" {...stroke(3.2)} />
      <ellipse cx="200" cy="288" rx="122" ry="28" fill="#EFD9A6" />
      <ellipse cx="200" cy="288" rx="122" ry="28" {...stroke(3.2)} />
      {[
        [146, 272, 42],
        [254, 272, 40],
        [200, 240, 46],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={PALETTE.white} />
          <circle cx={x} cy={y} r={r} {...stroke(3)} />
          <circle cx={x - r * 0.33} cy={y - r * 0.33} r={r * 0.27} fill={PALETTE.cream} opacity="0.85" />
        </g>
      ))}
    </>
  ),

  /** Sweet lassi, thick, with malai and saffron. */
  lassi: () => (
    <>
      <Shadow rx={104} />
      <Glass
        fill={PALETTE.cream}
        level={0.84}
        topper={
          <>
            <ellipse cx="200" cy="208" rx="54" ry="13" fill={PALETTE.white} />
            <ellipse cx="200" cy="208" rx="54" ry="13" {...stroke(2.4)} opacity="0.5" />
            <path d="M 224 190 c 9 -8 17 -5 20 4" {...stroke(3.6)} stroke={PALETTE.saffron} />
            <path d="M 206 196 c 8 -7 16 -4 19 3" {...stroke(3.6)} stroke={PALETTE.saffron} />
            <Nuts points={[[172, 212, -14, 'p'], [214, 216, 20, 'c']]} size={5.5} />
          </>
        }
      />
    </>
  ),

  /** Cold cocoa milk. */
  coco: () => (
    <>
      <Shadow rx={104} />
      <Glass
        fill="#7A5234"
        level={0.85}
        topper={
          <>
            <ellipse cx="200" cy="204" rx="53" ry="12" fill="#A8794F" />
            <ellipse cx="200" cy="200" rx="45" ry="10" fill={PALETTE.creamDeep} />
            <ellipse cx="200" cy="200" rx="45" ry="10" {...stroke(2.2)} opacity="0.5" />
            <circle cx="182" cy="198" r="5" fill={PALETTE.cream} />
            <circle cx="214" cy="200" r="4" fill={PALETTE.cream} />
          </>
        }
      />
    </>
  ),

  /** The shop counter itself — used by the story sections. */
  shop: () => (
    <>
      {/* awning */}
      <path d="M 34 122 L 366 122 L 340 186 L 60 186 Z" fill={PALETTE.emerald} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path
          key={i}
          d={`M ${34 + i * 47.4} 122 L ${60 + i * 40} 186 L ${60 + i * 40 + 20} 186 L ${34 + i * 47.4 + 23.7} 122 Z`}
          fill={PALETTE.goldSoft}
          opacity={i % 2 ? 0.92 : 0}
        />
      ))}
      <path d="M 34 122 L 366 122 L 340 186 L 60 186 Z" {...stroke(3.2)} />

      {/* milk cans */}
      <path d="M 168 214 L 232 214 L 226 264 L 174 264 Z" fill={PALETTE.emeraldMid} />
      <path d="M 168 214 L 232 214 L 226 264 L 174 264 Z" {...stroke(2.8)} />
      <rect x="182" y="200" width="36" height="16" rx="5" fill={PALETTE.emeraldSoft} />
      <rect x="182" y="200" width="36" height="16" rx="5" {...stroke(2.8)} />

      {/* trays */}
      <ellipse cx="112" cy="256" rx="48" ry="15" fill={PALETTE.goldSoft} />
      <ellipse cx="112" cy="256" rx="48" ry="15" {...stroke(2.8)} />
      <circle cx="96" cy="248" r="15" fill={PALETTE.cream} />
      <circle cx="96" cy="248" r="15" {...stroke(2.4)} />
      <circle cx="126" cy="250" r="13" fill={PALETTE.mava} />
      <circle cx="126" cy="250" r="13" {...stroke(2.4)} />
      <ellipse cx="288" cy="256" rx="48" ry="15" fill={PALETTE.goldSoft} />
      <ellipse cx="288" cy="256" rx="48" ry="15" {...stroke(2.8)} />
      <path d="M 268 238 L 290 250 L 268 262 L 246 250 Z" fill={PALETTE.cream} />
      <path d="M 268 238 L 290 250 L 268 262 L 246 250 Z" {...stroke(2.4)} />
      <path d="M 308 240 L 328 250 L 308 262 L 288 250 Z" fill={PALETTE.creamDeep} />
      <path d="M 308 240 L 328 250 L 308 262 L 288 250 Z" {...stroke(2.4)} />

      {/* counter */}
      <rect x="48" y="268" width="304" height="26" rx="7" fill={PALETTE.mava} />
      <rect x="48" y="268" width="304" height="26" rx="7" {...stroke(3.2)} />
      <path d="M 62 294 L 338 294 L 338 384 L 62 384 Z" fill={PALETTE.clay} opacity="0.4" />
      <path d="M 62 294 L 338 294 L 338 384 L 62 384 Z" {...stroke(2.8)} opacity="0.55" />
      <path d="M 200 294 L 200 384" {...stroke(2.4)} opacity="0.4" />
    </>
  ),
}

/** Which drawing a category falls back to when a product names none. */
const CATEGORY_ART = {
  shrikhand: 'shrikhand',
  peda: 'peda',
  matho: 'matho',
  rabdi: 'rabdi',
  mithai: 'mithai',
  dairy: 'milk',
  counter: 'rasgulla',
}

export const hasArt = (kind) => Boolean(ART[kind])

/**
 * @param {string} kind      an ART key, e.g. 'shrikhand'
 * @param {string} category  used to pick both the ground tint and a fallback drawing
 */
export default function ProductArt({ kind, category = 'default', seed = '', tint, className }) {
  const draw = ART[kind] ?? ART[CATEGORY_ART[category]] ?? ART.shrikhand
  const [from, to] = GROUNDS[category] ?? GROUNDS.default
  const v = hash(seed) % GARNISHES.length
  const id = `${kind ?? category}-${from.slice(1)}-${v}`

  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <radialGradient id={`s-${id}`} cx="50%" cy="46%" r="52%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="500" fill={`url(#g-${id})`} />
      <circle cx="200" cy="230" r="150" fill={`url(#s-${id})`} />

      {/* A hairline arc, so every drawing shares one piece of geometry. */}
      <circle
        cx="200"
        cy="230"
        r="132"
        fill="none"
        stroke={PALETTE.emerald}
        strokeOpacity="0.08"
        strokeWidth="2"
      />

      {draw({ v, tint })}
    </svg>
  )
}
