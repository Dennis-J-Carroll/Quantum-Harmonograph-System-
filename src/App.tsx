import { useState } from 'react';
import { HarmonographVisualizer } from './components/HarmonographVisualizer';

function App() {
  const [nQubits] = useState(4);
  const [frequencies, setFrequencies] = useState([1, 2, 3, 4]);
  const [phases, setPhases] = useState([0, Math.PI/4, Math.PI/2, 3*Math.PI/4]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Quantum Harmonograph</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Visualization</h2>
            <div className="aspect-square">
              <HarmonographVisualizer
                nQubits={nQubits}
                frequencies={frequencies}
                phases={phases}
              />
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Controls</h2>
            <div className="space-y-6">
              {frequencies.map((freq, i) => (
                <div key={`freq-${i}`} className="space-y-2">
                  <label className="block text-sm font-medium">
                    Frequency {i + 1}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={freq}
                    onChange={(e) => {
                      const newFreq = [...frequencies];
                      newFreq[i] = parseFloat(e.target.value);
                      setFrequencies(newFreq);
                    }}
                    className="w-full"
                  />
                  <label className="block text-sm font-medium">
                    Phase {i + 1}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={2 * Math.PI}
                    step="0.1"
                    value={phases[i]}
                    onChange={(e) => {
                      const newPhases = [...phases];
                      newPhases[i] = parseFloat(e.target.value);
                      setPhases(newPhases);
                    }}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;