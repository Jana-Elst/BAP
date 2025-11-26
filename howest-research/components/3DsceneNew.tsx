//https://codesandbox.io/p/sandbox/11-pcktl?file=%2Fsrc%2Findex.js%3A90%2C1-91%2C1
//https://tympanus.net/codrops/2021/10/27/creating-the-effect-of-transparent-glass-and-plastic-in-three-js/

//react tree fiber & drei

'use dom';

//---------------------------- IMPORTS ----------------------------//
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import businessEnMedia from "../assets/models/businessEnMedia.glb";
import digitalSkillsEnMediaWijsheid from "../assets/models/digitalSkillsEnMediaWijsheid.glb";
import marketingEnCommunication from "../assets/models/marketingEnCommunication.glb";
import onderwijsEnVorming from "../assets/models/onderwijsEnVorming.glb";
import sharedCreativity from "../assets/models/sharedCreativity.glb";
import stemSteam from "../assets/models/stemSteam.glb";

//---------------------------- CONSTANTS ----------------------------//
//LUNA - Hier kan je de composities van de boxen aanpassen
/*
Dit is hoe een de constructie van 1 box eruit ziet:
{
    position: ['R-0', 'T+0.25', -1.5], Posite van de box TOV de hoofdbox (cluster). R = berekend vanaf rechterwand, L = berekend vanaf linkerwand, T = berekend vanaf top, B = berekend vanaf bottom
    rotation: [-20, -20, -20], Rotatie van de box in graden
    size: [1, 1, 1], Laat dit maar op 1 staan
    color: "black", Kleur van bounding box
    label: "1", Geef dit telkens 1, 2, 3, afh. hoeveelste box in de rij het is
    anchorPoint:'bottom-left' //vanaf welk punt van de box gerekend moet worden
    }
*/

/*
TEMPLATE
{ position: ['R-0', 'T+0.25', -1.5], rotation: [-20, -20, -20], size: [1, 1, 1], color: "black", label: "1", anchorPoint: 'bottom-left' },
*/

//LUNA - Stuur voor de z-positie

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
            { position: ['R-0', 'T+0', -1.5], rotation: [0, 0, 0], size: [1, 1, 1], color: "black", label: "1", anchorPoint: 'bottom-left' },
            { position: ['R+0', 'B-0', -1.5], rotation: [0, 0, 0], size: [1, 1, 1], color: "red", label: "2", anchorPoint: 'top-left' },
            { position: ['L-0', 'B+0', -1.5], rotation: [0, 0, 0], size: [1, 1, 1], color: "blue", label: "3", anchorPoint: 'top-right' },
            { position: ['L+0', 'T+0', -1.5], rotation: [0, 0, 0], size: [1, 1, 1], color: "green", label: "4", anchorPoint: 'bottom-right' },
            { position: ['R+0', 'T+0', -1.5], rotation: [0, 0, 0], size: [1, 1, 1], color: "yellow", label: "5", anchorPoint: 'top-left' },
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

//DEZE IS NOG NIET KLAAR
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
            { position: ['R-0', 'T+0', 0], color: "black", anchorPointObject: 'O', anchorPointText: '', anchorPoint: 'bottom-left' },
            { position: ['R-0', 'B+0', 0], color: "green", anchorPointObject: 'W', anchorPointText: '', anchorPoint: 'bottom-left' },
            { position: ['L-0', 'B+0', 0], color: "red", anchorPointObject: 'Z', anchorPointText: '', anchorPoint: 'bottom-left' },
            { position: ['L-0', 'T+0', 0], color: "orange", anchorPointObject: 'N', anchorPointText: '', anchorPoint: 'bottom-right' },
            { position: ['R-0', 'T+0', 0], color: "yellow", anchorPointObject: 'N', anchorPointText: '', anchorPoint: 'bottom-left' },
            { position: ['R-0', 'T+0', 0], color: "blue", anchorPointObject: 'N', anchorPointText: '', anchorPoint: 'bottom-left' },
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

//Constants for labels
const fontSize = 16;
const paddingWidht = 32; // pixels of padding on each side
const paddingHeight = 16; // pixels of padding on each side

//LUNA - materiaal instellingen hier aanpassen
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

const opacityBoundingBox = 1; //Toon of hide bounding box

//const models = [businessEnMedia, businessEnMedia, businessEnMedia, businessEnMedia, businessEnMedia, businessEnMedia, businessEnMedia, businessEnMedia];
const models = [digitalSkillsEnMediaWijsheid, marketingEnCommunication, onderwijsEnVorming, sharedCreativity, stemSteam, businessEnMedia, businessEnMedia];

//---------------------------- VARIABLES ----------------------------//
let connectionPoints = [];
let lenghtKeywords = 0;
let refPoints = {
    top: null,
    bottom: null,
    left: null,
    right: null
}
let scale = 1.0;
let sizeCluster = { x: 0, y: 0, z: 0 };

