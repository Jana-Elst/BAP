// https://codesandbox.io/p/sandbox/11-pcktl?file=%2Fsrc%2Findex.js%3A90%2C1-91%2C1
//https://tympanus.net/codrops/2021/10/27/creating-the-effect-of-transparent-glass-and-plastic-in-three-js/
'use dom';

//---------------------------- IMPORTS ----------------------------//
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import backgroundImage from "../assets/images/background-hologram.png";
import megaphone from "../assets/models/business-en-media.glb";
// import background from "../assets/enviroments/empty_warehouse_01_2k.hdr";


//---------------------------- CONSTANTS ----------------------------//
const background = "/empty_warehouse_01_2k.hdr";

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
            { position: [1.25, 0.35, -1.5], rotation: [-20, -20, -20], size: [1, 1, 1], color: "black", label: "1", anchorPoint: 'bottom-left' },
            { position: [1.1, -0.85, -1.5], rotation: [-20, -20, -20], size: [1, 1, 1], color: "red", label: "2", anchorPoint: 'top-left' },
            { position: [-1.1, -1.15, -1.5], rotation: [20, -20, -20], size: [1, 1, 1], color: "blue", label: "3", anchorPoint: 'top-left' },
            { position: [0.9, -1.3, -1.5], rotation: [-15, -20, 20], size: [1, 1, 1], color: "green", label: "4", anchorPoint: 'top-right' },
            { position: [-0.6, 1.2, -1.5], rotation: [10, 20, 10], size: [1, 1, 1], color: "yellow", label: "5", anchorPoint: 'bottom-left' },
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

let startPositionLines = []; //numbers

const colors = {
    glass: 0xffffff,
    digital: 0x87CEEB,
};

// const materials = {
//     glass: new THREE.MeshPhysicalMaterial({
//         // roughness: 1,
//         roughness: 0,
//         metalness: 0.1,
//         sheen: 0,
//         sheenColor: 0,
//         sheenRoughness: 1,
//         emissive: 0,
//         emissiveIntensity: 0,
//         specularIntensity: 1,
//         specularColor: 16777215,
//         clearcoat: 1,
//         clearcoatRoughness: 0,
//         dispersion: 0,
//         iridescence: 0,
//         iridescenceIOR: 1.3,
//         iridescenceThicknessRange: [100, 400],
//         anisotropy: 0,
//         envMapIntensity: 0.9,
//         reflectivity: 0.2,
//         transmission: 1,
//         thickness: 5,
//         attenuationColor: 16777215,
//         opacity: 0.7,
//         // opacity: 0.1,
//         transparent: true,
//         ior: 1.5,
//     }),
//     color: new THREE.MeshStandardMaterial({
//         color: 0x87CEEB,
//         roughness: 0.8023255467414856,
//         metalness: 0,
//         emissive: 0,
//         envMapIntensity: 1,
//         side: THREE.DoubleSide,
//         blendColor: 0
//     }),
// };

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
};

const models = [megaphone, megaphone, megaphone, megaphone, megaphone, megaphone, megaphone, megaphone];

//---------------------------- VARIABLES ----------------------------//
let lenghtKeywords = 0;

//---------------------------- FUNCTIONS ----------------------------//
const createLight = (scene) => {
    // // AmbientLight constructor takes (color, intensity)
    // const ambientLight = new THREE.AmbientLight(0x2236962, 1);
    // ambientLight.intensity = 3;
    // ambientLight.layers.mask = 1;

    // // DirectionalLight 1
    // const directionalLight1 = new THREE.DirectionalLight(0xCDCB67, 1);
    // directionalLight1.intensity = 2;
    // directionalLight1.position.set(9.78465163525888, 5.779565015314256, -3.8775094811620456);
    // directionalLight1.layers.mask = 1;
    // directionalLight1.castShadow = true;

    // // Configure shadow camera
    // directionalLight1.shadow.camera.left = -5;
    // directionalLight1.shadow.camera.right = 5;
    // directionalLight1.shadow.camera.top = 5;
    // directionalLight1.shadow.camera.bottom = -5;
    // directionalLight1.shadow.camera.near = 0.5;
    // directionalLight1.shadow.camera.far = 500;

    // // DirectionalLight 2
    // const directionalLight2 = new THREE.DirectionalLight(0xBBBBF3, 1);
    // directionalLight2.position.set(5.030294146954194, 10, 5.887691105957724);
    // directionalLight2.intensity = 2;
    // directionalLight2.layers.mask = 1;
    // directionalLight2.castShadow = true;

    // // Configure shadow camera
    // directionalLight2.shadow.camera.left = -5;
    // directionalLight2.shadow.camera.right = 5;
    // directionalLight2.shadow.camera.top = 5;
    // directionalLight2.shadow.camera.bottom = -5;
    // directionalLight2.shadow.camera.near = 0.5;
    // directionalLight2.shadow.camera.far = 500;

    // scene.add(ambientLight);
    // scene.add(directionalLight1);
    // scene.add(directionalLight2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
}

