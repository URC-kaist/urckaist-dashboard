import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

import './SpinningObject2.css';


const SpinningObject2: React.FC = () => {
  const { scene } = useGLTF('/src/components/SpinningObject2/urc2spinningobjectv1.glb'); // Replace with your 3D model path
  const [rotationY, setRotationY] = useState(0); // Keep track of the rotation in radians

  // Function to rotate by 60 degrees (π/3 radians)
  const rotateBy60Degrees = () => {
    if(rotationY / Math.PI * 8 > 14){
      setRotationY(0)
    }else{
      setRotationY(prevRotation => prevRotation + 1 * Math.PI / 8); // Increment by π/3 radians (60 degrees)
    }
  };

  return (
    <div className='SpinningObject2'>
      <Canvas camera={{fov: 50, position: [0,-10,100], rotation: [-1.5,0,0]}} style={{width: '100%'}}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls/>

        {/* 3D Model */}
          <mesh rotation={[2 * Math.PI / 3, 0, 7* Math.PI / 8 + rotationY]} position={[0, 0, 0]}>
            <primitive object={scene} />
          </mesh>
      </Canvas>

      <button onClick={rotateBy60Degrees} className='SpinButton2'>Sample Selection: {Math.round(rotationY / Math.PI * 8)}</button>
    </div>
  );
};

export default SpinningObject2;
