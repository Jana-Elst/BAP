// https://codesandbox.io/p/sandbox/11-pcktl?file=%2Fsrc%2Findex.js%3A90%2C1-91%2C1
//https://tympanus.net/codrops/2021/10/27/creating-the-effect-of-transparent-glass-and-plastic-in-three-js/

//react tree fiber & drei

'use dom';

//---------------------------- IMPORTS ----------------------------//
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import businessEnMedia from "../assets/models/businessEnMedia.glb";


//---------------------------- CONSTANTS ----------------------------//
const boxCompositions = [
    {
        total: 1,
        positions: [
            { position: [0, 0, 0], size: [4, 4, 4], color: "black", label: "Center Box" },
        ]
    },
    {
        total: 2,
        positions: [
            { position: [0, 0, 0], size: [4, 4, 4], color: "black", label: "Center Box" },
            { position: [4, 3, -1], size: [2, 2, 2], color: "red", label: "Red Box" },
        ]
    },
    {
        total: 3,
        positions: [
            { position: [0, 0, 0], size: [4, 4, 4], color: "black", label: "Center Box" },
            { position: [4, 3, -1], size: [2, 2, 2], color: "red", label: "Red Box" },
            { position: [4, -2.5, 0], size: [1.4, 1.4, 1.4], color: "blue", label: "Blue Box" }
        ]
    },
    {
        total: 4,
        positions: [
            { position: [0, 0, 0], size: [4, 4, 4], color: "black", label: "Center Box" },
            { position: [4, 3, -1], size: [2, 2, 2], color: "red", label: "Red Box" },
            { position: [4, -2.5, 0], size: [1.4, 1.4, 1.4], color: "blue", label: "Blue Box" },
            { position: [3, 0, 0], size: [1.2, 1.2, 1.2], color: "green", label: "Green Box" }]
    },
    {
        total: 5,
        positions: [
            { position: ['R-0', 'T+0.25', -1.5], rotation: [-20, -20, -20], size: [1, 1, 1], color: "black", label: "1", anchorPoint: 'bottom-left' },
            { position: ['R+0.35', 'B-0.25', -1.5], rotation: [-20, -20, -20], size: [1, 1, 1], color: "red", label: "2", anchorPoint: 'top-left' },
            { position: ['L-0.25', 'B+0.25', -1.5], rotation: [20, -20, -20], size: [1, 1, 1], color: "blue", label: "3", anchorPoint: 'top-right' },
            { position: ['L-1', 'T+2', -1.5], rotation: [-15, -20, 20], size: [1, 1, 1], color: "green", label: "4", anchorPoint: 'top-right' },
            { position: ['L+0', 'T+1', -1.5], rotation: [10, 20, 10], size: [1, 1, 1], color: "yellow", label: "5", anchorPoint: 'bottom-left' },
        ]
    },
    {
        total: 6,
        positions: [
            { position: [0, 0, 0], size: [4, 4, 4], color: "black", label: "Center Box" },
            { position: [4, 3, -1], size: [2, 2, 2], color: "red", label: "Red Box" },
            { position: [4, -2.5, 0], size: [1.4, 1.4, 1.4], color: "blue", label: "Blue Box" },
            { position: [3, 0, 0], size: [1.2, 1.2, 1.2], color: "green", label: "Green Box" },
            { position: [-4, 0.5, 0], size: [1.1, 1.1, 1.1], color: "yellow", label: "Yellow Box" },
            { position: [-2.5, -3, 0], size: [1.6, 1.6, 1.6], color: "purple", label: "Purple Box" },
        ]
    },
    {
        total: 7,
        positions: [
            { position: [0, 0, 0], size: [4, 4, 4], color: "black", label: "Center Box" },
            { position: [4, 3, -1], size: [2, 2, 2], color: "red", label: "Red Box" },
            { position: [4, -2.5, 0], size: [1.4, 1.4, 1.4], color: "blue", label: "Blue Box" },
            { position: [3, 0, 0], size: [1.2, 1.2, 1.2], color: "green", label: "Green Box" },
            { position: [-4, 0.5, 0], size: [1.1, 1.1, 1.1], color: "yellow", label: "Yellow Box" },
            { position: [-2.5, -3, 0], size: [1.6, 1.6, 1.6], color: "purple", label: "Purple Box" },
            { position: [-3, 3.2, 0], size: [1, 1, 1], color: "orange", label: "Orange Box" },
        ]
    },
    {
        total: 8,
        positions: [
            { position: [0, 0, 0], size: [4, 4, 4], color: "black", label: "Center Box" },
            { position: [4, 3, -1], size: [2, 2, 2], color: "red", label: "Red Box" },
            { position: [4, -2.5, 0], size: [1.4, 1.4, 1.4], color: "blue", label: "Blue Box" },
            { position: [3, 0, 0], size: [1.2, 1.2, 1.2], color: "green", label: "Green Box" },
            { position: [-4, 0.5, 0], size: [1.1, 1.1, 1.1], color: "yellow", label: "Yellow Box" },
            { position: [-2.5, -3, 0], size: [1.6, 1.6, 1.6], color: "purple", label: "Purple Box" },
            { position: [-3, 3.2, 0], size: [1, 1, 1], color: "orange", label: "Orange Box" },
            { position: [-5, -2, 0], size: [1.8, 1.8, 1.8], color: "pink", label: "Pink Box" },
        ]
    },

];

