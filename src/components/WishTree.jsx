import { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useSearchParams } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const ResponsiveCamera = ({ hoveredPos }) => {
  const { camera, size, mouse } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 1.5, 8));
  const currentPos = useRef(new THREE.Vector3(0, 1.5, 8));
  
  useEffect(() => {
    if (size.width < 640) {
      camera.fov = 50;
      targetPos.current.set(0, 1.5, 10);
    } else {
      camera.fov = 45;
      targetPos.current.set(0, 1.5, 8);
    }
    camera.updateProjectionMatrix();
  }, [size, camera]);

  useFrame((state, delta) => {
    // If hovering a tag, move camera towards it slightly
    if (hoveredPos) {
      const zoomTarget = new THREE.Vector3().fromArray(hoveredPos);
      zoomTarget.z += 3; // Stay 3 units away from the tag
      zoomTarget.y += 0.5;
      currentPos.current.lerp(zoomTarget, 0.05);
    } else {
      // Otherwise subtle mouse follow
      const parallaxX = mouse.x * 1;
      const parallaxY = mouse.y * 1;
      const idleTarget = targetPos.current.clone().add(new THREE.Vector3(parallaxX, parallaxY, 0));
      currentPos.current.lerp(idleTarget, 0.05);
    }
    
    camera.position.copy(currentPos.current);
    camera.lookAt(0, 0.5, 0);
  });

  return null;
};

const WisherTag = ({ wisher, position, index, onHover }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Float 
      speed={2 + (index % 2)} 
      rotationIntensity={hovered ? 1 : 0.5} 
      floatIntensity={hovered ? 1 : 0.5} 
      position={position}
    >
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.8, 4]} />
        <meshBasicMaterial color={hovered ? "var(--theme-primary)" : "#94a3b8"} />
      </mesh>

      <Html 
        center 
        transform 
        sprite 
        distanceFactor={12}
        onPointerOver={() => {
          setHovered(true);
          onHover(position);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <div 
          className={`bg-white/95 px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] border-2 text-xs font-bold tracking-wider origin-top whitespace-nowrap cursor-pointer group relative transition-all duration-300 ${hovered ? 'scale-125 border-[var(--theme-primary)]' : 'scale-100 border-slate-200 text-[var(--theme-primary)]'}`}
          style={{ borderRadius: '2px 2px 12px 12px' }}
        >
          {wisher.name}

          {wisher.message && (
            <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-white p-4 rounded-2xl shadow-2xl border-2 border-[var(--theme-primary)]/20 transition-all z-30 origin-top text-center whitespace-normal ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-[var(--theme-primary)]/20 transform rotate-45" />
              <p className="relative text-xs text-slate-700 font-bold leading-relaxed italic z-40">
                "{wisher.message}"
              </p>
            </div>
          )}
        </div>
      </Html>
      
      {hovered && (
        <pointLight position={[0, 0, 0]} color="var(--theme-primary)" intensity={1.5} distance={3} />
      )}
    </Float>
  );
};


// 3D Branch Component
const Branch = ({ start, end, thickness, color }) => {
  const vecStart = new THREE.Vector3(...start);
  const vecEnd = new THREE.Vector3(...end);
  const distance = vecStart.distanceTo(vecEnd);
  const position = vecStart.clone().lerp(vecEnd, 0.5);
  
  const quaternion = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const direction = vecEnd.clone().sub(vecStart).normalize();
  quaternion.setFromUnitVectors(up, direction);

  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[thickness * 0.6, thickness, distance, 16]} />
      <meshPhysicalMaterial 
        color={color} 
        roughness={0.2} 
        metalness={0.1} 
        transmission={0.6} 
        thickness={1}
        ior={1.5}
      />
    </mesh>
  );
};

