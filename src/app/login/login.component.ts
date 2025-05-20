import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as THREE from 'three';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particlesMesh!: THREE.Points;
  private torus!: THREE.Mesh;
  private octahedron!: THREE.Mesh;
  private icosahedron!: THREE.Mesh;
  private mouseX = 0;
  private mouseY = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    console.log('LoginComponent initialized');
    this.setupMouseMoveListener();
  }

  ngAfterViewInit() {
    console.log('AfterViewInit called');
    this.initThreeJS();
  }



  private setupMouseMoveListener(): void {
    document.addEventListener('mousemove', (event) => {
      this.mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  private initThreeJS(): void {
    // Setup scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x4F46E5,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particlesMesh);

    // Add shapes
    this.torus = this.addShape(
      new THREE.TorusGeometry(1, 0.3, 16, 100),
      0x4F46E5,
      { x: -2, y: 0, z: -5 }
    );

    this.octahedron = this.addShape(
      new THREE.OctahedronGeometry(1, 0),
      0xEC4899,
      { x: 2, y: 1, z: -3 }
    );

    this.icosahedron = this.addShape(
      new THREE.IcosahedronGeometry(0.8, 0),
      0x10B981,
      { x: 0, y: -1.5, z: -4 }
    );

    // Position camera
    this.camera.position.z = 5;

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Start animation
    this.animate();
  }

  private addShape(geometry: THREE.BufferGeometry, color: number, position: {x: number, y: number, z: number}): THREE.Mesh {
    const material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    this.scene.add(mesh);
    return mesh;
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    // Rotate shapes
    this.torus.rotation.x += 0.01;
    this.torus.rotation.y += 0.005;
    this.octahedron.rotation.x += 0.005;
    this.octahedron.rotation.y += 0.01;
    this.icosahedron.rotation.x += 0.01;
    this.icosahedron.rotation.z += 0.005;

    // Particle movement
    this.particlesMesh.rotation.y += 0.002;

    // Mouse interaction
    this.camera.position.x += (this.mouseX * 2 - this.camera.position.x) * 0.02;
    this.camera.position.y += (-this.mouseY * 2 - this.camera.position.y) * 0.02;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login(email, password, rememberMe).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Une erreur est survenue lors de la connexion';
      }
    });
  }
}
