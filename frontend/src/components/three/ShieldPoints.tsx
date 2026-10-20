'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShieldPointsProps {
  progress: number; // 0.0 (nebula stars) to 1.0 (shield formed)
  isDark?: boolean;
  particleCount?: number;
}

// Generate crystalline constellation points along shield silhouette, faceted ribs, and orbit rings
function generateConstellationPoints(count: number = 18000): {
  positions: Float32Array;
  targets: Float32Array;
  delays: Float32Array;
  sizes: Float32Array;
} {
  const positions = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const sizes = new Float32Array(count);

  // Key shield vertices for faceted ribs
  const topPeak = [0, 2.2, 0.3];
  const topL = [-1.7, 1.9, 0];
  const topR = [1.7, 1.9, 0];
  const midL = [-1.7, 0.2, 0];
  const midR = [1.7, 0.2, 0];
  const bottomTip = [0, -2.2, 0];
  const centerSpine = [0, 0.3, 0.6];

  // Helper to interpolate between two 3D points with noise
  const linePoint = (p1: number[], p2: number[], t: number, jitter = 0.04) => {
    return [
      p1[0] + (p2[0] - p1[0]) * t + (Math.random() - 0.5) * jitter,
      p1[1] + (p2[1] - p1[1]) * t + (Math.random() - 0.5) * jitter,
      p1[2] + (p2[2] - p1[2]) * t + (Math.random() - 0.5) * jitter,
    ];
  };

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 1. Initial Nebula Star Field (wide 3D space)
    positions[i3] = (Math.random() - 0.5) * 28;
    positions[i3 + 1] = (Math.random() - 0.5) * 20;
    positions[i3 + 2] = -14 + Math.random() * 22;

    delays[i] = Math.random();
    // Subtle particle sizes: 0.9 to 2.4
    sizes[i] = Math.random() * 1.5 + 0.9;

    // 2. Partition target points into architectural segments
    const category = Math.random();
    let pt: number[] = [0, 0, 0];

    if (category < 0.40) {
      // Outer Shield Perimeter Contour (t = 0 to 1)
      const t = Math.random();
      if (t < 0.2) {
        // Top edge: topL to topPeak
        pt = linePoint(topL, topPeak, t / 0.2);
      } else if (t < 0.4) {
        // Top edge: topPeak to topR
        pt = linePoint(topPeak, topR, (t - 0.2) / 0.2);
      } else if (t < 0.6) {
        // Upper left to mid left
        pt = linePoint(topL, midL, (t - 0.4) / 0.2);
      } else if (t < 0.8) {
        // Upper right to mid right
        pt = linePoint(topR, midR, (t - 0.6) / 0.2);
      } else if (t < 0.9) {
        // Mid left curve to bottom tip
        const sub = (t - 0.8) / 0.1;
        pt = linePoint(midL, bottomTip, sub);
      } else {
        // Mid right curve to bottom tip
        const sub = (t - 0.9) / 0.1;
        pt = linePoint(midR, bottomTip, sub);
      }
    } else if (category < 0.65) {
      // Inner Faceted Ribs & Spine (radiating from centerSpine to perimeter vertices)
      const subCat = Math.random();
      const t = Math.random();
      if (subCat < 0.2) {
        pt = linePoint(centerSpine, topPeak, t);
      } else if (subCat < 0.4) {
        pt = linePoint(centerSpine, topL, t);
      } else if (subCat < 0.6) {
        pt = linePoint(centerSpine, topR, t);
      } else if (subCat < 0.8) {
        pt = linePoint(centerSpine, midL, t);
      } else if (subCat < 0.9) {
        pt = linePoint(centerSpine, midR, t);
      } else {
        pt = linePoint(centerSpine, bottomTip, t);
      }
    } else if (category < 0.82) {
      // Orbit Ring 1 (Tilted Celestial Ring, radius 2.3)
      const angle = Math.random() * Math.PI * 2;
      const r = 2.2 + (Math.random() - 0.5) * 0.08;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      // Tilt around X by 1.1 rad
      const y = z * Math.sin(0.4);
      pt = [x, y, z * Math.cos(0.4)];
      sizes[i] = 1.1;
    } else if (category < 0.92) {
      // Orbit Ring 2 (Counter-tilted Celestial Ring, radius 2.6)
      const angle = Math.random() * Math.PI * 2;
      const r = 2.5 + (Math.random() - 0.5) * 0.08;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      // Tilt
      const y = -z * Math.sin(0.5);
      pt = [x, y, z * Math.cos(0.5)];
      sizes[i] = 1.0;
    } else {
      // Ambient Floating Star Dust (gentle depth field)
      pt = [
        (Math.random() - 0.5) * 7.5,
        (Math.random() - 0.5) * 5.5,
        -2.5 + Math.random() * 4.0,
      ];
      sizes[i] = 0.8;
    }

    targets[i3] = pt[0];
    targets[i3 + 1] = pt[1];
    targets[i3 + 2] = pt[2];
  }

  return { positions, targets, delays, sizes };
}