const Tree = ({ wishers }) => {
  const group = useRef();
  const [hoveredPos, setHoveredPos] = useState(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const branches = useMemo(() => [
    { start: [0, -3, 0], end: [0, -0.5, 0], thickness: 0.4, color: "#a855f7" },
    
    { start: [0, -0.5, 0], end: [-1.2, 1, 0.8], thickness: 0.25, color: "#ec4899" },
    { start: [0, -0.5, 0], end: [1.2, 1.2, -0.8], thickness: 0.25, color: "#ec4899" },
    { start: [0, -0.5, 0], end: [0, 1.5, 1.2], thickness: 0.25, color: "#8b5cf6" },

    { start: [-1.2, 1, 0.8], end: [-2, 2.5, 1.5], thickness: 0.15, color: "#d946ef" },
    { start: [-1.2, 1, 0.8], end: [-2.2, 2, 0], thickness: 0.15, color: "#d946ef" },
    { start: [-1.2, 1, 0.8], end: [-0.5, 2.8, 1.5], thickness: 0.15, color: "#d946ef" },

    { start: [1.2, 1.2, -0.8], end: [2.2, 2.8, -1.2], thickness: 0.15, color: "#d946ef" },
    { start: [1.2, 1.2, -0.8], end: [2.5, 2.2, 0], thickness: 0.15, color: "#d946ef" },
    { start: [1.2, 1.2, -0.8], end: [0.8, 3, -1.5], thickness: 0.15, color: "#d946ef" },

    { start: [0, 1.5, 1.2], end: [-0.8, 3.2, 2], thickness: 0.15, color: "#c084fc" },
    { start: [0, 1.5, 1.2], end: [1, 3.5, 1.8], thickness: 0.15, color: "#c084fc" },
    { start: [0, 1.5, 1.2], end: [0, 3.8, 0.5], thickness: 0.15, color: "#c084fc" },
  ], []);

  const endpoints = useMemo(() => branches.filter((_, i) => i > 0).map(b => b.end), [branches]);

  return (
    <>
      <ResponsiveCamera hoveredPos={hoveredPos} />
      <group ref={group} position={[0, -0.5, 0]}>
        {branches.map((b, i) => (
          <Branch key={i} {...b} />
        ))}
        
        {endpoints.map((pos, i) => (
          <Sphere key={`leaf-${i}`} args={[0.15, 16, 16]} position={pos}>
            <meshStandardMaterial color="#fdf4ff" emissive="#fbcfe8" emissiveIntensity={0.8} />
          </Sphere>
        ))}

        {wishers.map((wisher, i) => {
          const pos = endpoints[i % endpoints.length];
          const offset = [
            (Math.sin(i * 13) * 0.5),
            -0.3 - (Math.cos(i * 7) * 0.4),
            (Math.sin(i * 11) * 0.5)
          ];
          const tagPos = [pos[0] + offset[0], pos[1] + offset[1], pos[2] + offset[2]];
          
          return (
            <WisherTag 
              key={wisher.id || i} 
              wisher={wisher} 
              position={tagPos} 
              index={i} 
              onHover={setHoveredPos}
            />
          );
        })}

        {/* Tree Base / Pedestal */}
        <mesh position={[0, -3.1, 0]}>
          <cylinderGeometry args={[1.2, 1.4, 0.2, 32]} />
          <meshPhysicalMaterial 
            color="#f8fafc" 
            roughness={0.1} 
            transmission={0.8} 
            thickness={2}
            ior={1.5}
          />
        </mesh>
        <mesh position={[0, -3.2, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.05, 32]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      </group>
    </>
  );
};

export default function WishTree({ refreshTrigger }) {
  const [wishers, setWishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const rawName = searchParams.get('name');

  useEffect(() => {
    async function fetchWishers() {
      if (!supabase) {
        if (rawName) {
          setWishers([{ id: 'local', name: rawName }]);
        } else {
          setWishers([]);
        }
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('wishers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        let loadedWishers = data || [];
        setWishers(loadedWishers);
      } catch (err) {
        console.error("Error fetching wishers:", err.message);
        setWishers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWishers();
  }, [rawName, refreshTrigger]);

  if (loading) {
    return <div className="text-slate-400 text-sm animate-pulse flex items-center justify-center w-full h-full">Growing 3D Tree...</div>;
  }

  return (
    <div className="relative w-full h-full bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing">
      
      {wishers.length === 0 && (
        <p className="absolute top-8 left-1/2 -translate-x-1/2 text-slate-500 font-medium tracking-wide z-10 pointer-events-none">
          The branches are completely empty.
        </p>
      )}
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 1.5, 8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={1.5} />
        <spotLight position={[5, 10, 5]} intensity={2} angle={0.3} penumbra={1} color="#a855f7" />
        <spotLight position={[-5, 5, -5]} intensity={2} angle={0.3} penumbra={1} color="#ec4899" />
        <directionalLight position={[0, 5, 5]} intensity={1} color="#ffffff" />
        
        <Tree wishers={wishers} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI/3}
          maxPolarAngle={Math.PI/2}
          target={[0, 0.5, 0]}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
