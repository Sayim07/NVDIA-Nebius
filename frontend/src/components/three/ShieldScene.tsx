'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShieldSceneProps {
  isDark?: boolean;
  isZooming?: boolean;
}

// Low-poly Icosahedron Core + Wireframe Edges
function ShieldCore({ isDark, isZooming }: { isDark: boolean; isZooming: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);

  const colors = useMemo(() => {
    if (isDark) {
      return {
        face: '#16382D',
        emissive: '#10B981',
        edge: '#34D399',
        roughness: 0.25,
        metalness: 0.1,
        transmission: 0.6,
        opacity: 0.88,
      };
    } else {
      return {
        face: '#E2EBE5',
        emissive: '#0B6E4F',
        edge: '#0B6E4F',
        roughness: 0.35,
        metalness: 0.05,
        transmission: 0.4,
        opacity: 0.82,
      };
    }
  }, [isDark]);

  useFrame((state, delta) => {
    if (!meshRef.current || !edgesRef.current) return;
    const speed = isZooming ? 4.0 : 0.4;
    meshRef.current.rotation.y += delta * speed;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;

    edgesRef.current.rotation.y = meshRef.current.rotation.y;
    edgesRef.current.rotation.x = meshRef.current.rotation.x;

    if (isZooming) {
      meshRef.current.scale.lerp(new THREE.Vector3(12, 12, 12), delta * 4);
      edgesRef.current.scale.lerp(new THREE.Vector3(12, 12, 12), delta * 4);
    }
  });

  // Create icosahedron geometry
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.4, 0), []);
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  return (
    <group>
      {/* Translucent low-poly faces */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color={colors.face}
          emissive={colors.emissive}
          emissiveIntensity={isDark ? 0.35 : 0.15}
          roughness={colors.roughness}
          metalness={colors.metalness}
          transmission={colors.transmission}
          transparent
          opacity={colors.opacity}
          flatShading
          depthWrite={false}
        />
      </mesh>

      {/* Wireframe glowing edges */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial
          color={colors.edge}
          transparent
          opacity={isDark ? 0.9 : 0.75}
          linewidth={1.5}
        />
      </lineSegments>
    </group>
  );
}

// 2 Orbit Rings rotating at different speeds
function OrbitRings({ isDark }: { isDark: boolean }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const ring1Color = isDark ? '#76B900' : '#76B900'; // highlight
  const ring2Color = isDark ? '#38BDF8' : '#2563EB'; // info

  useFrame((_, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.35;
      ring1Ref.current.rotation.x += delta * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.25;
      ring2Ref.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Inner Highlight Ring */}
      <mesh ref={ring1Ref} rotation={[1.1, 0.4, 0]}>
        <torusGeometry args={[2.2, 0.012, 16, 90]} />
        <meshBasicMaterial
          color={ring1Color}
          transparent
          opacity={isDark ? 0.55 : 0.45}
        />
      </mesh>

      {/* Outer Info Ring */}
      <mesh ref={ring2Ref} rotation={[-0.8, -0.5, 0.3]}>
        <torusGeometry args={[2.65, 0.01, 16, 90]} />
        <meshBasicMaterial
          color={ring2Color}
          transparent
          opacity={isDark ? 0.45 : 0.35}
        />
      </mesh>
    </group>
  );
}

// Safe Green Particles flowing through the shield
function SafeParticles({ isDark, count = 45 }: { isDark: boolean; count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initial particle state
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5,
      z: -4 + Math.random() * 8,
      speedZ: 0.8 + Math.random() * 1.4,
      scale: 0.04 + Math.random() * 0.04,
    }));
  }, [count]);

  const color = useMemo(
    () => new THREE.Color(isDark ? '#34D399' : '#0B6E4F'),
    [isDark]
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      p.z += p.speedZ * delta;
      // Loop back
      if (p.z > 4) {
        p.z = -4;
        p.x = (Math.random() - 0.5) * 5;
        p.y = (Math.random() - 0.5) * 5;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={isDark ? 0.75 : 0.6} />
    </instancedMesh>
  );
}

