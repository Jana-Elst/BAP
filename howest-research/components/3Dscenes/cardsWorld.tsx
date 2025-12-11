//https://codepen.io/chungeric/pen/oNEoKjg

'use dom';

//---------------------------- IMPORTS ----------------------------//
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';


import gsap from 'gsap';
import { useEffect, useRef } from 'react';

import InfiniteScrollHero from './infiniteScrollHero';
import ProjectCard3D from './projectCard3D';

import { getProjectInfo } from '../../scripts/getData';
import getPositions from '../../scripts/placeCards';

//---------------------------- CONSTANTS ----------------------------//
const cardWidth = 320; // From ProjectCard3D
const cardHeight = 380; // From ProjectCard3D

//---------------------------- VARS ----------------------------//
//--- general
let totalProjects;
let scene;
let cardObjects: CSS3DObject[] = []; //array with the 3D objects for all the cards
let controls;
let cardPositions = []; //array with positions for all the cards, relative to the frame

//--- discover mode
const gridScale = 1.3;
const gridSize = {
    w: innerWidth * gridScale,
    h: innerHeight * gridScale
};

const cardsPerCanvas = 5;

let gridCols;
let gridRows;
let totalCanvasses;
let heroCanvas: CSS3DObject | null = null; // ADD: Reference to hero canvas
let cardPositionsDiscover = [];

let state = {
    scroll: {
        ease: 0.05,
        scale: 2,
        current: { x: 0, y: 0 },
        target: { x: 0, y: 0 },
        last: { x: 0, y: 0 },
        position: { x: 0, y: 0 },
    },
    direction: { x: 1, y: 1 },
    isDown: false,
    startX: 0,
    startY: 0,
    screen: { width: window.innerWidth, height: window.innerHeight },
    viewport: { width: 0, height: 0 },
};

//--- gallery mode
let cardPositionsGrid = [];

//---------------------------- HELPER FUNCTIONS ----------------------------//
//--- make the viewport = inner size
const calculateCameraZForScreen = (camera: THREE.PerspectiveCamera, screenHeight: number) => {
    const fov = camera.fov * (Math.PI / 180);
    // Rearranged formula: z = height / (2 * tan(fov/2))
    const z = screenHeight / (2 * Math.tan(fov / 2));
    return z;
};

const calculateViewport = (camera: THREE.PerspectiveCamera) => {
    const fov = camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * camera.position.z;
    const width = height * camera.aspect;

    return { height, width };
};

//--- create the cards
const createHeroCanvas = (projects, page, setPage, setVisible) => {
    const div = document.createElement('div');
    div.style.width = `${gridSize.w}px`;
    div.style.height = `${gridSize.h}px`;
    const root = createRoot(div);

    root.render(
        <>
            <InfiniteScrollHero projects={projects} cardsPerCanvas={cardsPerCanvas} page={page} setPage={setPage} setVisible={setVisible} />
        </>
    );


    const css3DObject = new CSS3DObject(div);
    css3DObject.name = 'heroCanvas';

    const positionX = 0;
    const positionY = 0;
    css3DObject.position.set(positionX, positionY, 0);
    return css3DObject;
}

const createCard3DObject = (project, position, page, setPage, setVisible) => {
    const div = document.createElement('div');
    div.style.width = `${cardWidth}px`;
    div.style.height = `${cardHeight}px`;
    const root = createRoot(div);

    root.render(
        <ProjectCard3D
            page={page}
            setPage={setPage}
            setVisible={setVisible}
            project={project}
        />
    );

    const css3DObject = new CSS3DObject(div);

    if (!position) {
        console.error('ERROR: Position is undefined in createCard3DObject for project:', project);
        // Set a default position or return to avoid crash
        css3DObject.position.set(0, 0, 0);
    } else {
        css3DObject.position.set(position.x, position.y, position.z);
    }

    return css3DObject;
}

const createCardCSS3DObjects = (projects, page, setPage, setVisible) => {
    if (cardObjects.length === 0) {
        projects.forEach((project, index) => {
            const projectInfo = getProjectInfo(project.id);
            const position = cardPositions[index];
            console.log('position CARDS', position);
            const cardObject = createCard3DObject(projectInfo, position, page, setPage, setVisible);
            cardObjects.push(cardObject);
        });
    }
}

// 1. bereken hoeveel canvasses er moeten zijn -> zorg dat dit een rechthoek wordt
// 2. geef elk project een position op het grote canvas. + zorg dat in het midden geen kaartjes zijn. 
const calculateCardPositions = (totalWidth: number, totalHeight: number) => {
    if (cardPositionsDiscover.length === 0) {
        const positions = getPositions(
            totalProjects, totalWidth, totalHeight, cardWidth, cardHeight, gridSize.w, gridSize.h
        );

        // Center positions within the grid
        const centeredPositions = positions.map(pos => ({
            x: pos.x - totalWidth / 2 + cardWidth / 2,
            y: pos.y - totalHeight / 2 + cardHeight / 2,
            z: pos.z || 0
        }));

        cardPositionsDiscover.push(...centeredPositions);
        return centeredPositions;
    }
    return cardPositionsDiscover;
}

