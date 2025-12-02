'use dom';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import businessMedia from "../../assets/models/businessMedia.glb";


export default function Scene3D() {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Additional lights for glass reflections
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(3, 8, 3);
    spotLight.angle = Math.PI / 6;
    scene.add(spotLight);

    // Enable environment map for better glass reflections
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Load GLB model
    let model;
    const loader = new GLTFLoader();
    loader.load(
        businessMedia,
        (gltf) => {
            model = gltf.scene;

            model.traverse((child) => {
                if (child.isMesh && child.material) {
                    const mat = child.material;
                    // Check if it's a glass/transparent material
                    if (mat.transparent || mat.transmission > 0 || mat.name?.toLowerCase().includes('glass')) {
                        mat.roughness = 0.8; // Higher roughness = more frosted
                        mat.metalness = 0.0;
                        mat.transmission = 0.6; // Reduce transmission for frosted look
                        mat.thickness = 0.5;
                        mat.ior = 1.5;
                        mat.opacity = 0.7;
                        mat.transparent = true;
                        mat.needsUpdate = true;
                    }
                }
            });
            
            scene.add(model);

            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            // Adjust camera to fit the model
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            camera.position.z = maxDim * 2;
            controls.update();
        },
        (progress) => {
            console.log('Loading:', (progress.loaded / progress.total * 100).toFixed(1) + '%');
        },
        (error) => {
            console.error('Error loading model:', error);
        }
    );

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        if (model) {
            model.rotation.y += 0.005;
        }

        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}