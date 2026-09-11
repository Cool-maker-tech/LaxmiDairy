import { useEffect, useRef } from 'react'

/**
 * An abstract cream form for the hero — a soft, slowly folding liquid droplet.
 *
 * Written as a single raw-WebGL fragment shader rather than with a 3D library.
 * The whole effect is one full-quad draw call: a ray is fired per pixel, met
 * against a noise-displaced sphere by short sphere-tracing steps, then shaded.
 * That keeps the hero's optional chrome at a few kilobytes instead of the
 * ~130 kB gzipped a general-purpose 3D engine would have cost for one mesh.
 *
 * Restraint, deliberately:
 *   • resolution scaled to 0.75, DPR capped at 1.5
 *   • renders only while on screen and while the tab is visible
 *   • a single still frame when the visitor prefers reduced motion
 *   • silently renders nothing if WebGL is unavailable
 *
 * Lazy-loaded, and never mounted on phones — see `Hero.jsx`.
 */

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main(){
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2  uResolution;
  uniform float uTime;

  varying vec2 vUv;

  const vec3 CREAM  = vec3(0.992, 0.963, 0.890);
  const vec3 SHADOW = vec3(0.352, 0.286, 0.176);
  const vec3 RIM    = vec3(0.906, 0.827, 0.631);

  /* --- Ashima simplex noise (public domain) ---------------------------- */
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  /* --- the surface ------------------------------------------------------ */
  const float RADIUS = 1.0;
  const float AMPLITUDE = 0.34;

  // Signed distance to a sphere whose radius breathes with two noise octaves.
  // The second octave is kept quiet on purpose: a strong one turns the form
  // lumpy, and cream folds in broad lobes rather than in ripples.
  float surface(vec3 p){
    vec3 dir = normalize(p);
    float t = uTime * 0.17;
    float n = snoise(dir * 0.82 + vec3(t, t * 0.58, -t * 0.44)) * 0.78
            + snoise(dir * 1.90 + vec3(-t * 0.66, t * 0.38, t)) * 0.11;
    return length(p) - (RADIUS + n * AMPLITUDE);
  }

  vec3 surfaceNormal(vec3 p){
    // Tetrahedral gradient — four taps instead of six.
    vec2 e = vec2(0.0025, -0.0025);
    return normalize(
      e.xyy * surface(p + e.xyy) +
      e.yyx * surface(p + e.yyx) +
      e.yxy * surface(p + e.yxy) +
      e.xxx * surface(p + e.xxx)
    );
  }

  void main(){
    // Square-aspect coordinates so the form never stretches with the panel.
    vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);

    vec3 rayOrigin = vec3(0.0, 0.0, 3.05);
    vec3 rayDir = normalize(vec3(uv * 0.62, -1.0));

    // Bounding sphere: skip every pixel the form cannot possibly reach, and
    // get the exact segment of the ray that could contain the surface.
    float bound = RADIUS + AMPLITUDE;
    float b = dot(rayOrigin, rayDir);
    float c = dot(rayOrigin, rayOrigin) - bound * bound;
    float disc = b * b - c;
    if (disc < 0.0) discard;

    float root = sqrt(disc);
    float tNear = -b - root;
    float tFar  = -b + root;

    // The radius is a function of direction alone, so the form is star-shaped
    // about the origin: a uniform march over [tNear, tFar] cannot tunnel
    // through a fold the way sphere tracing does — relaxing its step still
    // overshoots, because a noise-displaced radius is not a true distance
    // field. March coarsely for the first sign change, then bisect into it.
    const int MARCH_STEPS = 26;
    float span = (tFar - tNear) / float(MARCH_STEPS);

    float tPrev = tNear;
    float dPrev = surface(rayOrigin + rayDir * tNear);
    float tHit = -1.0;

    for (int i = 1; i <= MARCH_STEPS; i++) {
      float t = tNear + span * float(i);
      float d = surface(rayOrigin + rayDir * t);
      if (d < 0.0 && dPrev > 0.0) { tHit = t; break; }
      tPrev = t;
      dPrev = d;
    }
    if (tHit < 0.0) discard;

    // Six bisections put the hit within span/64 of the true surface.
    float lo = tPrev;
    float hi = tHit;
    for (int i = 0; i < 6; i++) {
      float mid = (lo + hi) * 0.5;
      if (surface(rayOrigin + rayDir * mid) > 0.0) lo = mid; else hi = mid;
    }

    vec3 pos = rayOrigin + rayDir * ((lo + hi) * 0.5);

    vec3 normal = surfaceNormal(pos);
    vec3 view = normalize(rayOrigin - pos);

    // One key light, high and to the left — the way a window falls on cream.
    vec3 keyDir = normalize(vec3(-0.5, 0.82, 0.62));
    float lambert = clamp(dot(normal, keyDir) * 0.5 + 0.5, 0.0, 1.0);
    float fill = clamp(dot(normal, normalize(vec3(0.7, -0.3, 0.5))) * 0.5 + 0.5, 0.0, 1.0);

    float fresnel = pow(1.0 - clamp(dot(normal, view), 0.0, 1.0), 2.6);

    vec3 half_ = normalize(keyDir + view);
    float spec = pow(clamp(dot(normal, half_), 0.0, 1.0), 42.0);

    // Push the midtones down so the folds read as volume, not as a flat disc.
    vec3 color = mix(SHADOW, CREAM, smoothstep(0.06, 0.98, pow(lambert, 1.85)));
    color += CREAM * fill * 0.09;
    color += RIM * fresnel * 0.38;
    color += vec3(1.0) * spec * 0.18;

    // Soften only the last sliver of the silhouette, so the body stays solid
    // and the form melts into the hero at its edge instead of cutting out.
    float alpha = mix(0.97, 0.62, smoothstep(0.45, 1.0, fresnel));
    gl_FragColor = vec4(color * alpha, alpha);
  }