const createBoxes = (scene, boxCompositions) => {
    // const boxComposition = boxCompositions[lenghtKeywords - 1].positions;
    const boxComposition = boxCompositions[5 - 1].positions;

    const box = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
        color: 'black',
        transparent: true,
        opacity: 1,
        wireframe: true
    });
    const mainBox = new THREE.Mesh(box, material);
    mainBox.position.set(0, 0, 0);
    scene.add(mainBox);

    boxComposition.forEach((boxData) => {
        // Create a small sphere to visualize the position
        const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: boxData.color,
            wireframe: false
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(...boxData.position as [number, number, number]);
        scene.add(sphere);

        // Create the box
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

        // Get box measurements
        const boundingBox = new THREE.Box3().setFromObject(cube);
        const size = boundingBox.getSize(new THREE.Vector3());
        const center = boundingBox.getCenter(new THREE.Vector3());
        // cube.rotation.set(...((boxData.rotation as [number, number, number]).map(deg => THREE.MathUtils.degToRad(deg))));
        console.log('Box Measurements:', {
            width: size.x,
            height: size.y,
            depth: size.z,
            centerX: center.x,
            centerY: center.y,
            centerZ: center.z
        });

        //reposition cubes
        //anchorPoint left-right
        const anchorPoint = boxData.anchorPoint.split('-');
        console.log('Anchor Point:', anchorPoint);
        if (anchorPoint[1] === 'left') {
            cube.position.x = center.x + size.x / 2;
        } else if (anchorPoint[1] === 'right') {
            cube.position.x = center.x - size.x / 2;
        }

        //anchorPoint top-bottom
        if (anchorPoint[0] === 'top') {
            cube.position.y = center.y - size.y / 2;
        } else if (anchorPoint[0] === 'bottom') {
            cube.position.y = center.y + size.y / 2;
        }

        // cube.rotation.set(...((boxData.rotation as [number, number, number]).map(deg => THREE.MathUtils.degToRad(deg))));
    });
}

const createTextBoxes = (scene, textCompositions) => {
    const textComposition = textCompositions[lenghtKeywords - 1].positions;

    textComposition.forEach((textData) => {
        const geometry = new THREE.BoxGeometry(2, 0.5, 0.01);
        const material = new THREE.MeshStandardMaterial({
            color: textData.color,
            transparent: false,
            opacity: 1,
            wireframe: false
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(...textData.position as [number, number, number]);
        scene.add(cube);
    });
}

const createBoundingBox = (model: THREE.Group, color: string) => {
    // Calculate bounding box of the model
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Create wireframe box
    const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
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
    return new Promise((resolve, reject) => {
        const boxComposition = boxCompositions[lenghtKeywords - 1].positions;

        const loader = new GLTFLoader();
        console.log('LOADING MODEL', modelPath);

        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;
                let switchColorChild = null;

                // Apply materials
                model.traverse((child) => {
                    if (child.name === "switchcolor" || child.name.includes("switchcolor")) {
                        switchColorChild = child;
                    }
                    if (child instanceof THREE.Mesh) {
                        if (child.name.includes("glass")) {
                            child.material = materials.glass;
                        } else {
                            child.material = materials.color;
                        }
                    }
                });

                const boundingBox = new THREE.Box3().setFromObject(model);
                const center = boundingBox.getCenter(new THREE.Vector3());
                const boxSize = boundingBox.getSize(new THREE.Vector3());

                const group = new THREE.Group();
                group.add(model);

                // Create bounding box with the correct size
                const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);
                const boxMaterial = new THREE.MeshBasicMaterial({
                    color: 'green',
                    wireframe: true,
                    transparent: true,
                    opacity: 0.5
                });
                const boundingBoxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
                boundingBoxMesh.position.set(center.x, center.y, center.z);
                group.add(boundingBoxMesh);

                scene.add(group);      


                //add start position for lines
                if (switchColorChild) {
                    const worldPosition = new THREE.Vector3();
                    switchColorChild.getWorldPosition(worldPosition);
                    startPositionLines.push(worldPosition);
                }

                console.log(`Model ${index} loaded successfully at:`, boxComposition[index].position);
                // resolve();
            },
            undefined,
            (error) => {
                console.error(`Error loading model ${index}:`, error);
                reject(error);
            }
        );

        return loader
    }
    )
};

const showModels = async (scene, projectKeywords) => {
    const boxComposition = boxCompositions[lenghtKeywords - 1].positions;
    const loadPromises = models.map((modelPath, index) => {
        if (index < boxComposition.length) {
            return loadGLBModel(scene, modelPath, index);
        }
        return Promise.resolve(); // Return resolved promise for skipped items
    });

    // Wait for all models to load
    await Promise.all(loadPromises);
    console.log('All models loaded.');
}

