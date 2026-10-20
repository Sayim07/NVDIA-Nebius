'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NebulaBackground } from './NebulaBackground';

interface CinematicSceneProps {
  progress?: number; // 0.0 = nebula stars, 1.0 = shield formed
  isFlight?: boolean; // Star flight stage
  isDark?: boolean;
  isZooming?: boolean;
}

// Crisp, razor-sharp circular point sprite with zero blur
function createSharpDotTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 64, 64);

  // Draw a crisp solid white circle with subtle 1px anti-aliased perimeter (no blurry gradient)
  ctx.beginPath();
  ctx.arc(32, 32, 28, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

// 1. Sharp Glowing 3D Shield (Wireframe Struts + Crystal Core from Image 1)
function SharpGlowShield({
  progress = 1.0,
  isDark = true,
  isZooming = false,
}: {
  progress: number;
  isDark: boolean;
  isZooming: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const strutsMeshRef = useRef<THREE.InstancedMesh>(null);

  // 3D Chiseled Shield Vertices
  const vertices = useMemo(() => {
    return {
      // Front Vertices (proud chisel)
      topL: new THREE.Vector3(-1.25, 1.25, 0.35),
      topC: new THREE.Vector3(0.0, 1.45, 0.45),
      topR: new THREE.Vector3(1.25, 1.25, 0.35),
      midL: new THREE.Vector3(-1.25, 0.1, 0.35),
      midC: new THREE.Vector3(0.0, 0.22, 0.62), // Raised central facet apex
      midR: new THREE.Vector3(1.25, 0.1, 0.35),
      botC: new THREE.Vector3(0.0, -1.85, 0.32), // Sharp bottom tip

      // Back Vertices (3D prism depth)
      bkTopL: new THREE.Vector3(-1.05, 1.15, -0.32),
      bkTopC: new THREE.Vector3(0.0, 1.32, -0.42),
      bkTopR: new THREE.Vector3(1.05, 1.15, -0.32),
      bkMidL: new THREE.Vector3(-1.05, 0.08, -0.32),
      bkMidC: new THREE.Vector3(0.0, 0.18, -0.52),
      bkMidR: new THREE.Vector3(1.05, 0.08, -0.32),
      bkBotC: new THREE.Vector3(0.0, -1.68, -0.3),
    };
  }, []);

  // Strut pairs for the wireframe structure
  const strutPairs = useMemo(() => {
    const v = vertices;
    return [
      // Front Perimeter
      [v.topL, v.topC],
      [v.topC, v.topR],
      [v.topR, v.midR],
      [v.midR, v.botC],
      [v.botC, v.midL],
      [v.midL, v.topL],

      // Front Internal Struts (Center spine + Diagonals)
      [v.topC, v.midC],
      [v.midC, v.botC],
      [v.midL, v.midC],
      [v.midC, v.midR],
      [v.topL, v.midC],
      [v.topR, v.midC],

      // Back Perimeter
      [v.bkTopL, v.bkTopC],
      [v.bkTopC, v.bkTopR],
      [v.bkTopR, v.bkMidR],
      [v.bkMidR, v.bkBotC],
      [v.bkBotC, v.bkMidL],
      [v.bkMidL, v.bkTopL],

      // Back Internal Struts
      [v.bkTopC, v.bkMidC],
      [v.bkMidC, v.bkBotC],
      [v.bkMidL, v.bkMidC],
      [v.bkMidC, v.bkMidR],

      // Depth Struts (Front to Back)
      [v.topL, v.bkTopL],
      [v.topC, v.bkTopC],
      [v.topR, v.bkTopR],
      [v.midL, v.bkMidL],
      [v.midC, v.bkMidC],
      [v.midR, v.bkMidR],
      [v.botC, v.bkBotC],
    ];
  }, [vertices]);

  // Build Solid Faceted Crystal Body Geometry
  const crystalGeometry = useMemo(() => {
    const v = vertices;
    const geom = new THREE.BufferGeometry();

    const positions: number[] = [];

    const addTri = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3) => {
      positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
    };

    // Front Faces
    addTri(v.topL, v.topC, v.midC);
    addTri(v.topC, v.topR, v.midC);
    addTri(v.topL, v.midC, v.midL);
    addTri(v.topR, v.midR, v.midC);
    addTri(v.midL, v.midC, v.botC);
    addTri(v.midC, v.midR, v.botC);

    // Back Faces
    addTri(v.bkTopC, v.bkTopL, v.bkMidC);
    addTri(v.bkTopR, v.bkTopC, v.bkMidC);
    addTri(v.bkMidC, v.bkTopL, v.bkMidL);
    addTri(v.bkMidR, v.bkTopR, v.bkMidC);
    addTri(v.bkMidC, v.bkMidL, v.bkBotC);
    addTri(v.bkMidR, v.bkMidC, v.bkBotC);

    // Side Rim Faces
    const addQuad = (
      p1: THREE.Vector3,
      p2: THREE.Vector3,
      p3: THREE.Vector3,
      p4: THREE.Vector3
    ) => {
      addTri(p1, p2, p3);
      addTri(p1, p3, p4);
    };

    addQuad(v.topL, v.topC, v.bkTopC, v.bkTopL);
    addQuad(v.topC, v.topR, v.bkTopR, v.bkTopC);
    addQuad(v.topR, v.midR, v.bkMidR, v.bkTopR);
    addQuad(v.midR, v.botC, v.bkBotC, v.bkMidR);
    addQuad(v.botC, v.midL, v.bkMidL, v.bkBotC);
    addQuad(v.midL, v.topL, v.bkTopL, v.bkMidL);

    geom.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geom.computeVertexNormals();
    return geom;
  }, [vertices]);

  // Laser-sharp line segments
  const linesGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions: number[] = [];

    strutPairs.forEach(([p1, p2]) => {
      positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    });

    geom.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geom;
  }, [strutPairs]);

  // Cylinder struts
  const cylinderGeom = useMemo(
    () => new THREE.CylinderGeometry(0.016, 0.016, 1, 8),
    []
  );

  useEffect(() => {
    if (!strutsMeshRef.current) return;
    const dummy = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);

    strutPairs.forEach(([p1, p2], idx) => {
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

      dummy.position.copy(mid);
      dummy.scale.set(1, len, 1);

      const orientation = new THREE.Quaternion().setFromUnitVectors(
        up,
        dir.clone().normalize()
      );
      dummy.quaternion.copy(orientation);
      dummy.updateMatrix();

      strutsMeshRef.current!.setMatrixAt(idx, dummy.matrix);
    });

    strutsMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [strutPairs]);

  // Colors & Styling
  const style = useMemo(() => {
    if (isDark) {
      return {
        strutColor: '#00FFE0', // Radiant Cyan
        strutEmissive: '#00F5D4',
        lineColor: '#FFFFFF', // Razor-sharp white line highlight
        lineOpacity: 1.0,
        crystalColor: '#032620',
        crystalEmissive: '#00F5D4',
        crystalEmissiveIntensity: 0.3,
        crystalOpacity: 0.7,
      };
    } else {
      return {
        strutColor: '#059669', // Sharp Forest Emerald
        strutEmissive: '#047857',
        lineColor: '#064E3B', // High contrast edge line
        lineOpacity: 0.95,
        crystalColor: '#DCFCE7',
        crystalEmissive: '#10B981',
        crystalEmissiveIntensity: 0.2,
        crystalOpacity: 0.6,
      };
    }
  }, [isDark]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const speed = isZooming ? 4.5 : 0.4;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.6) * 0.08;

    const targetScale = isZooming ? 12 : Math.max(0.001, progress);
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 4
    );
  });

  if (progress < 0.05) return null;

  return (
    <group ref={groupRef}>
      {/* 1. Translucent Faceted Crystal Body */}
      <mesh
        ref={coreMeshRef}
        geometry={crystalGeometry}
        frustumCulled={false}
      >
        <meshPhysicalMaterial
          color={style.crystalColor}
          emissive={style.crystalEmissive}
          emissiveIntensity={style.crystalEmissiveIntensity}
          roughness={0.15}
          metalness={0.1}
          transmission={0.72}
          transparent
          opacity={style.crystalOpacity * progress}
          flatShading
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. 3D Glowing Neon Struts */}
      <instancedMesh
        ref={strutsMeshRef}
        args={[cylinderGeom, undefined, strutPairs.length]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color={style.strutColor}
          emissive={style.strutEmissive}
          emissiveIntensity={isDark ? 2.4 : 1.2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={progress}
        />
      </instancedMesh>

      {/* 3. Laser-Sharp Edge Lines */}
      <lineSegments
        ref={linesRef}
        geometry={linesGeometry}
        frustumCulled={false}
      >
        <lineBasicMaterial
          color={style.lineColor}
          transparent
          opacity={style.lineOpacity * progress}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

// 2. Crisp, Pin-Sharp Glowing Particle Rings (No Blur & Zero Clipping)
function SharpParticleRings({
  progress = 1.0,
  isDark = true,
}: {
  progress: number;
  isDark: boolean;
}) {
  const ring1Ref = useRef<THREE.Points>(null);
  const ring2Ref = useRef<THREE.Points>(null);
  const sharpDotTex = useMemo(() => createSharpDotTexture(), []);

  // Primary Ring: Tightly packed crisp particles along the orbit
  const count1 = 550;
  const [positions1] = useMemo(() => {
    const pos = new Float32Array(count1 * 3);
    const radius = 2.35;

    for (let i = 0; i < count1; i++) {
      const angle = (i / count1) * Math.PI * 2;
      const jitterR = (Math.random() - 0.5) * 0.05;
      const jitterY = (Math.random() - 0.5) * 0.04;
      const r = radius + jitterR;

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = jitterY;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return [pos];
  }, [count1]);

  // Secondary Inclined Ring: Tight orbit
  const count2 = 360;
  const [positions2] = useMemo(() => {
    const pos = new Float32Array(count2 * 3);
    const radius = 2.75;

    for (let i = 0; i < count2; i++) {
      const angle = (i / count2) * Math.PI * 2;
      const jitterR = (Math.random() - 0.5) * 0.06;
      const jitterY = (Math.random() - 0.5) * 0.05;
      const r = radius + jitterR;

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = jitterY;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return [pos];
  }, [count2]);

  useFrame((_, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.35;
      ring1Ref.current.rotation.y += delta * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.22;
      ring2Ref.current.rotation.x -= delta * 0.15;
    }
  });

  if (progress < 0.1) return null;

  return (
    <group scale={[progress, progress, progress]}>
      {/* Primary Waist Ring (Tilted 68 deg) - renderOrder 10, depthTest false so it always draws cleanly in front */}
      <points
        ref={ring1Ref}
        rotation={[1.18, 0.3, 0]}
        renderOrder={10}
        frustumCulled={false}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions1, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={sharpDotTex}
          size={isDark ? 0.058 : 0.048}
          sizeAttenuation={true}
          color={isDark ? '#00FFE0' : '#0B6E4F'}
          transparent={true}
          opacity={isDark ? 0.98 : 0.85}
          depthTest={false}
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>

      {/* Secondary Outer Halo Ring - depthTest true for realistic 3D spatial interweaving */}
      <points
        ref={ring2Ref}
        rotation={[-0.8, -0.4, 0.4]}
        renderOrder={5}
        frustumCulled={false}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions2, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={sharpDotTex}
          size={isDark ? 0.048 : 0.04}
          sizeAttenuation={true}
          color={isDark ? '#76B900' : '#0284C7'}
          transparent={true}
          opacity={isDark ? 0.9 : 0.75}
          depthTest={true}
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>
    </group>
  );
}

// 3. Crisp, Pinpoint Stardust Particles (Background Stars - No Blur)
function SharpStardust({
  isDark = true,
  count = 180,
}: {
  isDark: boolean;
  count?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const sharpDotTex = useMemo(() => createSharpDotTexture(), []);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8.0;
      pos[i * 3 + 2] = -4.0 + Math.random() * 8.0;
      spd[i] = 0.3 + Math.random() * 0.7;
    }
    return [pos, spd];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta * 0.35;
      if (arr[i * 3 + 1] > 4.0) {
        arr[i * 3 + 1] = -4.0;
        arr[i * 3] = (Math.random() - 0.5) * 9.5;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sharpDotTex}
        size={isDark ? 0.038 : 0.03}
        sizeAttenuation={true}
        color={isDark ? '#34D399' : '#0B6E4F'}
        transparent={true}
        opacity={isDark ? 0.9 : 0.65}
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

// 4. Sharp Threat Sparks dissolving on shield contact
function SharpThreatSparks({ count = 8 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const threats = useMemo(() => {
    return Array.from({ length: count }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const r = 4.2 + Math.random() * 1.5;
      return {
        originX: r * Math.cos(phi) * Math.sin(theta),
        originY: r * Math.sin(phi),
        originZ: r * Math.cos(phi) * Math.cos(theta),
        progress: Math.random(),
        speed: 0.35 + Math.random() * 0.3,
        scale: 0.035,
      };
    });
  }, [count]);

  const color = useMemo(() => new THREE.Color('#EF4444'), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    threats.forEach((t, i) => {
      t.progress += delta * t.speed;
      if (t.progress >= 1) {
        t.progress = 0;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        const r = 4.2 + Math.random() * 1.5;
        t.originX = r * Math.cos(phi) * Math.sin(theta);
        t.originY = r * Math.sin(phi);
        t.originZ = r * Math.cos(phi) * Math.cos(theta);
      }

      const currentR = 4.2 * (1 - t.progress) + 1.45 * t.progress;
      const dirLength = Math.hypot(t.originX, t.originY, t.originZ) || 1;
      const x = (t.originX / dirLength) * currentR;
      const y = (t.originY / dirLength) * currentR;
      const z = (t.originZ / dirLength) * currentR;

      let currentScale = t.scale;
      if (t.progress > 0.8) {
        currentScale = t.scale * (1 - (t.progress - 0.8) / 0.2);
      }

      dummy.position.set(x, y, z);
      dummy.scale.set(currentScale, currentScale, currentScale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} depthWrite={false} />
    </instancedMesh>
  );
}

// 5. Full-Viewport Scene Controller with Desktop Right-Offset and Responsive Scaling
function SceneController({
  progress = 1.0,
  isFlight = false,
  isDark = true,
  isZooming = false,
}: CinematicSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotation.current = {
        x: ny * 0.16,
        y: nx * 0.24,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Desktop: offset shield to the right side (position.x ≈ viewport.width * 0.22)
    // Mobile / Narrow: center the shield (position.x = 0)
    const isDesktop = viewport.width > 7.2;
    const baseOffsetX = isDesktop ? viewport.width * 0.22 : 0;
    const responsiveScale = viewport.width < 7.2 ? Math.min(1.0, viewport.width / 7.6) : 1.0;

    // Smooth gentle float
    const floatY = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      floatY,
      delta * 3
    );

    // Responsive X offset + gentle mouse parallax
    const targetX = baseOffsetX + targetRotation.current.y * 0.4;
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      delta * 3
    );

    // Parallax rotation lerp
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

    // Base responsive scale lerp
    if (!isZooming) {
      groupRef.current.scale.lerp(
        new THREE.Vector3(responsiveScale, responsiveScale, responsiveScale),
        delta * 3
      );
    } else {
      // Zoom-in transition on "Get Started"
      groupRef.current.scale.lerp(new THREE.Vector3(12, 12, 12), delta * 4);
    }
  });

  return (
    <group ref={groupRef}>
      <SharpGlowShield
        progress={progress}
        isDark={isDark}
        isZooming={isZooming}
      />
      <SharpParticleRings progress={progress} isDark={isDark} />
      <SharpStardust isDark={isDark} />
      <SharpThreatSparks />
    </group>
  );
}

export default function CinematicScene({
  progress = 1.0,
  isFlight = false,
  isDark = true,
  isZooming = false,
}: CinematicSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.2], fov: 45, near: 0.1, far: 200 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="w-full h-full pointer-events-none"
    >
      <NebulaBackground isDark={isDark} />
      <ambientLight intensity={isDark ? 0.7 : 0.9} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={isDark ? 1.8 : 1.2}
        color={isDark ? '#E0FFFF' : '#FFFFFF'}
      />
      <pointLight
        position={[-3, -3, 3]}
        intensity={isDark ? 1.5 : 0.8}
        color={isDark ? '#00FFE0' : '#0B6E4F'}
      />
      <pointLight
        position={[3, 3, -2]}
        intensity={isDark ? 1.2 : 0.6}
        color={isDark ? '#76B900' : '#38BDF8'}
      />
      <SceneController
        progress={progress}
        isFlight={isFlight}
        isDark={isDark}
        isZooming={isZooming}
      />
    </Canvas>
  );
}
