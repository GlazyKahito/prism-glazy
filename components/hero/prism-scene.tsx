"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  PerformanceMonitor,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { BEAM_IN_ANGLE, FAN_ANGLE, FAN_SPREAD } from "@/lib/beam";
import { getSceneLevel } from "@/lib/intro";

type SceneProps = {
  /** Continuous motion (rotation, drift, pointer tilt). Off for reduced motion. */
  animate: boolean;
  onReady: () => void;
};

type PrismSceneProps = SceneProps & {
  /** False while the hero is off screen: rendering stops entirely. */
  active: boolean;
};

const GLASS_BACKGROUND = new THREE.Color("#07070c");

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

function roundedTriangle(radius: number, corner: number) {
  const points = [0, 1, 2].map((i) => {
    const angle = Math.PI / 2 + (i * Math.PI * 2) / 3;
    return new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius);
  });

  const shape = new THREE.Shape();
  points.forEach((point, i) => {
    const prev = points[(i + 2) % 3];
    const next = points[(i + 1) % 3];
    const a = point.clone().add(prev.clone().sub(point).setLength(corner));
    const b = point.clone().add(next.clone().sub(point).setLength(corner));
    if (i === 0) shape.moveTo(a.x, a.y);
    else shape.lineTo(a.x, a.y);
    shape.quadraticCurveTo(point.x, point.y, b.x, b.y);
  });
  shape.closePath();
  return shape;
}

function usePrismGeometry() {
  return useMemo(() => {
    const extruded = new THREE.ExtrudeGeometry(roundedTriangle(1, 0.2), {
      depth: 0.9,
      bevelEnabled: true,
      bevelThickness: 0.16,
      bevelSize: 0.11,
      bevelSegments: 10,
      curveSegments: 18,
    });
    extruded.center();
    extruded.deleteAttribute("normal");
    extruded.deleteAttribute("uv");
    const smooth = mergeVertices(extruded, 1e-4);
    smooth.computeVertexNormals();
    extruded.dispose();
    return smooth;
  }, []);
}

/** A plane whose width grows along its length: the dispersed spectrum. */
function useFanGeometry(length: number, start: number, spread: number) {
  return useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1, 1, 64, 24);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const u = position.getX(i) + 0.5;
      const v = position.getY(i);
      const width = start + 2 * Math.tan(spread) * u * length;
      position.setXYZ(i, u * length, v * width, 0);
    }
    position.needsUpdate = true;
    return geometry;
  }, [length, start, spread]);
}

function useBeamGeometry() {
  return useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 1);
    geometry.translate(-0.5, 0, 0);
    return geometry;
  }, []);
}

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFragment = /* glsl */ `
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float d = abs(vUv.y - 0.5) * 2.0;
    float core = exp(-d * d * 140.0);
    float halo = exp(-d * d * 6.0) * 0.22;
    // Bright where it meets the glass, dissolving into the dark behind it.
    float along = pow(vUv.x, 2.6);
    float flicker = 0.95 + 0.05 * sin(uTime * 1.6 + vUv.x * 24.0);
    float a = (core + halo) * along * flicker * uOpacity;
    gl_FragColor = vec4(vec3(1.0, 0.985, 0.965), a);
  }
`;

const fanFragment = /* glsl */ `
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vUv;

  vec3 spectrum(float t) {
    vec3 c0 = vec3(1.00, 0.36, 0.49);
    vec3 c1 = vec3(1.00, 0.62, 0.32);
    vec3 c2 = vec3(1.00, 0.87, 0.40);
    vec3 c3 = vec3(0.43, 0.95, 0.69);
    vec3 c4 = vec3(0.33, 0.83, 1.00);
    vec3 c5 = vec3(0.48, 0.53, 1.00);
    vec3 c6 = vec3(0.74, 0.54, 1.00);
    float s = clamp(t, 0.0, 1.0) * 6.0;
    vec3 c = mix(c0, c1, clamp(s, 0.0, 1.0));
    c = mix(c, c2, clamp(s - 1.0, 0.0, 1.0));
    c = mix(c, c3, clamp(s - 2.0, 0.0, 1.0));
    c = mix(c, c4, clamp(s - 3.0, 0.0, 1.0));
    c = mix(c, c5, clamp(s - 4.0, 0.0, 1.0));
    c = mix(c, c6, clamp(s - 5.0, 0.0, 1.0));
    return c;
  }

  void main() {
    float t = 1.0 - vUv.y;
    float u = vUv.x;
    vec3 color = spectrum(t);
    // Close to the prism the light is still nearly white.
    color = mix(vec3(1.0), color, smoothstep(0.0, 0.16, u));
    float edge = smoothstep(0.0, 0.14, vUv.y) * smoothstep(1.0, 0.86, vUv.y);
    float fade = smoothstep(0.0, 0.02, u) * pow(1.0 - u, 1.5);
    float bands = 0.8 + 0.2 * cos(t * 6.0 * 6.2831853);
    float shimmer = 0.9 + 0.1 * sin(uTime * 0.8 - u * 10.0 + t * 3.0);
    float a = edge * fade * bands * shimmer * uOpacity;
    gl_FragColor = vec4(color, a);
  }
`;