const textCompositions = [
    {
        total: 1,
        positions: [
            { position: [1, 2.5, -1], color: "black", startLine: [1, 2.5, 0] },
        ]
    },
    {
        total: 2,
        positions: [
            { position: [1, 2.5, -1], color: "black", startLine: [1, 2.5, 0] },
            { position: [5, 1.5, -1], color: "red", startLine: [5, 1.5, 0] },
        ]
    },
    {
        total: 3,
        positions: [
            { position: [1, 2.5, -1], color: "black", startLine: [1, 2.5, 0] },
            { position: [5, 1.5, -1], color: "red", startLine: [5, 1.5, 0] },
            { position: [3.5, -4, -1], color: "blue", startLine: [3.5, -4, 0] },
        ]
    },
    {
        total: 4,
        positions: [
            { position: [1, 2.5, -1], color: "black", startLine: [1, 2.5, 0] },
            { position: [5, 1.5, -1], color: "red", startLine: [5, 1.5, 0] },
            { position: [3.5, -4, -1], color: "blue", startLine: [3.5, -4, 0] },
            { position: [4, -1, -1], color: "green", startLine: [4, -1, 0] },
        ]
    },
    {
        total: 5,
        positions: [
            { position: [1, 2.5, -1], color: "black", startLine: [1, 2.5, 0] },
            { position: [5, 1.5, -1], color: "red", startLine: [5, 1.5, 0] },
            { position: [3.5, -4, -1], color: "blue", startLine: [3.5, -4, 0] },
            { position: [4, -1, -1], color: "green", startLine: [4, -1, 0] },
            { position: [-5.5, 1.5, -1], color: "yellow", startLine: [-5.5, 1.5, 0] },
        ]
    },
    {
        total: 6,
        positions: [
            { position: [1, 2.5, -1], color: "black", startLine: [1, 2.5, 0] },
            { position: [5, 1.5, -1], color: "red", startLine: [5, 1.5, 0] },
            { position: [3.5, -4, -1], color: "blue", startLine: [3.5, -4, 0] },
            { position: [4, -1, -1], color: "green", startLine: [4, -1, 0] },
            { position: [-5.5, 1.5, -1], color: "yellow", startLine: [-5.5, 1.5, 0] },
            { position: [-3.5, -4.5, -1], color: "purple", startLine: [-3.5, -4.5, 0] },
        ]
    },
    {
        total: 7,
        positions: [
            { position: [1, 2.5, -1], color: "black", startLine: [1, 2.5, 0] },
            { position: [5, 1.5, -1], color: "red", startLine: [5, 1.5, 0] },
            { position: [3.5, -4, -1], color: "blue", startLine: [3.5, -4, 0] },
            { position: [4, -1, -1], color: "green", startLine: [4, -1, 0] },
            { position: [-5.5, 1.5, -1], color: "yellow", startLine: [-5.5, 1.5, 0] },
            { position: [-3.5, -4.5, -1], color: "purple", startLine: [-3.5, -4.5, 0] },
            { position: [-4, 2.3, -1], color: "orange", startLine: [-4, 2.3, 0] },
        ]
    },
    {
        total: 8,
        positions: [
            { position: [1, 2.5, -1], color: "black", startLine: [1, 2.5, 0] },
            { position: [5, 1.5, -1], color: "red", startLine: [5, 1.5, 0] },
            { position: [3.5, -4, -1], color: "blue", startLine: [3.5, -4, 0] },
            { position: [4, -1, -1], color: "green", startLine: [4, -1, 0] },
            { position: [-5.5, 1.5, -1], color: "yellow", startLine: [-5.5, 1.5, 0] },
            { position: [-3.5, -4.5, -1], color: "purple", startLine: [-3.5, -4.5, 0] },
            { position: [-4, 2.3, -1], color: "orange", startLine: [-4, 2.3, 0] },
            { position: [-5, -0.7, -1], color: "pink", startLine: [-5, -0.7, 0] }
        ]
    },
];

