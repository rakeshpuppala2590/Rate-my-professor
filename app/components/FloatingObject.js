"use client"
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus } from '@react-three/drei';

function FloatingObject({ position, rotation, scale, geometry }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.005;
  });

  const Geometry = geometry;
  
  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <Geometry />
      <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 60%)`} />
    </mesh>
  );
}

export default function FloatingObjects() {
  return (
    <>
      <FloatingObject position={[-2, 0, 0]} rotation={[0, 0, 0]} scale={0.5} geometry={Sphere} />
      <FloatingObject position={[2, 1, -2]} rotation={[0, 0, 0]} scale={0.7} geometry={Box} />
      <FloatingObject position={[0, -1, -1]} rotation={[0, 0, 0]} scale={0.6} geometry={Torus} />
      <FloatingObject position={[1, 2, -3]} rotation={[0, 0, 0]} scale={0.4} geometry={Sphere} />
      <FloatingObject position={[-1, -2, -2]} rotation={[0, 0, 0]} scale={0.5} geometry={Box} />
    </>
  );
}