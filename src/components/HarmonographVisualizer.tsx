import React, { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { QuantumHarmonograph } from '../lib/quantum/QuantumHarmonograph';
import { motion } from 'framer-motion';
import { QuantumStateDisplay } from './QuantumStateDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { Complex } from 'mathjs';
import { ColorInterpolator } from '../lib/harmonograph/ColorInterpolator';

interface HarmonographVisualizerProps {
  nQubits?: number;
  frequencies?: number[];
  phases?: number[];
}

const Pattern: React.FC<{ 
  pattern: { x: number[], y: number[], z: number[] },
  colors: string[]
}> = ({ pattern, colors }) => {
  const points = pattern.x.map((x, i) => new THREE.Vector3(x, pattern.y[i], pattern.z[i]));
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  const colorArray = new Float32Array(pattern.x.length * 3);
  points.forEach((_, i) => {
    const color = new THREE.Color(colors[i % colors.length]);
    colorArray[i * 3] = color.r;
    colorArray[i * 3 + 1] = color.g;
    colorArray[i * 3 + 2] = color.b;
  });
  
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
  
  return (
    <line>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial attach="material" vertexColors linewidth={2} />
    </line>
  );
};

export const HarmonographVisualizer: React.FC<HarmonographVisualizerProps> = ({
  nQubits = 4,
  frequencies = [1, 2, 3, 4],
  phases = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4]
}) => {
  const [pattern, setPattern] = useState<{ x: number[], y: number[], z: number[] } | null>(null);
  const [quantumState, setQuantumState] = useState<Complex[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const quantumRef = useRef<QuantumHarmonograph | null>(null);

  const colors = useMemo(() => {
    if (quantumState.length === 0) return [];
    return ColorInterpolator.getGradientColors(quantumState);
  }, [quantumState]);

  useEffect(() => {
    try {
      setIsLoading(true);
      quantumRef.current = new QuantumHarmonograph(nQubits);
      quantumRef.current.setParameters(frequencies, phases, 1.5, 0.002);
      
      const newPattern = quantumRef.current.generatePattern(2000);
      const newState = quantumRef.current.simulateQuantumState();
      
      setPattern(newPattern);
      setQuantumState(newState);
    } catch (error) {
      console.error('Error in quantum simulation:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nQubits, frequencies, phases]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-[500px] bg-black rounded-lg shadow-lg overflow-hidden"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Canvas
            camera={{ position: [0, 0, 10], fov: 75 }}
            style={{ background: '#000000' }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
            {pattern && <Pattern pattern={pattern} colors={colors} />}
          </Canvas>
        </Suspense>
      </motion.div>
      
      {quantumState.length > 0 && (
        <QuantumStateDisplay stateVector={quantumState} />
      )}
    </div>
  );
};