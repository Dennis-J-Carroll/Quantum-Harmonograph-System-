import React from 'react';
import { Complex } from 'mathjs';
import { motion } from 'framer-motion';
import { ColorInterpolator } from '../lib/harmonograph/ColorInterpolator';

interface QuantumStateDisplayProps {
  stateVector: Complex[];
}

export const QuantumStateDisplay: React.FC<QuantumStateDisplayProps> = ({ stateVector }) => {
  const probabilities = stateVector.map(state => 
    Math.pow(state.re, 2) + Math.pow(state.im, 2)
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-4 rounded-lg"
    >
      <h3 className="text-lg font-semibold mb-3 text-white">Quantum State Probabilities</h3>
      <div className="grid grid-cols-4 gap-2">
        {probabilities.map((prob, idx) => {
          const color = ColorInterpolator.getColorFromQuantumState(stateVector[idx]);
          return (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="relative bg-gray-700 p-2 rounded"
            >
              <div className="text-xs text-gray-400">|{idx.toString(2).padStart(Math.log2(stateVector.length), '0')}⟩</div>
              <div 
                className="absolute bottom-0 left-0 opacity-50"
                style={{ 
                  width: '100%',
                  height: `${prob * 100}%`,
                  backgroundColor: color,
                  transition: 'height 0.3s ease-in-out'
                }}
              />
              <div className="text-sm text-white relative z-10">
                {(prob * 100).toFixed(1)}%
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};