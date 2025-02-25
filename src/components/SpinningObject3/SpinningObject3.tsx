import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

import './SpinningObject3.css';

const SpinningBox: React.FC<{ isSpinning: boolean }> = ({ isSpinning }) => {
  const meshRef = React.useRef<any>();
  const { scene } = useGLTF('/src/components/SpinningObject3/helex.glb'); // Replace with your 3D model path

  // Continuously update the mesh rotation on each frame
  useFrame(() => {
    if (isSpinning && meshRef.current) {
      // Rotate the mesh by a small increment on the Y axis (in radians)
      meshRef.current.rotation.z += Math.PI / 20;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI, 0, 0]} position={[0, -100, 0]}>
      <primitive object={scene} />
    </mesh>
  );
};

const SpinningObject3: React.FC = () => {
  
  const [isSpinning, setIsSpinning] = useState(false);

  // Function to toggle the spinning state when the button is clicked
  const toggleSpin = () => {
    setIsSpinning((prev) => !prev);
  };

  return (
    <div className='SpinningObject3'>
      <Canvas camera={{fov: 50, far: 5000, position: [0,-400,-700], rotation: [0,0,100]}} style={{width: '100%'}}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls/>

        {/* 3D Model */}
        <SpinningBox isSpinning={isSpinning} />
      </Canvas>

      <button onClick={toggleSpin} className='SpinButton3'>Toggle Drill Action: {isSpinning ? 'Stop Spinning' : 'Start Spinning'}</button>
    </div>
  );
};

export default SpinningObject3;
