"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import FloatingObjects from './FloatingObject';
import Navbar from './Navbar';
import { SignInButton } from "@clerk/nextjs";

// export default function Hero() {
//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 overflow-hidden">
//       <Navbar />
      
//       {/* Hero Content */}
//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
//         <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
//           Rate Your Professors
//         </h1>
//         <p className="text-xl md:text-2xl text-indigo-800 mb-8">
//           Discover and share insights about your educators
//         </p>
        
//       </div>

//       {/* 3D-like elements */}
//       <div className="absolute inset-0 z-0 flex items-center justify-center">
//         <div className="w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//         <div className="w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//         <div className="w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
//       </div>
//     </div>
//   );
// }


export default function Hero() {
  return (
    <div className="relative w-full h-screen">
      <Navbar />
      
      <Canvas className="absolute inset-0" camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingObjects />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Rate Your Professors
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md">
          Discover and share insights about your educators
        </p>
        <SignInButton>
        <button className="px-8 py-3 bg-indigo-600 text-white text-lg rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300">
          Get Started
        </button>
        </SignInButton>
      </div>
    </div>
  );
}