const vertexShader = `
  uniform float uProgress;
  uniform float uTime;
  uniform float uThemeDark;
  uniform vec3 uColorDark;
  uniform vec3 uColorLight;

  attribute vec3 aTarget;
  attribute float aDelay;
  attribute float aSize;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Per-particle staggered convergence progress
    float p = clamp((uProgress - aDelay * 0.35) / 0.65, 0.0, 1.0);
    // Smooth power-3 ease-out
    float t = 1.0 - pow(1.0 - p, 3.0);

    vec3 currentPos = mix(position, aTarget, t);

    // Subtle breathing / sparkle motion when formed
    if (t > 0.95) {
      currentPos.x += sin(uTime * 1.5 + currentPos.y * 2.0) * 0.015;
      currentPos.y += cos(uTime * 1.2 + currentPos.x * 2.0) * 0.015;
      currentPos.z += sin(uTime * 1.1 + currentPos.x * 1.5) * 0.015;
    } else {
      // Gentle cosmic star drift before convergence
      currentPos.x += sin(uTime * 0.3 + position.z * 0.3) * 0.04;
      currentPos.y += cos(uTime * 0.25 + position.x * 0.3) * 0.04;
    }

    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Crisp point size (1.2px to 3.5px on screen)
    gl_PointSize = (aSize * (46.0 / -mvPosition.z));

    // Dynamic theme color
    vec3 col = mix(uColorLight, uColorDark, uThemeDark);
    // Sparkle accent on highlights
    if (aSize > 2.0) {
      col += vec3(0.08, 0.14, 0.08);
    }

    vColor = col;
    // Transparent starry opacity (no blowout)
    vAlpha = mix(0.35, 0.75, t);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    // Soft gaussian dot profile
    float alpha = smoothstep(0.5, 0.12, dist) * vAlpha * 0.75;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export function ShieldPoints({
  progress = 1.0,
  isDark = true,
  particleCount = 18000,
}: ShieldPointsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, targets, delays, sizes } = useMemo(
    () => generateConstellationPoints(particleCount),
    [particleCount]
  );

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uThemeDark: { value: isDark ? 1.0 : 0.0 },
      uColorDark: { value: new THREE.Color('#34D399') }, // Emerald forest green
      uColorLight: { value: new THREE.Color('#0B6E4F') }, // Deep rich forest green
    }),
    []
  );

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uThemeDark.value = isDark ? 1.0 : 0.0;
      materialRef.current.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
      materialRef.current.needsUpdate = true;
    }
  }, [isDark]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uProgress.value,
      progress,
      delta * 4.0
    );

    if (pointsRef.current) {
      // Gentle idle auto-rotation
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
      pointsRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.25) * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTarget"
          count={targets.length / 3}
          array={targets}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aDelay"
          count={delays.length}
          array={delays}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}
