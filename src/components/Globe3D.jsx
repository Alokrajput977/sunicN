import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import './Globe3D.css';

const RADIUS = 2.2;

// Convert lat/long (hub locations) to a point on the sphere surface
function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Real hub cities used to place the network nodes on the globe
const HUBS = [
  { lat: 40.7, lon: -74.0 }, // New York
  { lat: 51.5, lon: -0.1 }, // London
  { lat: 1.35, lon: 103.8 }, // Singapore
  { lat: -33.9, lon: 151.2 }, // Sydney
  { lat: 35.6, lon: 139.7 }, // Tokyo
  { lat: 19.07, lon: 72.87 }, // Mumbai
  { lat: -23.5, lon: -46.6 }, // Sao Paulo
  { lat: 25.2, lon: 55.3 }, // Dubai
];

// Which hubs are connected by an active freight route
const ROUTES = [
  [0, 1], [1, 7], [7, 2], [2, 4], [4, 3], [0, 6], [5, 7], [5, 2], [1, 5],
];

function NetworkGlobe() {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.14;
  });

  const nodePositions = useMemo(
    () => HUBS.map((h) => latLongToVector3(h.lat, h.lon, RADIUS)),
    []
  );

  return (
    <group ref={groupRef}>
      {/* Wireframe outer shell */}
      <mesh>
        <icosahedronGeometry args={[RADIUS, 3]} />
        <meshBasicMaterial color="#35e1c1" wireframe transparent opacity={0.22} />
      </mesh>

      {/* Solid inner sphere so arcs read clearly against it */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.97, 32, 32]} />
        <meshBasicMaterial color="#0a0e1f" transparent opacity={0.88} />
      </mesh>

      {/* Route arcs between hubs */}
      {ROUTES.map(([a, b], i) => {
        const start = nodePositions[a];
        const end = nodePositions[b];
        const mid = start
          .clone()
          .add(end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(RADIUS * 1.4);
        return (
          <QuadraticBezierLine
            key={i}
            start={start}
            end={end}
            mid={mid}
            color="#ff9f1c"
            lineWidth={1}
            transparent
            opacity={0.55}
          />
        );
      })}

      {/* Hub nodes */}
      {nodePositions.map((pos, i) => (
        <mesh position={pos} key={i}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#35e1c1" />
        </mesh>
      ))}
    </group>
  );
}

const Globe3D = () => {
  return (
    <div className="globe3d">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        <NetworkGlobe />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.7}
          minPolarAngle={Math.PI / 2 - 0.5}
          maxPolarAngle={Math.PI / 2 + 0.5}
        />
      </Canvas>
    </div>
  );
};

export default Globe3D;