// Red "Threat" particles coming from outside and bursting/dissolving when hitting shield perimeter
function ThreatParticles({ isDark, count = 8 }: { isDark: boolean; count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const threats = useMemo(() => {
    return Array.from({ length: count }, () => {
      // Spawn on sphere radius 4.5
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const r = 4.0 + Math.random() * 1.5;
      return {
        originX: r * Math.cos(phi) * Math.sin(theta),
        originY: r * Math.sin(phi),
        originZ: r * Math.cos(phi) * Math.cos(theta),
        x: 0,
        y: 0,
        z: 0,
        progress: Math.random(), // 0 to 1
        speed: 0.35 + Math.random() * 0.3,
        scale: 0.07,
      };
    });
  }, [count]);

  const color = useMemo(() => new THREE.Color('#F87171'), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    threats.forEach((t, i) => {
      t.progress += delta * t.speed;

      // When progress approaches 1 (shield surface ~1.4 radius), scale down and dissolve
      if (t.progress >= 1) {
        // Reset threat particle
        t.progress = 0;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        const r = 4.0 + Math.random() * 1.5;
        t.originX = r * Math.cos(phi) * Math.sin(theta);
        t.originY = r * Math.sin(phi);
        t.originZ = r * Math.cos(phi) * Math.cos(theta);
      }

      // Linear interpolation from origin to shield radius (target at 1.4 from center)
      const currentR = 4.0 * (1 - t.progress) + 1.4 * t.progress;
      const dirLength = Math.hypot(t.originX, t.originY, t.originZ) || 1;
      const normX = t.originX / dirLength;
      const normY = t.originY / dirLength;
      const normZ = t.originZ / dirLength;

      t.x = normX * currentR;
      t.y = normY * currentR;
      t.z = normZ * currentR;

      // Dissolve effect: if progress > 0.8, scale down rapidly
      let currentScale = t.scale;
      if (t.progress > 0.8) {
        currentScale = t.scale * (1 - (t.progress - 0.8) / 0.2);
      }

      dummy.position.set(t.x, t.y, t.z);
      dummy.scale.set(currentScale, currentScale, currentScale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={isDark ? 0.85 : 0.75} />
    </instancedMesh>
  );
}

// Main Interactive Group with gentle mouse parallax & idle float
function SceneGroup({ isDark, isZooming }: { isDark: boolean; isZooming: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotation.current = {
        x: ny * 0.18,
        y: nx * 0.25,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Gentle float
    const floatY = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, delta * 3);

    // Parallax lerp
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      delta * 2.5
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y,
      delta * 2.5
    );
  });

  return (
    <group ref={groupRef}>
      <ShieldCore isDark={isDark} isZooming={isZooming} />
      <OrbitRings isDark={isDark} />
      <SafeParticles isDark={isDark} />
      <ThreatParticles isDark={isDark} />
    </group>
  );
}

export default function ShieldScene({ isDark = true, isZooming = false }: ShieldSceneProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (prefersReducedMotion) {
    // Static fallback for reduced motion
    return (
      <div className="w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-48 h-48 text-primary opacity-60 animate-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M50 10 L85 24 V52 C85 72 50 90 50 90 C50 90 15 72 15 52 V24 Z" />
        </svg>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5.8], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="w-full h-full pointer-events-none"
    >
      <ambientLight intensity={isDark ? 0.6 : 0.85} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={isDark ? 1.4 : 1.1}
        color={isDark ? '#E9F1ED' : '#FFFFFF'}
      />
      <pointLight
        position={[-3, -3, 2]}
        intensity={isDark ? 1.0 : 0.6}
        color={isDark ? '#34D399' : '#0B6E4F'}
      />
      <SceneGroup isDark={isDark} isZooming={isZooming} />
    </Canvas>
  );
}