const calculateCardPositionsGrid = (width: number, height: number) => {
    const gap = 16;
    const cardsPerRow = Math.floor(width / (cardWidth + gap));
    const rows = Math.ceil(totalProjects / cardsPerRow);

    const positions = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cardsPerRow; j++) {
            const x = (j - (cardsPerRow - 1) / 2) * (cardWidth + gap);
            const y = -i * (cardHeight + gap) + (cardHeight + gap) / 2;
            positions.push({ x, y, z: 0 });

            console.log('position XXX', x, y);
        }
    }
    return positions;
}

//--- create a scene
const setupCSS3DRenderer = (canvas: HTMLCanvasElement) => {
    const rendererCCS3D = new CSS3DRenderer();
    rendererCCS3D.setSize(window.innerWidth, window.innerHeight);
    rendererCCS3D.domElement.style.position = 'absolute';
    rendererCCS3D.domElement.style.top = '0';
    canvas.parentElement?.appendChild(rendererCCS3D.domElement);
    console.log('CSS3DRenderer created')
    return rendererCCS3D;
}

const createCamera = () => {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 50000);
    camera.position.z = calculateCameraZForScreen(camera, window.innerHeight);
    console.log('camera created')
    return camera;
}

//---------------------------- FUNCTION ----------------------------//
const cardsWorld = ({ projects, page, setPage, setVisible, isDiscoverMode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    heroCanvas = createHeroCanvas(projects, page, setPage, setVisible);

    useEffect(() => {
        if (!canvasRef.current) return;

        //--- calculate the total number of projects and canvasses
        totalProjects = projects.length;
        totalCanvasses = Math.ceil(totalProjects / cardsPerCanvas);
        gridCols = Math.ceil(Math.sqrt(totalCanvasses));
        gridRows = Math.ceil(totalCanvasses / gridCols);
        const totalWidth = gridCols * gridSize.w;
        const totalHeight = gridRows * gridSize.h;

        cardPositionsDiscover = calculateCardPositions(totalWidth, totalHeight);
        cardPositionsGrid = calculateCardPositionsGrid(window.innerWidth, window.innerHeight);

        if (isDiscoverMode) {
            cardPositions = cardPositionsDiscover;
        } else {
            cardPositions = cardPositionsGrid;
        }

        createCardCSS3DObjects(projects, page, setPage, setVisible);

        const canvas = canvasRef.current;
        const camera = createCamera();
        const rendererCCS3D = setupCSS3DRenderer(canvas);

        if (!scene) {
            scene = new THREE.Scene();
        }

        //--- add cards to scene
        cardObjects.forEach(cardObject => {
            scene.add(cardObject);
        });


        if (isDiscoverMode) {
            cardObjects.forEach((cardObject, index) => {
                cardObject.position.set(
                    cardPositionsDiscover[index].x,
                    cardPositionsDiscover[index].y,
                    0);
            });
            const oldHero = scene.getObjectByName('heroCanvas');
            if (!oldHero) scene.add(heroCanvas);
        } else {
            cardObjects.forEach((cardObject, index) => {
                cardObject.position.set(
                    cardPositionsGrid[index].x,
                    cardPositionsGrid[index].y,
                    0);
            });
            const oldHero = scene.getObjectByName('heroCanvas');
            if (oldHero) scene.remove(oldHero);
        }


        //--- controls
        controls = new OrbitControls(camera, rendererCCS3D.domElement);
        controls.rotateSpeed = 0;

        if (isDiscoverMode) {
            controls.touches = {
                ONE: THREE.TOUCH.PAN,
                TWO: THREE.TOUCH.DOLLY_PAN,
            }
        } else {
            controls.touches = {
                ONE: THREE.TOUCH.PAN,
            }
        }

        controls.maxDistance = 7000;
        controls.minDistance = 500;

        controls.zoomSpeed = 1;
        controls.panSpeed = 1;
        controls.zoomToCursor = true;

        //--- event handlers
        const handleResize = () => {
            state.screen = {
                width: window.innerWidth,
                height: window.innerHeight,
            };

            gridSize.w = window.innerWidth * gridScale;
            gridSize.h = window.innerHeight * gridScale;

            rendererCCS3D.setSize(window.innerWidth, window.innerHeight);
            // rendererCCS3D.setSize(state.screen.width, state.screen.height);
            camera.aspect = state.screen.width / state.screen.height;
            camera.updateProjectionMatrix();

            camera.position.z = calculateCameraZForScreen(camera, window.innerHeight);
            state.viewport = calculateViewport(camera);
        };


        //--- render
        let animationId: number;
        const render = () => {
            rendererCCS3D.render(scene, camera);
            animationId = requestAnimationFrame(render);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            rendererCCS3D.domElement.remove();

            controls.dispose();
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((mat) => mat.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        };

    }, [projects, isDiscoverMode]);


    //---------------------------- HTML ----------------------------//
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            position: 'relative',
            touchAction: 'none'
        }}>
            <canvas
                ref={canvasRef}
                className="webgl"
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#F0F0F0',
                }}
            />
        </div>
    );
}

export default cardsWorld;