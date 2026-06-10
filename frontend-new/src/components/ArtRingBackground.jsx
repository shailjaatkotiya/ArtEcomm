import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const INK = '#17150f';
const IVORY = '#f2efe7';
const CLAY = '#9a3b26';
const STONE = '#6b665c';
const GOLD = '#b5a642';

const ART_TYPES = [
  'WALL DECOR',
  'ROOM DECOR',
  'DIGITAL',
  'CANVAS',
  'PAPER',
  'PRINTS',
  'ACRYLIC',
  'POSTER',
];

const PAINTING_COUNT = 8;
const RADIUS = 6.4;

// Soft radial puff for smoke sprites
function makeSmokeTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,0.6)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.22)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

// Procedural paintings — beige/brown grounds, black artwork, in the
// neutral-abstract style of contemporary wall-art prints
const BEIGE = ['#e9e0cd', '#ddd0b8', '#e4d9c3', '#d6c7ab'];
const BROWN = ['#8a6948', '#a87f55', '#6b4f33', '#b08968'];
const CHARCOAL = '#211d18';

function speckle(ctx, w, h) {
  // Paper grain
  for (let n = 0; n < 220; n++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(60,45,30,0.05)' : 'rgba(255,250,240,0.06)';
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
  }
}

function makePaintingTexture(i) {
  const w = 256;
  const h = 320;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = BEIGE[i % BEIGE.length];
  ctx.fillRect(0, 0, w, h);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (i % 8) {
    case 0: {
      // Organic blobs + single contour line
      ctx.fillStyle = BROWN[1];
      ctx.beginPath();
      ctx.ellipse(w * 0.62, h * 0.32, w * 0.26, h * 0.18, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = CHARCOAL;
      ctx.beginPath();
      ctx.ellipse(w * 0.34, h * 0.62, w * 0.18, h * 0.14, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = CHARCOAL;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.15, h * 0.85);
      ctx.bezierCurveTo(w * 0.4, h * 0.55, w * 0.55, h * 0.95, w * 0.85, h * 0.7);
      ctx.stroke();
      break;
    }
    case 1: {
      // One-line face profile, black on warm beige
      ctx.strokeStyle = CHARCOAL;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h * 0.18);
      ctx.bezierCurveTo(w * 0.3, h * 0.28, w * 0.36, h * 0.42, w * 0.34, h * 0.48); // forehead → nose bridge
      ctx.bezierCurveTo(w * 0.3, h * 0.54, w * 0.42, h * 0.55, w * 0.38, h * 0.6); // nose
      ctx.bezierCurveTo(w * 0.34, h * 0.66, w * 0.44, h * 0.68, w * 0.4, h * 0.72); // lips
      ctx.bezierCurveTo(w * 0.38, h * 0.8, w * 0.52, h * 0.84, w * 0.62, h * 0.82); // chin → jaw
      ctx.stroke();
      ctx.fillStyle = BROWN[0];
      ctx.beginPath();
      ctx.arc(w * 0.66, h * 0.62, w * 0.05, 0, Math.PI * 2); // earring accent
      ctx.fill();
      ctx.fillStyle = CHARCOAL;
      ctx.beginPath();
      ctx.ellipse(w * 0.6, h * 0.3, w * 0.16, h * 0.1, 0.3, 0, Math.PI * 2); // hair mass
      ctx.fill();
      break;
    }
    case 2: {
      // Bold ink brush strokes
      ctx.strokeStyle = CHARCOAL;
      for (let s = 0; s < 7; s++) {
        ctx.lineWidth = 16 - s * 2;
        ctx.beginPath();
        ctx.moveTo(w * (0.18 + s * 0.015), h * (0.78 - s * 0.01));
        ctx.bezierCurveTo(w * 0.35, h * 0.45, w * 0.55, h * (0.5 - s * 0.02), w * (0.8 + s * 0.01), h * 0.22);
        ctx.stroke();
      }
      ctx.strokeStyle = BROWN[1];
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * 0.3);
      ctx.bezierCurveTo(w * 0.45, h * 0.55, w * 0.6, h * 0.65, w * 0.78, h * 0.85);
      ctx.stroke();
      break;
    }
    case 3: {
      // Layered waves, dark ground
      ctx.fillStyle = CHARCOAL;
      ctx.fillRect(0, 0, w, h);
      const waveColors = [BROWN[3], BEIGE[1], BROWN[0], BEIGE[3], BROWN[2]];
      waveColors.forEach((color, b) => {
        const baseY = h * (0.25 + b * 0.15);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        ctx.bezierCurveTo(w * 0.3, baseY - h * 0.1, w * 0.6, baseY + h * 0.08, w, baseY - h * 0.05);
        ctx.lineTo(w, baseY + h * 0.07);
        ctx.bezierCurveTo(w * 0.6, baseY + h * 0.15, w * 0.3, baseY - h * 0.03, 0, baseY + h * 0.07);
        ctx.closePath();
        ctx.fill();
      });
      break;
    }
    case 4: {
      // Mid-century arches and circles
      ctx.fillStyle = CHARCOAL;
      ctx.beginPath();
      ctx.arc(w * 0.35, h * 0.42, w * 0.2, Math.PI, 0);
      ctx.rect(w * 0.15, h * 0.42, w * 0.4, h * 0.32);
      ctx.fill();
      ctx.fillStyle = BROWN[1];
      ctx.beginPath();
      ctx.arc(w * 0.72, h * 0.32, w * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = BROWN[2];
      ctx.beginPath();
      ctx.arc(w * 0.72, h * 0.68, w * 0.12, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = CHARCOAL;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.15, h * 0.85);
      ctx.lineTo(w * 0.85, h * 0.85);
      ctx.stroke();
      break;
    }
    case 5: {
      // Tonal colour field, charcoal over beige with brown bleed
      ctx.fillStyle = CHARCOAL;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.45);
      ctx.bezierCurveTo(w * 0.3, h * 0.4, w * 0.7, h * 0.5, w, h * 0.43);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      const grad = ctx.createLinearGradient(0, h * 0.35, 0, h * 0.6);
      grad.addColorStop(0, 'rgba(168,127,85,0)');
      grad.addColorStop(0.5, 'rgba(168,127,85,0.7)');
      grad.addColorStop(1, 'rgba(168,127,85,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(w * 0.2, h * 0.3, w * 0.6, h * 0.35);
      break;
    }
    case 6: {
      // Matisse-style black cutout
      ctx.fillStyle = CHARCOAL;
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.15);
      ctx.bezierCurveTo(w * 0.85, h * 0.25, w * 0.6, h * 0.5, w * 0.75, h * 0.7);
      ctx.bezierCurveTo(w * 0.8, h * 0.85, w * 0.5, h * 0.9, w * 0.45, h * 0.75);
      ctx.bezierCurveTo(w * 0.4, h * 0.6, w * 0.25, h * 0.55, w * 0.3, h * 0.4);
      ctx.bezierCurveTo(w * 0.33, h * 0.25, w * 0.35, h * 0.12, w * 0.5, h * 0.15);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = BROWN[3];
      ctx.beginPath();
      ctx.arc(w * 0.24, h * 0.78, w * 0.06, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    default: {
      // Vertical column abstraction
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, BEIGE[2]);
      grad.addColorStop(1, BROWN[3]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      for (let c = 0; c < 5; c++) {
        ctx.fillStyle = `rgba(33,29,24,${0.25 + c * 0.12})`;
        const cw = w * (0.3 - c * 0.045);
        ctx.fillRect(w / 2 - cw / 2, h * 0.12, cw, h * 0.74);
      }
      ctx.strokeStyle = CHARCOAL;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.18, h * 0.88);
      ctx.lineTo(w * 0.82, h * 0.88);
      ctx.stroke();
      break;
    }
  }

  speckle(ctx, w, h);
  return new THREE.CanvasTexture(canvas);
}

