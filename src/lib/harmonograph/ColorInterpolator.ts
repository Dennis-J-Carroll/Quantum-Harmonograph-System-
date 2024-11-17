import { Complex } from 'mathjs';

export class ColorInterpolator {
  private static hslToRgb(h: number, s: number, l: number): string {
    h = h % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c/2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (60 <= h && h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (120 <= h && h < 180) {
      [r, g, b] = [0, c, x];
    } else if (180 <= h && h < 240) {
      [r, g, b] = [0, x, c];
    } else if (240 <= h && h < 300) {
      [r, g, b] = [x, 0, c];
    } else if (300 <= h && h < 360) {
      [r, g, b] = [c, 0, x];
    }
    
    return `#${Math.round((r + m) * 255).toString(16).padStart(2, '0')}${
      Math.round((g + m) * 255).toString(16).padStart(2, '0')}${
      Math.round((b + m) * 255).toString(16).padStart(2, '0')}`;
  }

  static getColorFromQuantumState(state: Complex): string {
    const amplitude = Math.sqrt(state.re * state.re + state.im * state.im);
    const phase = Math.atan2(state.im, state.re);
    
    const hue = ((phase + Math.PI) / (2 * Math.PI)) * 360;
    const saturation = 0.8;
    const lightness = 0.3 + amplitude * 0.4;
    
    return this.hslToRgb(hue, saturation, lightness);
  }

  static getGradientColors(states: Complex[]): string[] {
    return states.map(state => this.getColorFromQuantumState(state));
  }
}