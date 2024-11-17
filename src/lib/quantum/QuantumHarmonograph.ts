import { Complex, create, all } from 'mathjs';
const math = create(all);

export class QuantumHarmonograph {
  private nQubits: number;
  private frequencies: number[];
  private phases: number[];

  constructor(nQubits: number) {
    this.nQubits = nQubits;
    this.frequencies = Array(nQubits).fill(0);
    this.phases = Array(nQubits).fill(0);
  }

  setParameters(frequencies: number[], phases: number[]) {
    if (frequencies.length !== this.nQubits || phases.length !== this.nQubits) {
      throw new Error('Parameter arrays must match number of qubits');
    }
    this.frequencies = frequencies;
    this.phases = phases;
  }

  generatePattern(steps: number): { x: number[], y: number[], z: number[] } {
    const x: number[] = [];
    const y: number[] = [];
    const z: number[] = [];
    
    for (let t = 0; t < steps; t++) {
      const time = t * (2 * Math.PI) / steps;
      let xCoord = 0;
      let yCoord = 0;
      let zCoord = 0;

      for (let i = 0; i < this.nQubits; i++) {
        const frequency = this.frequencies[i];
        const phase = this.phases[i];
        
        xCoord += Math.sin(frequency * time + phase);
        yCoord += Math.cos(frequency * time + phase);
        zCoord += Math.sin(frequency * time + phase) * Math.cos(frequency * time);
      }

      x.push(xCoord);
      y.push(yCoord);
      z.push(zCoord);
    }

    return { x, y, z };
  }

  simulateQuantumState(): Complex[] {
    const stateVector: Complex[] = Array(Math.pow(2, this.nQubits))
      .fill(0)
      .map(() => math.complex(0, 0));
    
    // Initialize ground state
    stateVector[0] = math.complex(1, 0);
    
    // Apply quantum operations
    for (let i = 0; i < this.nQubits; i++) {
      this.applyRotation(stateVector, i, this.frequencies[i], this.phases[i]);
    }
    
    return stateVector;
  }

  private applyRotation(state: Complex[], qubit: number, frequency: number, phase: number) {
    const n = Math.pow(2, this.nQubits);
    const newState: Complex[] = Array(n).fill(0).map(() => math.complex(0, 0));
    
    for (let i = 0; i < n; i++) {
      if ((i & (1 << qubit)) === 0) {
        const j = i | (1 << qubit);
        const cos = Math.cos(frequency / 2);
        const sin = Math.sin(frequency / 2);
        
        newState[i] = math.complex(
          cos * (state[i] as any).re - sin * (state[j] as any).re,
          cos * (state[i] as any).im - sin * (state[j] as any).im
        );
        
        newState[j] = math.complex(
          sin * (state[i] as any).re + cos * (state[j] as any).re,
          sin * (state[i] as any).im + cos * (state[j] as any).im
        );
      }
    }
    
    for (let i = 0; i < n; i++) {
      state[i] = newState[i];
    }
  }
}