//---------------------------- FUNCTIONS ----------------------------//
const createLight = (scene) => {
    //LUNA - maak maar extra lichten aan en zo...
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
}

const createCamera = (scene, size) => {
    //LUNA - speel maar met de camera
    const camera = new THREE.PerspectiveCamera(30, size.width / size.height, 0.1, 100);
    camera.position.set(0, 0, 15);
    scene.add(camera);

    return camera;
}

const loadGLBModel = (scene, modelPath, boxInformation, textInformation, type) => {
    return new Promise((resolve, reject) => {
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
                        } else if (child.name.includes("color")) {
                            child.material = materials.color;
                        } else {
                            // child.material = materials.transparent;
                            child.visible = false;
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
                    opacity: opacityBoundingBox
                });
                const boundingBoxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
                boundingBoxMesh.position.copy(center);

                //center model and bounding box
                model.position.x -= center.x;
                model.position.y -= center.y;
                model.position.z -= center.z;
                boundingBoxMesh.position.x -= center.x;
                boundingBoxMesh.position.y -= center.y;
                boundingBoxMesh.position.z -= center.z;

                //create group model + bounding box
                const group = new THREE.Group();
                group.add(model);
                group.add(boundingBoxMesh);

                const maxSize = Math.max(boxSize.x, boxSize.y);
                if (type === 'cluster') {
                    scale = 2.0 / maxSize;
                }

                group.scale.set(scale, scale, scale);

                scene.add(group);

                const rotation = -Math.PI / 2;
                group.rotation.set(0, rotation, 0);

                const groupSize = new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3());
                if (type === 'keyword') {
                    //boxInformation = voorgedefinieerde informatie
                    //boxSize = brekende grooote van de box
                    //group = model + bounding box
                    const position = setPostionFromAnchorPoint(boxInformation, groupSize);
                    group.position.set(position.x, position.y, position.z);


                    const groupCenter = new THREE.Box3().setFromObject(group).getCenter(new THREE.Vector3());
                    anchorPointBox(scene, groupCenter, groupSize, boxInformation.anchorPoint);
                }

                group.rotation.set(
                    THREE.MathUtils.degToRad(boxInformation.rotation[0]),
                    THREE.MathUtils.degToRad(boxInformation.rotation[1]) + rotation,
                    THREE.MathUtils.degToRad(boxInformation.rotation[2])
                );

                group.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        if (child.name.includes(`anchorPoint${textInformation.anchorPointObject}`)) {
                            const worldPos = new THREE.Vector3();
                            child.getWorldPosition(worldPos);
                            connectionPoints.push(worldPos);
                        }
                    }
                });

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

const setPostionFromAnchorPoint = (boxInformation, boxSize) => {
    console.log('info ANCHOR', boxInformation, boxSize);

    //set position
    const anchorPoint = boxInformation.anchorPoint.split('-');

    //anchorPoint left-right
    const positionXStr = boxInformation.position[0].replace('L-', `${refPoints.left}MIN`).replace('R-', `${refPoints.right}MIN`).replace('L', refPoints.left).replace('R', refPoints.right);
    const positionYStr = boxInformation.position[1].replace('T-', `${refPoints.top}MIN`).replace('B-', `${refPoints.bottom}MIN`).replace('T', refPoints.top).replace('B', refPoints.bottom);

    let positionX = 0;
    let positionY = 0;

    let x, y, z;

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

    //anchorPoint left-right
    if (anchorPoint[1] === 'left') {
        x = positionX + boxSize.x / 2;
    } else if (anchorPoint[1] === 'right') {
        x = positionX - boxSize.x / 2;
    }

    //anchorPoint top-bottom
    if (anchorPoint[0] === 'top') {
        y = positionY - boxSize.y / 2;
    } else if (anchorPoint[0] === 'bottom') {
        y = positionY + boxSize.y / 2;
    }

    // z = boxInformation.position[2] - boxSize.z / 2;
    // z = -boxSize.z / 2;
    z = 0;

    return { x, y, z };
}


const showModelsKeywords = async (scene, projectKeywords) => {
    const boxComposition = boxCompositions[lenghtKeywords - 1].positions;
    const TextComposition = textCompositions[lenghtKeywords - 1].positions;
    const loadPromises = models.map((modelPath, index) => {
        if (index < boxComposition.length) {
            const boxInformation = boxComposition[index];
            const textInformation = TextComposition[index];
            return loadGLBModel(scene, modelPath, boxInformation, textInformation, 'keyword');
        }
        return Promise.resolve(); // Return resolved promise for skipped items
    });
    await Promise.all(loadPromises);
    console.log('All keywords loaded.');
};