const showLabels = (scene, projectKeywords) => {
    console.log('SHOW LABELS', projectKeywords);
    const textComposition = textCompositions[lenghtKeywords - 1].positions;
    console.log('TEXT COMPOSITION', textComposition);

    projectKeywords.forEach((keywords, index) => {
        console.log('LABEL TEXT', keywords.Label);
        create3DText(scene, keywords.Label, textComposition[index].position, 'black');
    });
}

const createCamera = (scene, size) => {
    const camera = new THREE.PerspectiveCamera(30, size.width / size.height, 0.1, 100);
    camera.position.set(0, 0, 20);
    scene.add(camera);

    return camera;
}

const create3DText = (scene, text: string, position: [number, number, number], color: string) => {
    console.log('TEXT')
    const fontSize = 48;
    const paddingWidht = 32; // pixels of padding on each side
    const paddingHeight = 16; // pixels of padding on each side

    // Create a canvas to draw text on
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set font before measuring
    context.font = `bold ${fontSize}px Arial`;

    // Measure text width
    const textMetrics = context.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;

    // Calculate padding
    const totalWidth = textWidth + (paddingWidht * 2);
    const totalHeight = textHeight + (paddingHeight * 2);

    // Resize canvas to fit text
    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Re-set font after canvas resize (resize clears the canvas)
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Draw background with rounded corners
    const cornerRadius = totalHeight / 2;
    context.fillStyle = `#${colors.digital.toString(16)}`;
    context.beginPath();
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.closePath();
    context.fill();


    // Draw text
    context.fillStyle = 'black';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    // texture.needsUpdate = true;

    // Calculate box width based on aspect ratio
    const boxHeight = 0.5;
    const aspectRatio = canvas.width / canvas.height;
    const boxWidth = boxHeight * aspectRatio;

    // Create materials array - one for each face of the box
    // Box faces order: [right, left, top, bottom, front, back]
    const material = [
        materials.color, // right side - no texture
        materials.color, // left side - no texture
        materials.color, // top - no texture
        materials.color, // bottom - no texture
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide, depthTest: false, depthWrite: false }), // front - with texture
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide, depthTest: false, depthWrite: false })  // back - with texture
    ];

    // Create box with rounded corners
    const geometry = new RoundedBoxGeometry(boxWidth, boxHeight, 0.001, 8, 0);
    const textBox = new THREE.Mesh(geometry, material);
    textBox.position.set(...position);

    textBox.renderOrder = 999;
    textBox.material.forEach(m => {
        if (m.depthTest === false) {
            m.depthWrite = false; // ADD THIS
        }
    });
    scene.add(textBox);
}

const createLines = (scene) => {
    const textComposition = textCompositions[lenghtKeywords - 1].positions;

    textComposition.forEach((box, index) => {
        const points = [
            new THREE.Vector3(box.startLine[0], box.startLine[1], box.startLine[2]),
            new THREE.Vector3(startPositionLines[index].x, startPositionLines[index].y, startPositionLines[index].z),
        ];

        // // Create curve from points
        const curve = new THREE.CatmullRomCurve3(points);


        // // Create tube geometry for the line
        const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);

        // Create material with box color
        const lineMaterial = new THREE.MeshBasicMaterial({
            color: box.color,
            transparent: true,
            opacity: 0.8,
            depthTest: true,
        });

        const lineMesh = new THREE.Mesh(tubeGeometry, lineMaterial);
        lineMesh.renderOrder = -1;
        scene.add(lineMesh);
    });

    // Optional: Add a sphere at the start position to visualize it
    // const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // const startSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // startSphere.position.copy(startPosition);
    // scene.add(startSphere);
}

const buildScene = async (scene, projectKeywords) => {
    createLight(scene);
    console.log('projectKeywords length:', projectKeywords);

    try {
        const environmentLoader = new HDRLoader();
        const envMap = await environmentLoader.loadAsync(background);
        envMap.mapping = THREE.EquirectangularReflectionMapping;

        // Update the glass material with the environment map
        materials.glass.envMap = envMap;
        materials.glass.needsUpdate = true;

        console.log('HDR environment loaded successfully');
    } catch (error) {
        console.error('Failed to load HDR environment:', error);
    }

    if (lenghtKeywords > 0) {
        // createBoxes(scene, boxCompositions);
        // createTextBoxes(scene, textCompositions);
        // showLabels(scene, projectKeywords);

        await showModels(scene, projectKeywords);
        // createLines(scene);
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

        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        renderer.sortObjects = true;

        buildScene(scene, projectKeywords);

        let animationId: number;

        const draw = () => {
            // controls.update();
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