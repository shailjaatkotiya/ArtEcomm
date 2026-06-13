import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function makeSmokeTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(
    size * 0.5,
    size * 0.5,
    0,
    size * 0.5,
    size * 0.5,
    size * 0.5
  );

  gradient.addColorStop(0, 'rgba(255,255,255,0.48)');
  gradient.addColorStop(0.34, 'rgba(218,205,184,0.28)');
  gradient.addColorStop(0.7, 'rgba(154,59,38,0.08)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function noise(index, salt) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function SmokeField() {
  const groupRef = useRef(null);
  const texture = useMemo(() => makeSmokeTexture(), []);
  const particles = useMemo(
    () =>
      Array.from({ length: 38 }, (_, index) => {
        const lane = index % 7;
        return {
          baseX: -4.6 + lane * 1.52 + (noise(index, 1) - 0.5) * 0.85,
          baseY: -3.6 + noise(index, 2) * 5.6,
          z: -2.4 + noise(index, 3) * 1.8,
          drift: 0.35 + noise(index, 4) * 0.7,
          lift: 0.09 + noise(index, 5) * 0.16,
          phase: noise(index, 6) * Math.PI * 2,
          rotSpeed: (noise(index, 7) - 0.5) * 0.18,
          scale: 1.4 + noise(index, 8) * 3.4,
          opacity: 0.08 + noise(index, 9) * 0.12,
        };
      }),
    []
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((mesh, index) => {
      const particle = particles[index];
      const lift = (time * particle.lift + particle.baseY + 4.2) % 7.2;
      const y = lift - 3.6;

      mesh.position.x =
        particle.baseX + Math.sin(time * particle.drift + particle.phase) * (0.35 + index * 0.004);
      mesh.position.y = y;
      mesh.position.z = particle.z + Math.cos(time * 0.25 + particle.phase) * 0.2;
      mesh.rotation.z += particle.rotSpeed * delta;
      mesh.lookAt(state.camera.position);

      const fade = Math.sin(((lift / 7.2) * Math.PI));
      mesh.material.opacity = particle.opacity * Math.max(0.2, fade);
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, index) => (
        <mesh
          key={index}
          position={[particle.baseX, particle.baseY, particle.z]}
          rotation={[0, 0, particle.phase]}
          scale={particle.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={particle.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color="#d9cab5"
          />
        </mesh>
      ))}
    </group>
  );
}

function MuseumRings() {
  const ringRef = useRef(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const time = state.clock.elapsedTime;
    ringRef.current.rotation.z = Math.sin(time * 0.18) * 0.035;
    ringRef.current.position.y = Math.sin(time * 0.32) * 0.08;
  });

  return (
    <group ref={ringRef} position={[0, -0.2, -3.8]} rotation={[Math.PI / 2, 0, 0]}>
      {[2.8, 4.1, 5.4].map((radius, index) => (
        <mesh key={radius} position={[0, 0, index * -0.06]}>
          <torusGeometry args={[radius, 0.012, 8, 120]} />
          <meshBasicMaterial color="#9a3b26" transparent opacity={0.12 - index * 0.025} />
        </mesh>
      ))}
    </group>
  );
}

const AboutSmokeScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.65} />
      <MuseumRings />
      <SmokeField />
    </Canvas>
  );
};

export default AboutSmokeScene;