const showModelCluster = async (scene, cluster) => {
    const boxInformation = { position: [0, 0, 0], rotation: [0, 0, 0], size: [1, 1, 1], color: "black", label: "1", anchorPoint: 'bottom-left' };
    const textInformation = { position: ['R-0', 'T+0', 0], color: "black", anchorPointObject: 'N', anchorPointText: '', anchorPoint: 'bottom-left' };
    const modelPath = businessEnMedia;
    const modelSize = await loadGLBModel(scene, modelPath, boxInformation, textInformation, 'cluster');

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

const anchorPointBox = (scene, groupCenter, boxSize, anchorPoint) => {
    const sphereGeometry = new THREE.SphereGeometry(0.05, 20, 20);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 'green',
        wireframe: false,
        opacity: opacityBoundingBox
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    if (anchorPoint === 'bottom-left') {
        sphere.position.set(groupCenter.x - boxSize.x / 2, groupCenter.y - boxSize.y / 2, groupCenter.z + boxSize.z / 2);
    }

    if (anchorPoint === 'top-left') {
        sphere.position.set(groupCenter.x - boxSize.x / 2, groupCenter.y + boxSize.y / 2, groupCenter.z + boxSize.z / 2);
    }

    if (anchorPoint === 'bottom-right') {
        sphere.position.set(groupCenter.x + boxSize.x / 2, groupCenter.y - boxSize.y / 2, groupCenter.z + boxSize.z / 2);
    }

    if (anchorPoint === 'top-right') {
        sphere.position.set(groupCenter.x + boxSize.x / 2, groupCenter.y + boxSize.y / 2, groupCenter.z + boxSize.z / 2);
    }
    scene.add(sphere);
}

//---------------------------- TEXT ----------------------------//
const showLabels = (scene, projectKeywords) => {
    // createTextBoxes(scene);

    const textComposition = textCompositions[lenghtKeywords - 1].positions;

    projectKeywords.forEach((keyword, index) => {
        const textInformation = textComposition[index];
        const connectionPointsInformation = connectionPoints[index + 1]

        const boxSize = createText(scene, keyword.Label, textComposition[index], 'white');
        createLines(scene, textComposition[index], connectionPointsInformation, boxSize);
    });

    //for cluster - JANA
    // createLines(scene, textComposition[0], connectionPoints[0]);
}

const createText = (scene, text: string, textComposition: [number, number, number], color: string) => {
    const font = `bold ${fontSize}px Arial`;

    // Create a canvas to draw text on
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set font before measuring
    context.font = font;

    // Measure text width
    const textMetrics = context.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;

    // Resize canvas to fit text
    canvas.width = textWidth + (paddingWidht * 2);
    canvas.height = textHeight + (paddingHeight * 2);

    // Re-set font after canvas resize (resize clears the canvas)
    // context.font = font;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Draw background
    context.fillStyle = 'black';
    context.beginPath();
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.closePath();
    context.fill();

    // Draw text
    context.fillStyle = 'white';
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
    const boxSize = new THREE.Box3().setFromObject(textBox).getSize(new THREE.Vector3());

    const position = setPostionFromAnchorPoint(textComposition, boxSize);
    textBox.position.set(position.x, position.y, position.z);

    textBox.renderOrder = 999;
    textBox.material.forEach(m => {
        if (m.depthTest === false) {
            m.depthWrite = false; // ADD THIS
        }
    });
    scene.add(textBox);

    return {
        x: boxSize.x,
        y: boxSize.y,
        z: boxSize.z
    };
}

const createLines = (scene, textComposition, connectionPoint, boxSize) => {
    console.log('Create line to:', textComposition);
    console.log('Start line at:', connectionPoint);

    const startPosition = setPostionFromAnchorPoint(textComposition, boxSize); //boxSize van tekst

    const points = [
        new THREE.Vector3(startPosition.x, startPosition.y, startPosition.z),
        new THREE.Vector3(connectionPoint.x, connectionPoint.y, connectionPoint.z),
    ];

    // // Create curve from points
    const curve = new THREE.CatmullRomCurve3(points);


    // // Create tube geometry for the line
    const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);

    // Create material with box color
    const lineMaterial = materials.color;

    const lineMesh = new THREE.Mesh(tubeGeometry, lineMaterial);
    lineMesh.renderOrder = -1;
    scene.add(lineMesh);

    //add sphere at begin and end
    const sphereGeometry = new THREE.SphereGeometry(0.05, 20, 20);
    const sphereMaterial = materials.color;
    const sphereStart = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereStart.position.set(startPosition.x, startPosition.y, startPosition.z);
    scene.add(sphereStart);

    const sphereEnd = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereEnd.position.set(connectionPoint.x, connectionPoint.y, connectionPoint.z);
    scene.add(sphereEnd);
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

    showLabels(scene, projectKeywords);
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
                    display: 'block', width: '100%', height: '100%',
                    backgroundColor: 'grey' //LUNA - Pas hier  de achtergrondkleur aan
                }}
            />
        </div>
    );
}