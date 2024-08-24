"use client"

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere } from '@react-three/drei';

function FloatingObject({ position, rotation, scale }) {
  const mesh = useRef();

  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.2;
    mesh.current.rotation.y += delta * 0.3;
    mesh.current.position.y += Math.sin(state.clock.elapsedTime) * 0.005;
  });

  return (
    <mesh ref={mesh} position={position} rotation={rotation} scale={scale}>
      {Math.random() > 0.5 ? <boxGeometry /> : <sphereGeometry />}
      <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 60%)`} />
    </mesh>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingObject position={[-4, 2, -5]} rotation={[0, 0, 0]} scale={0.5} />
        <FloatingObject position={[4, -2, -3]} rotation={[0, 0, 0]} scale={0.3} />
        <FloatingObject position={[-2, -3, -4]} rotation={[0, 0, 0]} scale={0.4} />
        <FloatingObject position={[3, 3, -6]} rotation={[0, 0, 0]} scale={0.6} />
        <FloatingObject position={[0, 0, -5]} rotation={[0, 0, 0]} scale={0.5} />
      </Canvas>
    </div>
  );
}