`

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function CreamForm({ reducedMotion = false, className, onUnavailable }) {
  const canvasRef = useRef(null)
  const unavailableRef = useRef(onUnavailable)
  unavailableRef.current = onUnavailable

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    // Any failure below hands the hero back its static fallback rather than
    // leaving a hole where the form should be.
    const giveUp = (reason) => {
      if (import.meta.env.DEV) console.warn(`[CreamForm] ${reason}`)
      unavailableRef.current?.()
    }

    const gl =
      canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        premultipliedAlpha: true,
        powerPreference: 'low-power',
      }) ?? canvas.getContext('experimental-webgl')

    if (!gl) {
      giveUp('WebGL is unavailable on this device')
      return undefined
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vs || !fs) {
      giveUp('shader failed to compile')
      return undefined
    }

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      giveUp(`program failed to link: ${gl.getProgramInfoLog(program)}`)
      return undefined
    }

    gl.useProgram(program)

    // One full-viewport triangle pair.
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    const aPosition = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    const uResolution = gl.getUniformLocation(program, 'uResolution')
    const uTime = gl.getUniformLocation(program, 'uTime')

    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    // Shading cost is per-pixel, so render below CSS resolution and let the
    // browser upscale — on a soft organic form the difference is invisible.
    const SCALE = 0.62
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr * SCALE))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr * SCALE))
      if (canvas.width === w && canvas.height === h) return
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uResolution, w, h)
    }

    const draw = (seconds) => {
      gl.uniform1f(uTime, seconds)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    resize()

    let frame = 0
    let onScreen = true
    let tabVisible = !document.hidden
    const start = performance.now()

    const loop = () => {
      if (gl.isContextLost()) {
        giveUp('WebGL context was lost')
        return
      }
      frame = requestAnimationFrame(loop)
      if (!onScreen || !tabVisible) return
      draw((performance.now() - start) / 1000)
    }

    if (reducedMotion) {
      draw(2.4) // a single, still frame — the form is present, nothing moves
    } else {
      frame = requestAnimationFrame(loop)
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
      if (reducedMotion) draw(2.4)
    })
    resizeObserver.observe(canvas)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
      },
      { threshold: 0 },
    )
    intersectionObserver.observe(canvas)

    const onVisibility = () => {
      tabVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibility)

    const onContextLost = (event) => {
      event.preventDefault()
      cancelAnimationFrame(frame)
      giveUp('WebGL context was lost')
    }
    canvas.addEventListener('webglcontextlost', onContextLost)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