const colors = {
    glass: 0xffffff,
    digital: 0x87CEEB,
};

const materials = {
    glass: new THREE.MeshPhysicalMaterial({
        transmission: 1,
        thickness: 1.5,
        roughness: 0.67,
        envMapIntensity: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        metalness: 0,
        ior: 1.5, // Index of refraction
    }),
    color: new THREE.MeshStandardMaterial({
        color: 0x87CEEB,
        roughness: 0.8023255467414856,
        metalness: 0,
        emissive: 0,
        envMapIntensity: 1,
        side: THREE.DoubleSide,
        blendColor: 0
    }),
    transparent: new THREE.MeshStandardMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0
    })
}

const models = [businessEnMedia, businessEnMedia, businessEnMedia, businessEnMedia, businessEnMedia, businessEnMedia, businessEnMedia, businessEnMedia];

//---------------------------- VARIABLES ----------------------------//
let startPositionLines = []; //numbers
let lenghtKeywords = 0;
let refPoints = {
    top: null,
    bottom: null,
    left: null,
    right: null
}
let scale = 1.0;

//---------------------------- FUNCTIONS ----------------------------//
const createLight = (scene) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
}

const createCamera = (scene, size) => {
    const camera = new THREE.PerspectiveCamera(30, size.width / size.height, 0.1, 100);
    camera.position.set(0, 0, 15);
    scene.add(camera);

    return camera;
}

const loadGLBModel = (scene, modelPath, boxInformation, type) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;
                let connectionPoints = [];

                // Apply materials
                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        if (child.name.includes("glass")) {
                            child.material = materials.glass;
                        } else if (child.name.includes("color")) {
                            child.material = materials.color;
                        } else {
                            child.material = materials.color;
                            connectionPoints.push(child);
                        }
                    }
                });

                const boundingBox = new THREE.Box3().setFromObject(model);
                const center = boundingBox.getCenter(new THREE.Vector3());
                const boxSize = boundingBox.getSize(new THREE.Vector3());

                // Create bounding box with the correct size
                const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);
                const boxMaterial = new THREE.MeshBasicMaterial({
                    color: boxInformation.color,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.0
                });
                const boundingBoxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
                boundingBoxMesh.position.copy(center);

                //create group model + bounding box
                const group = new THREE.Group();
                group.add(model);
                group.add(boundingBoxMesh);

                const maxSize = Math.max(boxSize.x, boxSize.y);
                scale = 2.0 / maxSize;
                // group.scale.set(scale, scale, scale);

                if (type === 'cluster') {
                    group.scale.set(scale, scale, scale);
                } else if (type === 'keyword') {
                    group.scale.set(1.5 / maxSize, 1.5 / maxSize, 1.5 / maxSize);
                }

                //center model
                group.position.x -= center.x;
                group.position.y -= center.y;
                group.position.z -= center.z;

                scene.add(group);

                if (type === 'keyword') {
                    //set position
                    const anchorPoint = boxInformation.anchorPoint.split('-');
                    console.log('Anchor Point:', anchorPoint);

                    //anchorPoint left-right
                    const positionXStr = boxInformation.position[0].replace('L-', `${refPoints.left}MIN`).replace('R-', `${refPoints.right}MIN`).replace('L', refPoints.left).replace('R', refPoints.right);
                    const positionYStr = boxInformation.position[1].replace('T-', `${refPoints.top}MIN`).replace('B-', `${refPoints.bottom}MIN`).replace('T', refPoints.top).replace('B', refPoints.bottom);

                    let positionX = 0;
                    let positionY = 0;

                    if (positionXStr.includes('+')) {
                        const positions = [parseFloat(positionXStr.split('+')[0]), parseFloat(positionXStr.split('+')[1])];
                        positionX = positions[0] + positions[1];
                    }

                    if (positionXStr.includes('MIN')) {
                        const positions = [parseFloat(positionXStr.split('MIN')[0]), parseFloat(positionXStr.split('MIN')[1])];
                        positionX = positions[0] - positions[1];
                    }

                    if (positionYStr.includes('+')) {
                        const positions = [parseFloat(positionYStr.split('+')[0]), parseFloat(positionYStr.split('+')[1])];
                        positionY = positions[0] + positions[1];
                    }

                    if (positionYStr.includes('MIN')) {
                        const positions = [parseFloat(positionYStr.split('MIN')[0]), parseFloat(positionYStr.split('MIN')[1])];
                        positionY = positions[0] - positions[1];
                    }

                    console.log('Anchor Point:', anchorPoint);
                    console.log('Position:', boxInformation.position);

                    //anchorPoint left-right
                    if (anchorPoint[1] === 'left') {
                        group.position.x = positionX + boxSize.x / 2;
                    } else if (anchorPoint[1] === 'right') {
                        group.position.x = positionX - boxSize.x / 2;
                    }

                    //anchorPoint top-bottom
                    if (anchorPoint[0] === 'top') {
                        group.position.y = positionY - boxSize.y / 2;
                    } else if (anchorPoint[0] === 'bottom') {
                        group.position.y = positionY + boxSize.y / 2;
                    }

                    // group.position.z = boxInformation.position[2] - boxSize.z / 2;
                    group.position.z = -boxSize.z / 2;
                }

                const groupSize = new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3());

                group.rotation.set(
                    THREE.MathUtils.degToRad(boxInformation.rotation[0]),
                    THREE.MathUtils.degToRad(boxInformation.rotation[1]),
                    THREE.MathUtils.degToRad(boxInformation.rotation[2])
                );

                console.log(`Model loaded successfully at:`, boxInformation.position);
                resolve(groupSize);
            },
            undefined,
            (error) => {
                console.error(`Error loading model`, error);
                reject(error);
            }
        );

        return loader
    })
};

