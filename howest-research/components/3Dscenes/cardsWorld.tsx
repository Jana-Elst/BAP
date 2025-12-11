//https://codepen.io/chungeric/pen/oNEoKjg

'use dom';

//---------------------------- IMPORTS ----------------------------//
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import InfiniteScrollHero from './infiniteScrollHero';
import ProjectCard3D from './projectCard3D';

import { getProjectInfo } from '../../scripts/getData';
import getPositions from '../../scripts/placeCards';

//---------------------------- CONSTANTS ----------------------------//
const cardWidth = 320; // From ProjectCard3D
const cardHeight = 380; // From ProjectCard3D
const gridScale = 1.3;
const gridSize = {
    w: innerWidth * gridScale,
    h: innerHeight * gridScale
};

const cardsPerCanvas = 5;

let gridCols;
let gridRows;

//---------------------------- VARS ----------------------------//
let totalProjects;
let totalCanvasses;
let cardPositions = []; //array with positions for all the cards, relative to the frame
let cardObjects: CSS3DObject[] = []; //array with the 3D objects for all the cards
let absoluteCardPositions = [];
let heroCanvas: CSS3DObject | null = null; // ADD: Reference to hero canvas
let frameBorderObjects: CSS3DObject[] = []; // array with the borders for the frames

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
            const position = absoluteCardPositions[index];
            console.log('position CARDS', position);
            const cardObject = createCard3DObject(projectInfo, position, page, setPage, setVisible);
            cardObjects.push(cardObject);
        });
    }
}

// 1. bereken hoeveel canvasses er moeten zijn -> zorg dat dit een rechthoek wordt
// 2. geef elk project een position op het grote canvas. + zorg dat in het midden geen kaartjes zijn. 
const calculateCardPositions = (totalWidth: number, totalHeight: number) => {
    if (cardPositions.length === 0) {
        const positions = getPositions(
            totalProjects, totalWidth, totalHeight, cardWidth, cardHeight, gridSize.w, gridSize.h
        );

        // Center positions within the grid
        const centeredPositions = positions.map(pos => ({
            x: pos.x - totalWidth / 2 + cardWidth / 2,
            y: pos.y - totalHeight / 2 + cardHeight / 2,
            z: pos.z || 0
        }));

        cardPositions.push(...centeredPositions);
        return centeredPositions;
    }
    return cardPositions;
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

const createScene = (projects, page, setPage, setVisible) => {
    const scene = new THREE.Scene();

    heroCanvas = createHeroCanvas(projects, page, setPage, setVisible);
    scene.add(heroCanvas);

    console.log('scene created');
    return scene;
}


//--- debug functions
const createFrameBorder = (): HTMLDivElement => {
    const div = document.createElement('div');
    div.style.width = `${gridSize.w}px`;
    div.style.height = `${gridSize.h}px`;
    div.style.border = '5px solid blue';
    div.style.boxSizing = 'border-box';
    div.style.backgroundColor = 'rgba(0, 0, 255, 0.05)'; // Light blue background
    div.style.pointerEvents = 'none'; // Don't block card clicks
    return div;
};


//---------------------------- FUNCTION ----------------------------//
const cardsWorld = ({ projects, page, setPage, setVisible }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerGSAP = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: containerGSAP }); 

    useEffect(() => {
        if (!canvasRef.current) return;

        //--- calculate the total number of projects and canvasses
        totalProjects = projects.length;
        totalCanvasses = Math.ceil(totalProjects / cardsPerCanvas);
        gridCols = Math.ceil(Math.sqrt(totalCanvasses));
        gridRows = Math.ceil(totalCanvasses / gridCols);
        const totalWidth = gridCols * gridSize.w;
        const totalHeight = gridRows * gridSize.h;

        absoluteCardPositions = calculateCardPositions(totalWidth, totalHeight);

        createCardCSS3DObjects(projects, page, setPage, setVisible);

        const canvas = canvasRef.current;
        const camera = createCamera();
        const rendererCCS3D = setupCSS3DRenderer(canvas);
        const scene = createScene(projects, page, setPage, setVisible);

        const controls = new OrbitControls(camera, rendererCCS3D.domElement);
        controls.rotateSpeed = 0;
        controls.zoom0;
        controls.touches = {
            ONE: THREE.TOUCH.PAN,
            TWO: THREE.TOUCH.DOLLY_PAN,
        }
        controls.maxDistance = 7000;
        controls.minDistance = 500;
        controls.zoomSpeed = 1;
        controls.panSpeed = 1;
        controls.zoomToCursor = true;

        //--- add cards to scene
        cardObjects.forEach(cardObject => {
            console.log('Adding card to scene LALA', cardObject);
            scene.add(cardObject);
        });

        //--- event handlers
        const handleResize = () => {
            state.screen = {
                width: window.innerWidth,
                height: window.innerHeight,
            };

            gridSize.w = window.innerWidth * gridScale;
            gridSize.h = window.innerHeight * gridScale;

            rendererCCS3D.setSize(state.screen.width, state.screen.height);
            camera.aspect = state.screen.width / state.screen.height;
            camera.updateProjectionMatrix();

            camera.position.z = calculateCameraZForScreen(camera, window.innerHeight);
            state.viewport = calculateViewport(camera);

            // setPositions();
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

    }, [projects]);


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