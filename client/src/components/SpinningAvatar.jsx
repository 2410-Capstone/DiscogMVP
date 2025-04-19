import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";



function AvatarModel({ avatarUrl }) {
    const { scene } = useGLTF(avatarUrl);
  
  
    scene.position.set(0, -1.2, 0);
    scene.rotation.y = Math.PI; 
    return <primitive object={scene} scale={1.8} />;
  }


useGLTF.preload("https://models.readyplayer.me/6803bba0679b1816820aa55d.glb");

const SpinningAvatar = ({ avatarUrl }) => {
  return (
    <div className="avatar-3d-container">
  <Canvas
  style={{ height: "320px", width: "320px" }}
  camera={{ position: [1, 1.4, 3] }} 
  gl={{ alpha: true }}
>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} />
          <AvatarModel avatarUrl={avatarUrl} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SpinningAvatar;
