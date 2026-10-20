'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NebulaBackgroundProps {
  isDark?: boolean;
}

const nebulaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform float uTime;
  uniform float uThemeDark;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float dist = length(p);

    // Multi-layered organic aurora/nebula glow
    float n1 = sin(p.x * 2.5 + uTime * 0.2) * cos(p.y * 2.0 + uTime * 0.15) * 0.5 + 0.5;
    float n2 = sin(p.x * 1.5 - uTime * 0.1) * cos(p.y * 3.0 + uTime * 0.25) * 0.5 + 0.5;
    float nebulaPulse = (n1 * 0.6 + n2 * 0.4) * smoothstep(1.4, 0.2, dist);

    // Dark Mode Palette ("Forest Night")
    vec3 darkBg = vec3(0.039, 0.078, 0.067); // #0A1411
    vec3 darkNebula = vec3(0.063, 0.220, 0.165); // Subtle Emerald glow
    vec3 darkCyan = vec3(0.04, 0.18, 0.22); // Subtle Cyan accent
    vec3 darkFinal = mix(darkBg, mix(darkNebula, darkCyan, n2), nebulaPulse * 0.45);

    // Light Mode Palette ("Paper & Forest")
    vec3 lightBg = vec3(0.968, 0.968, 0.957); // #F7F7F4
    vec3 lightMist = vec3(0.91, 0.94, 0.92); // #EEF1EC
    vec3 lightGreen = vec3(0.85, 0.92, 0.88); // Soft sage wash
    vec3 lightFinal = mix(lightBg, mix(lightMist, lightGreen, n1), nebulaPulse * 0.35);

    vec3 finalColor = mix(lightFinal, darkFinal, uThemeDark);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function NebulaBackground({ isDark = true }: NebulaBackgroundProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uThemeDark: { value: isDark ? 1.0 : 0.0 },
    }),
    []
  );

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uThemeDark.value = isDark ? 1.0 : 0.0;
    }
  }, [isDark]);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh renderOrder={-100}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
