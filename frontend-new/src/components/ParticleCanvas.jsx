import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/* ── Particle cloud that reacts to mouse ── */
const Particles = ({ count = 2000, interactive }) => {
  const meshRef = useRef();
  const mouse = useRef(new THREE.Vector2(9999, 9999));

  // Generate random initial positions & velocities
  const [positions, velocities, startPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const start = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 10;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      start[i * 3] = x;
      start[i * 3 + 1] = y;
      start[i * 3 + 2] = z;
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return [pos, vel, start];
  }, [count]);

  const { viewport } = useThree();

  // Create a smooth circular texture for the particles
  const dotTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }, []);

  /* Track mouse position in world‑space */
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = ((e.clientX / window.innerWidth) * 2 - 1) * (viewport.width / 2);
      mouse.current.y = (-(e.clientY / window.innerHeight) * 2 + 1) * (viewport.height / 2);
    };
    if (interactive) {
      window.addEventListener('pointermove', onMove);
    }
    return () => window.removeEventListener('pointermove', onMove);
  }, [interactive, viewport]);

  useFrame(() => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const arr = posAttr.array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // Drift
      arr[ix] += velocities[ix];
      arr[ix + 1] += velocities[ix + 1];
      arr[ix + 2] += velocities[ix + 2];

      // Mouse repulsion (only when interactive)
      if (interactive) {
        const dx = arr[ix] - mouse.current.x;
        const dy = arr[ix + 1] - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 2) {
          const force = (2 - dist) * 0.015;
          arr[ix] += dx * force;
          arr[ix + 1] += dy * force;
        }
      }

      // Gently spring back towards start
      arr[ix] += (startPositions[ix] - arr[ix]) * 0.001;
      arr[ix + 1] += (startPositions[ix + 1] - arr[ix + 1]) * 0.001;
      arr[ix + 2] += (startPositions[ix + 2] - arr[ix + 2]) * 0.001;

      // Wrap boundaries
      if (arr[ix] > 12) arr[ix] = -12;
      if (arr[ix] < -12) arr[ix] = 12;
      if (arr[ix + 1] > 8) arr[ix + 1] = -8;
      if (arr[ix + 1] < -8) arr[ix + 1] = 8;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
        map={dotTexture}
        alphaTest={0.5}
      />
    </points>
  );
};

/* ── "ArtEcomm" 3D text in the center ── */
const BrandText = () => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <Text
      ref={meshRef}
      fontSize={1.6}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      font="https://cdn.jsdelivr.net/npm/@fontsource/outfit@4.5.11/files/outfit-latin-400-normal.woff"
      letterSpacing={0.15}
      maxWidth={20}
    >
      ArtEcomm
    </Text>
  );
};

const InteractiveGroup = ({ children, interactive }) => {
  const groupRef = useRef();
  const mouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    if (interactive) window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [interactive]);

  useFrame(() => {
    if (groupRef.current && interactive) {
      groupRef.current.rotation.x += (mouse.current.y * 0.2 - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (mouse.current.x * 0.2 - groupRef.current.rotation.y) * 0.05;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

/* ── Main exported component ── */
const ParticleCanvas = ({ interactive = false }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.3} />
      <Suspense fallback={null}>
        <InteractiveGroup interactive={interactive}>
          <Particles count={1500} interactive={interactive} />
          <BrandText />
        </InteractiveGroup>
      </Suspense>
    </Canvas>
  );
};

export default ParticleCanvas;