const showModelsKeywords = async (scene, projectKeywords) => {
    const boxComposition = boxCompositions[lenghtKeywords - 1].positions;
    const loadPromises = models.map((modelPath, index) => {
        if (index < boxComposition.length) {
            const boxInformation = boxComposition[index];
            return loadGLBModel(scene, modelPath, boxInformation, 'keyword');
        }
        return Promise.resolve(); // Return resolved promise for skipped items
    });
    await Promise.all(loadPromises);
    console.log('All keywords loaded.');
};

const showModelCluster = async (scene, cluster) => {
    const boxInformation = { position: [0, 0, 0], rotation: [0, 0, 0], size: [1, 1, 1], color: "black", label: "1", anchorPoint: 'bottom-left' }
    const modelPath = businessEnMedia;
    const modelSize = await loadGLBModel(scene, modelPath, boxInformation, 'cluster');

    console.log('Model size:', modelSize); // { x, y, z }
    console.log('Width:', modelSize.x, 'Height:', modelSize.y, 'Depth:', modelSize.z);

    //draw points  
    refPoints.left = -modelSize.x / 2;
    refPoints.right = modelSize.x / 2;

    refPoints.top = modelSize.y / 2;
    refPoints.bottom = -modelSize.y / 2;

    pointsMiddle(scene, refPoints.right, refPoints.top, modelSize.z / 2, 'pink'); //top-right
    pointsMiddle(scene, refPoints.left, refPoints.top, modelSize.z / 2, 'pink'); //top-left
    pointsMiddle(scene, refPoints.right, refPoints.bottom, modelSize.z / 2, 'pink'); //bottom-right
    pointsMiddle(scene, refPoints.left, refPoints.bottom, modelSize.z / 2, 'pink'); //bottom-left

};

const pointsMiddle = (scene, x, y, z, color) => {
    const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: false
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(x, y, z);
    scene.add(sphere);
}

//---------------------------- BUILD SCENE ----------------------------//
const buildScene = async (scene, projectKeywords, cluster) => {
    createLight(scene);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    await showModelCluster(scene, cluster);

    if (lenghtKeywords > 0) {
        await showModelsKeywords(scene, projectKeywords);
    }
}

//---------------------------- COMPONENT ----------------------------//
interface Scene3DProps {
    name: string;
    projectKeywords: any[];
}

export default function Scene3DWithLabels({ name, projectKeywords }: Scene3DProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    lenghtKeywords = projectKeywords.length;

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const scene = new THREE.Scene();

        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        const camera = createCamera(scene, size);

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        renderer.sortObjects = true;

        const cluster = null;
        buildScene(scene, projectKeywords, cluster);

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
        <div style={{
            width: '100%',
            height: '100vh',
            position: 'relative',
        }}>
            <canvas
                ref={canvasRef}
                className="webgl"
                style={{
                    display: 'block', width: '100%', height: '100%', backgroundColor: 'grey'
                }}
            />
        </div>
    );
}