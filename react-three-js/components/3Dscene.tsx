'use dom';

//---------------------------- IMPORTS ----------------------------//
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import megaphone from "../assets/models/marketing-en-communication.glb";

//---------------------------- CONSTANTS ----------------------------//
const boxComposition = [
    { position: [0, 0, 0], size: [4, 4, 4], color: "black", label: "Center Box" },
    { position: [4, 3, -1], size: [2, 2, 2], color: "red", label: "Red Box" },
    { position: [4, -2.5, 0], size: [1.4, 1.4, 1.4], color: "blue", label: "Blue Box" },
    { position: [3, 0, 0], size: [1.2, 1.2, 1.2], color: "green", label: "Green Box" },
    { position: [-4, 0.5, 0], size: [1.1, 1.1, 1.1], color: "yellow", label: "Yellow Box" },
    { position: [-2.5, -3, 0], size: [1.6, 1.6, 1.6], color: "purple", label: "Purple Box" },
    { position: [-3, 3.2, 0], size: [1, 1, 1], color: "orange", label: "Orange Box" },
    { position: [-5, -2, 0], size: [1.8, 1.8, 1.8], color: "pink", label: "Pink Box" },
];

const materials = {
    glass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.293,
        transparent: true,
        opacity: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        ior: 1.5,
        side: THREE.DoubleSide,
    }),
    color: new THREE.MeshPhysicalMaterial({
        color: 0x87CEEB,
        metalness: 0.0,
        roughness: 0.802,
        transparent: true,
        opacity: 1.0,
    }),
};

const models = [megaphone, megaphone, megaphone, megaphone, megaphone, megaphone, megaphone, megaphone];


//---------------------------- FUNCTIONS ----------------------------//
const createLight = (scene) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
}

const createBoxes = (scene, boxData) => {
    boxComposition.forEach((boxData) => {
        const geometry = new THREE.BoxGeometry(...boxData.size as [number, number, number]);
        const material = new THREE.MeshStandardMaterial({
            color: boxData.color,
            transparent: true,
            opacity: 1,
            wireframe: true
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(...boxData.position as [number, number, number]);
        scene.add(cube);
    });
}

const createBoundingBox = (model: THREE.Group, color: string) => {
    // Calculate bounding box of the model
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Create wireframe box
    const boxGeometry = new THREE.BoxGeometry(size.x, size.x, size.x);
    const boxMaterial = new THREE.MeshBasicMaterial({
        color: 'green',
        wireframe: false,
        transparent: true,
        opacity: 0.5
    });
    const boundingBox = new THREE.Mesh(boxGeometry, boxMaterial);

    // boundingBox.position.copy(center);

    return boundingBox;
}

const loadGLBModel = (scene, modelPath, index) => {
    const loader = new GLTFLoader();

    loader.load(
        modelPath,
        (gltf) => {
            const model = gltf.scene;

            // Apply materials
            model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    if (child.name.includes("glass")) {
                        child.material = materials.glass;
                    } else {
                        child.material = materials.color;
                    }
                }
            });

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const boxSize = box.getSize(new THREE.Vector3());

            // Center the model at origin
            model.position.sub(center);


            // Calculate scale
            const sizeMax = boxComposition[index].size[0];
            const sizeOrig = Math.max(boxSize.x, boxSize.y, boxSize.z);
            const scale = sizeMax / sizeOrig;
            model.scale.setScalar(scale);

            model.rotation.y = -Math.PI / 2;

            model.updateMatrixWorld(true);

            const rotatedBox = new THREE.Box3().setFromObject(model);
            const rotatedCenter = rotatedBox.getCenter(new THREE.Vector3());
            const rotatedSize = rotatedBox.getSize(new THREE.Vector3());

            model.position.sub(rotatedCenter);

            model.updateMatrixWorld(true);

            const group = new THREE.Group();
            group.add(model);

            const finalBox = new THREE.Box3().setFromObject(model);
            const finalSize = finalBox.getSize(new THREE.Vector3());

            const boxGeometry = new THREE.BoxGeometry(finalSize.x, finalSize.y, finalSize.z);
            const boxMaterial = new THREE.MeshBasicMaterial({
                color: boxComposition[index].color,
                wireframe: true,
                transparent: true,
                opacity: 0.5
            });
            const boundingBox = new THREE.Mesh(boxGeometry, boxMaterial);

            group.add(boundingBox);

            group.position.set(...boxComposition[index].position as [number, number, number]);

            scene.add(group);
            console.log(`Model ${index} loaded successfully at:`, boxComposition[index].position);
        },
        undefined,
        (error) => {
            console.error(`Error loading model ${index}:`, error);
        }
    );

    return loader
}

const showModels = (scene) => {
    models.forEach((modelPath, index) => {
        if (index < boxComposition.length) {
            loadGLBModel(scene, modelPath, index);
        }
    });
}

const createCamera = (scene, size) => {
    const camera = new THREE.PerspectiveCamera(30, size.width / size.height, 0.1, 100);
    camera.position.set(0, 0, 20);
    scene.add(camera);

    return camera;
}

//---------------------------- COMPONENT ----------------------------//
export default function DOMComponent({ name }: { name: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        const camera = createCamera(scene, size);
        
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        createLight(scene);
        // createBoxes(scene, boxComposition);
        showModels(scene);

        let animationId: number;

        const draw = () => {
            controls.update();
            renderer.render(scene, camera);
            animationId = window.requestAnimationFrame(draw);
        };

        const handleResize = () => {
            size.width = window.innerWidth;
            size.height = window.innerHeight;

            camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();

            renderer.setSize(size.width, size.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        window.addEventListener('resize', handleResize);

        draw();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            window.cancelAnimationFrame(animationId);
            controls.dispose();
            renderer.dispose();

            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach(mat => mat.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <canvas
                ref={canvasRef}
                className="webgl"
                style={{ display: 'block', width: '100%', height: '100%' }}
            />
        </div>
    );
}