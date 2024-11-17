import * as THREE from 'three';

export class Harmonograph {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private line: THREE.Line;
  private points: THREE.Vector3[];

  constructor(container: HTMLElement) {
    // Setup Three.js scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
    
    // Initialize points array
    this.points = [];
    
    // Create line geometry
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    this.line = new THREE.Line(geometry, material);
    this.scene.add(this.line);
    
    // Set camera position
    this.camera.position.z = 5;
    
    // Start animation loop
    this.animate();
  }

  updatePattern(points: { x: number[], y: number[] }) {
    this.points = points.x.map((x, i) => new THREE.Vector3(x, points.y[i], 0));
    
    // Update line geometry
    const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
    this.line.geometry.dispose();
    this.line.geometry = geometry;
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    
    // Rotate the pattern slowly
    this.line.rotation.z += 0.001;
    
    this.renderer.render(this.scene, this.camera);
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose() {
    this.renderer.dispose();
    this.line.geometry.dispose();
    (this.line.material as THREE.Material).dispose();
  }
}