const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = pow(max(0.0, 1.0 - d), 2.4) * uOpacity;
    gl_FragColor = vec4(uColor, a);
  }
`;

type Uniforms = {
  uOpacity: { value: number };
  uTime: { value: number };
  uColor: { value: THREE.Color };
};

function useUniforms(color = "#ffffff") {
  const [uniforms] = useState<Uniforms>(() => ({
    uOpacity: { value: 0 },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
  }));
  return uniforms;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/* ------------------------------------------------------------------ */
/* Scene pieces                                                        */
/* ------------------------------------------------------------------ */

function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

function Light({ animate }: { animate: boolean }) {
  const beamGeometry = useBeamGeometry();
  const fanGeometry = useFanGeometry(11, 0.1, FAN_SPREAD);
  const beam = useRef<THREE.ShaderMaterial>(null);
  const fan = useRef<THREE.ShaderMaterial>(null);
  const halo = useRef<THREE.ShaderMaterial>(null);
  const core = useRef<THREE.ShaderMaterial>(null);
  const beamUniforms = useUniforms();
  const fanUniforms = useUniforms();
  const haloUniforms = useUniforms("#8f7dff");
  const coreUniforms = useUniforms("#fff6ea");

  useFrame((state) => {
    const level = smooth(getSceneLevel());
    const time = animate ? state.clock.elapsedTime : 0;
    if (beam.current) {
      beam.current.uniforms.uOpacity.value = 0.95 * level;
      beam.current.uniforms.uTime.value = time;
    }
    if (fan.current) {
      fan.current.uniforms.uOpacity.value = 0.78 * level;
      fan.current.uniforms.uTime.value = time;
    }
    // The glow inside the glass is already on while the intro's beam lands on it.
    if (halo.current) halo.current.uniforms.uOpacity.value = 0.34 * (0.5 + 0.5 * level);
    if (core.current) core.current.uniforms.uOpacity.value = 0.9 * (0.7 + 0.3 * level);
  });

  const additive = {
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    vertexShader,
  } as const;

  return (
    <group>
      <mesh position={[0, 0, -2.4]} scale={7}>
        <planeGeometry />
        <shaderMaterial
          ref={halo}
          {...additive}
          uniforms={haloUniforms}
          fragmentShader={glowFragment}
        />
      </mesh>
      <mesh position={[0, 0, -0.6]} scale={1.3}>
        <planeGeometry />
        <shaderMaterial
          ref={core}
          {...additive}
          uniforms={coreUniforms}
          fragmentShader={glowFragment}
        />
      </mesh>
      <mesh
        geometry={beamGeometry}
        rotation={[0, 0, BEAM_IN_ANGLE]}
        scale={[4.2, 0.5, 1]}
      >
        <shaderMaterial
          ref={beam}
          {...additive}
          uniforms={beamUniforms}
          fragmentShader={beamFragment}
        />
      </mesh>
      <mesh geometry={fanGeometry} rotation={[0, 0, -FAN_ANGLE]}>
        <shaderMaterial
          ref={fan}
          {...additive}
          side={THREE.DoubleSide}
          uniforms={fanUniforms}
          fragmentShader={fanFragment}
        />
      </mesh>
    </group>
  );
}

function Prism({ animate }: { animate: boolean }) {
  const geometry = usePrismGeometry();
  const pointer = usePointer();
  const presence = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const level = smooth(getSceneLevel());
    if (presence.current) {
      presence.current.scale.setScalar(0.62 + 0.38 * level);
    }
    if (!animate) return;
    if (spin.current) {
      spin.current.rotation.y += dt * 0.2;
      spin.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
    }
    if (tilt.current) {
      const { damp } = THREE.MathUtils;
      tilt.current.rotation.x = damp(tilt.current.rotation.x, pointer.current.y * 0.3, 2.5, dt);
      tilt.current.rotation.y = damp(tilt.current.rotation.y, pointer.current.x * 0.45, 2.5, dt);
    }
  });

  return (
    <group ref={presence}>
      <group ref={tilt}>
        <group rotation={[0.2, 0, -0.04]}>
          <mesh ref={spin} geometry={geometry} rotation={[0, -0.62, 0]}>
            <MeshTransmissionMaterial
              background={GLASS_BACKGROUND}
              backside
              backsideThickness={0.35}
              samples={6}
              resolution={768}
              backsideResolution={384}
              transmission={1}
              roughness={0.03}
              thickness={1.15}
              ior={1.42}
              chromaticAberration={0.85}
              anisotropicBlur={0.18}
              distortion={0.22}
              distortionScale={0.35}
              temporalDistortion={animate ? 0.06 : 0}
              clearcoat={1}
              clearcoatRoughness={0.05}
              attenuationDistance={3}
              attenuationColor="#efeaff"
              color="#f6f4ff"
              envMapIntensity={1.1}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer
        form="rect"
        intensity={3.2}
        position={[0, 5, -1]}
        rotation-x={Math.PI / 2}
        scale={[12, 1.4, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.4}
        position={[-6, 0.5, 1]}
        rotation-y={Math.PI / 2}
        scale={[1.2, 9, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2}
        position={[6, -0.5, 2]}
        rotation-y={-Math.PI / 2}
        scale={[1, 7, 1]}
      />
      <Lightformer
        form="ring"
        color="#b8a6ff"
        intensity={5}
        position={[2.5, 2.5, 6]}
        scale={2.6}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="circle"
        color="#7fdcff"
        intensity={3.4}
        position={[-3.5, -2.2, 5]}
        scale={1.8}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        color="#ffa3b4"
        intensity={1.6}
        position={[0, -5, 1]}
        rotation-x={-Math.PI / 2}
        scale={[10, 1, 1]}
      />
    </Environment>
  );
}

function Layout({ animate }: { animate: boolean }) {
  const viewport = useThree((state) => state.viewport);
  const width = useThree((state) => state.size.width);
  const wide = width >= 1024;
  const scale = wide
    ? Math.min(viewport.height * 0.24, viewport.width * 0.15)
    : Math.min(viewport.height * 0.255, viewport.width * 0.3);
  const x = wide ? viewport.width * 0.2 : 0;

  return (
    <group position={[x, 0, 0]}>
      <Light animate={animate} />
      <group scale={scale}>
        <Prism animate={animate} />
      </group>
      <Sparkles
        count={wide ? 46 : 26}
        scale={[wide ? 12 : 6, 4.5, 3]}
        size={2.2}
        speed={animate ? 0.22 : 0}
        opacity={0.55}
        noise={0.6}
        color="#dcd6ff"
      />
    </group>
  );
}

/** Reports readiness after a few real frames (shaders compiled, glass sampled). */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current >= 3) {
      done.current = true;
      onReady();
    }
  });
  return null;
}

/** With continuous rendering off, nudge a handful of frames so the still is complete. */
function SettleFrames({ enabled }: { enabled: boolean }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (!enabled) return;
    let count = 0;
    const id = window.setInterval(() => {
      invalidate();
      count += 1;
      if (count > 12) window.clearInterval(id);
    }, 80);
    return () => window.clearInterval(id);
  }, [enabled, invalidate]);
  return null;
}

export function PrismScene({ animate, active, onReady }: PrismSceneProps) {
  const [maxDpr, setMaxDpr] = useState(1.75);

  return (
    <Canvas
      dpr={[1, maxDpr]}
      frameloop={active ? (animate ? "always" : "demand") : "never"}
      camera={{ position: [0, 0, 8], fov: 35, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
      <Studio />
      <Layout animate={animate} />
      <ReadySignal onReady={onReady} />
      <SettleFrames enabled={active && !animate} />
    </Canvas>
  );
}
