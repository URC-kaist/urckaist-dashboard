import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

import './SpinningObject.css';

const SpinningObject: React.FC = () => {
  const { scene } = useGLTF('/src/components/SpinningObject/urc_3dmodelv1.glb'); // Replace with your 3D model path
  const [rotationY, setRotationY] = useState(0); // Keep track of the rotation in radians

  // Function to rotate by 60 degrees (π/3 radians)
  const rotateBy60Degrees = () => {
    if(rotationY >= 120 * Math.PI / 180){
      setRotationY(0)
    }else{
      setRotationY(prevRotation => prevRotation + 40 * Math.PI / 180); // Increment by π/3 radians (60 degrees)
    }
  };

  return (
    <div className='SpinningObject'>
      <Canvas camera={{fov: 50, position: [0,-10,200], rotation: [-1.5,0,0]}} style={{width: '100%'}}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <axesHelper args={[40]} />
        <OrbitControls/>

        {/* 3D Model */}
        <mesh rotation={[2 * Math.PI / 3, 0, rotationY]} position={[0, 0, 0]}>
          <primitive object={scene} />
        </mesh>
      </Canvas>

      <button onClick={rotateBy60Degrees} className='SpinButton'>Soil & Temperature Selection: {Math.round(rotationY / Math.PI * 180 / 40)}</button>
    </div>
  );
};

export default SpinningObject;
