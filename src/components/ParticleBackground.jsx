import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Lightformer, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const GlassShape = ({ position, rotation, scale, color, geometry }) => {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh ref={meshRef} scale={scale} rotation={rotation} castShadow receiveShadow>
        <primitive object={geometry} attach="geometry" />
        <meshPhysicalMaterial 
          color={color}
          transmission={0.9}
          opacity={1}
          metalness={0.1}
          roughness={0.1}
          ior={1.5}
          thickness={2}
          specularIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
};

const BackgroundShapes = () => {
  const geometries = useMemo(() => [
    new THREE.TorusGeometry(1, 0.3, 32, 64),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.TorusKnotGeometry(0.8, 0.2, 64, 16)
  ], []);

  return (
    <>
      <GlassShape position={[-6, 3, -4]} scale={1.5} color="#c084fc" geometry={geometries[4]} />
      <GlassShape position={[6, -2, -6]} scale={2} color="#f472b6" geometry={geometries[0]} />
      <GlassShape position={[0, -5, -8]} scale={2.5} color="#60a5fa" geometry={geometries[1]} />
      <GlassShape position={[-5, -4, -6]} scale={1.2} color="#fbbf24" geometry={geometries[3]} />
      <GlassShape position={[5, 5, -5]} scale={1.8} color="#34d399" geometry={geometries[2]} />
      <GlassShape position={[0, 4, -10]} scale={3} color="#a855f7" geometry={geometries[3]} />
    </>
  );
};

const CameraRig = () => {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  useMemo(() => {
    const onMouseMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);
  
  useFrame((state, delta) => {
    // Parallax effect based on global mouse pointer
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.current.x * 2, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.current.y * 2, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const Scene = () => {
  return (
    <>
      <CameraRig />
      
      {/* Lights */}
      <ambientLight intensity={1.5} />
      <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={3} color="#a855f7" />
      <spotLight position={[-10, -10, -10]} angle={0.2} penumbra={1} intensity={3} color="#ec4899" />
      <directionalLight position={[0, 5, 5]} intensity={1.5} color="#ffffff" />
      
      <BackgroundShapes />
      
      {/* Dynamic Sparkles */}
      <Sparkles count={300} scale={20} size={4} speed={0.4} opacity={0.6} color="#ffffff" />
      <Sparkles count={200} scale={25} size={6} speed={0.2} opacity={0.4} color="#f472b6" />
      <Sparkles count={100} scale={30} size={8} speed={0.1} opacity={0.2} color="#60a5fa" />
      
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
          <Lightformer form="ring" color="white" intensity={2} scale={10} position={[-15, 4, -18]} />
        </group>
      </Environment>
    </>
  );
};

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-90">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
}