function Smoke({ count = 16 }) {
  const texture = useMemo(makeSmokeTexture, []);
  const group = useRef();

  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 1.5 + Math.random() * 2.2;
        return {
          x: Math.sin(angle) * dist,
          y: -2.5 + Math.random() * 6,
          z: Math.cos(angle) * dist,
          scale: 3 + Math.random() * 4,
          speed: 0.2 + Math.random() * 0.4,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.05,
        };
      }),
    [count]
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.children.forEach((mesh, i) => {
      const p = particles[i];
      mesh.position.y += p.speed * delta;
      mesh.rotation.z += p.rotSpeed * delta;
      // Billboard toward the camera at the centre
      mesh.lookAt(state.camera.position);
      if (mesh.position.y > 4.5) mesh.position.y = -3;
    });
  });

  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} scale={p.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.1}
            depthWrite={false}
            color="#a99e8a"
          />
        </mesh>
      ))}
    </group>
  );
}

function FramedPainting({ texture, width, height }) {
  const t = 0.09;
  return (
    <group>
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial color={IVORY} roughness={0.9} />
      </mesh>
      <mesh>
        <planeGeometry args={[width - 0.1, height - 0.1]} />
        <meshStandardMaterial map={texture} roughness={0.85} />
      </mesh>
      {[
        { pos: [0, height / 2, -0.02], size: [width + t * 2, t, 0.12] },
        { pos: [0, -height / 2, -0.02], size: [width + t * 2, t, 0.12] },
        { pos: [-width / 2 - t / 2 + 0.01, 0, -0.02], size: [t, height, 0.12] },
        { pos: [width / 2 + t / 2 - 0.01, 0, -0.02], size: [t, height, 0.12] },
      ].map((rail, i) => (
        <mesh key={i} position={rail.pos}>
          <boxGeometry args={rail.size} />
          <meshStandardMaterial color={INK} roughness={0.6} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// Each route gets its own stable base angle so navigating shows a
// different stretch of the ring
function routeAngle(path) {
  let h = 0;
  for (let i = 0; i < path.length; i++) h = (h * 31 + path.charCodeAt(i)) % 997;
  return (h / 997) * Math.PI * 2;
}

// The viewer stands at the origin; paintings surround them, fronts
// facing inward. Scroll spins the whole room around the camera.
function PaintingRing({ pathname = '/' }) {
  const group = useRef();
  const smoothOffset = useRef(routeAngle(pathname));

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // Glide toward the new route's angle instead of snapping
    smoothOffset.current +=
      (routeAngle(pathname) - smoothOffset.current) * Math.min(1, delta * 1.5);
    group.current.rotation.y = t * 0.035 + window.scrollY * 0.0014 + smoothOffset.current;
  });

  const paintings = useMemo(
    () =>
      Array.from({ length: PAINTING_COUNT }, (_, i) => ({
        texture: makePaintingTexture(i),
        angle: (i / PAINTING_COUNT) * Math.PI * 2,
        width: 1.7 + (i % 3) * 0.25,
        height: 2.2 + ((i + 1) % 3) * 0.22,
        y: ((i % 2) - 0.5) * 0.18,
      })),
    []
  );

  return (
    <group ref={group}>
      {paintings.map((p, i) => (
        <group
          key={i}
          position={[Math.sin(p.angle) * RADIUS, p.y, Math.cos(p.angle) * RADIUS]}
          rotation={[0, p.angle + Math.PI, 0]}
        >
          <FramedPainting texture={p.texture} width={p.width} height={p.height} />
        </group>
      ))}

      {/* Art-type labels hang between the paintings, riding the same spin.
          Text suspends while its font loads — keep the boundary local so
          the paintings never wait on it. */}
      <Suspense fallback={null}>
        {ART_TYPES.map((label, i) => {
          const angle = ((i + 0.5) / ART_TYPES.length) * Math.PI * 2;
          return (
            <Text
              key={label}
              position={[Math.sin(angle) * (RADIUS - 0.3), 1.85, Math.cos(angle) * (RADIUS - 0.3)]}
              rotation={[0, angle + Math.PI, 0]}
              fontSize={0.19}
              letterSpacing={0.28}
              color={INK}
              fillOpacity={0.4}
              anchorX="center"
              anchorY="middle"
            >
              {label}
            </Text>
          );
        })}
      </Suspense>
    </group>
  );
}

const ArtRingBackground = ({ pathname = '/' }) => {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 0.01], fov: 55 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent', opacity: 0.6 }}
      onCreated={(state) => {
        // R3F aims the default camera at the origin, which from a
        // near-origin position means staring at the floor. Look out
        // at the ring instead.
        state.camera.lookAt(0, 0.15, -RADIUS);
      }}
    >
      <ambientLight intensity={0.85} />
      <pointLight position={[0, 2.5, 0]} intensity={14} color={IVORY} />
      <directionalLight position={[3, 4, 2]} intensity={0.5} />
      <Smoke />
      <PaintingRing pathname={pathname} />
    </Canvas>
  );
};

export default ArtRingBackground;
