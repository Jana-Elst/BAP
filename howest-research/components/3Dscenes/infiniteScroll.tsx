//https://codepen.io/chungeric/pen/oNEoKjg

'use dom';

//---------------------------- IMPORTS ----------------------------//
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { createRoot } from 'react-dom/client';

import { useEffect, useRef } from 'react';

import ProjectCard3D from './projectCard3D';
import InfiniteScrollHero from './infiniteScrollHero';  

import getPositions from '../../scripts/placeCards';
// import data from '../../assets/data/structured-data.json';
import { getProjectInfo } from '../../scripts/getData';

//---------------------------- CONSTANTS ----------------------------//
// const projects = data.projects;

const cardWidth = 320; // From ProjectCard3D
const cardHeight = 380; // From ProjectCard3D
const gridScale = 1.3;
const gridSize = {
    w: innerWidth * gridScale,
    h: innerHeight * gridScale
};

const cardsPerCanvas = 5;
const layers = 10;

const visibleRows = 5; // 2 above, 1 middle, 2 below
const visibleCols = 5; // Visible columns + buffer

const totalGridSizeX = visibleCols * gridSize.w;
const totalGridSizeY = visibleRows * gridSize.h;

//---------------------------- VARS ----------------------------//
let totalProjects;
let totalCanvasses;
let cardPositions = []; //array with positions for all the cards, relative to the frame
let cardObjects: CSS3DObject[] = []; //array with the 3D objects for all the cards
let cardPositionsPerFrame = [];
let absoluteCardPositions = [];

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
const calculateCardPositions = () => {
    if (cardPositions.length === 0) {
        for (let frameIndex = 0; frameIndex < totalCanvasses; frameIndex++) {
            const positions = getPositions(
                cardsPerCanvas, gridSize.w, gridSize.h, cardWidth, cardHeight,
            );

            // Center positions within the grid
            const centeredPositions = positions.map(pos => ({
                x: pos.x - gridSize.w / 2 + cardWidth / 2,
                y: -(pos.y - gridSize.h / 2 + cardHeight / 2), // Flip Y axis (CSS Y goes down, Three.js Y goes up)
                z: pos.z || 0
            }));

            cardPositions.push(...centeredPositions);
        }
    }
}

const createHeroCanvas = (projects) => {
    const div = document.createElement('div');
    div.style.width = `${gridSize.w}px`;
    div.style.height = `${gridSize.h}px`;
    div.style.border = '3px solid green';           // ADD: Debug border
    div.style.boxSizing = 'border-box';             // ADD: Include border in size
    div.style.backgroundColor = 'rgba(0, 255, 0, 0.3)'; // ADD: Visible background for debugging
    const root = createRoot(div);

    root.render(
        <>
            <InfiniteScrollHero projects={projects} cardsPerCanvas={cardsPerCanvas} />
        </>
    );

    const css3DObject = new CSS3DObject(div);
    css3DObject.position.set(0, 0, 0);
    return css3DObject;
}

const createCard3DObject = (project, position) => {
    const div = document.createElement('div');
    div.style.width = `${cardWidth}px`;
    div.style.height = `${cardHeight}px`;
    div.style.border = '3px solid red';           // ADD: Debug border
    div.style.boxSizing = 'border-box';           // ADD: Include border in size
    const root = createRoot(div);

    root.render(
        <ProjectCard3D
            title={project.title || 'Project Title'}
            subtitle={project.cluster.label || 'Subtitle'}
            imageSrc={project.image || ''}
            imageAlt={project.title || 'Project Image'}
        />
    );

    const css3DObject = new CSS3DObject(div);
    css3DObject.position.set(position.x, position.y, position.z);
    return css3DObject;
}

const createCardCSS3DObjects = (projects) => {
    if (cardObjects.length === 0) {
        projects.forEach((project, index) => {
            // console.log('Creating card for project ID:', project.id);
            const projectInfo = getProjectInfo(project.id);
            const position = absoluteCardPositions[index];
            const cardObject = createCard3DObject(projectInfo, position);
            cardObjects.push(cardObject);
        });
    }

    console.log('Card CSS3DObjects created, count:', cardObjects.length);
}

const createAbsoluteCardPositions = () => {
    const cardsPerFrame = [];
    for (let i = 0; i < totalCanvasses; i++) {
        const cardIndexStart = i * cardsPerCanvas;
        const cardIndexEnd = Math.min(cardIndexStart + cardsPerCanvas, totalProjects);
        const cardsForThisFrame = cardPositions.slice(cardIndexStart, cardIndexEnd);
        cardsPerFrame.push(cardsForThisFrame);
    }

    absoluteCardPositions = [];
    cardsPerFrame.forEach((cards, frameIndex) => {
        const frameOffsetX = gridSize.w * frameIndex;
        cards.forEach((card) => {
            const absolutePosition = {
                x: card.x + frameOffsetX,  // card.x, not card.position.x
                y: card.y,                  // card.y, not card.position.y
                z: card.z                   // card.z, not card.position.z
            };

            console.log('Absolute position for card in frame', frameIndex, ':', absolutePosition, card);
            absoluteCardPositions.push(absolutePosition);
        });
    });
};

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

const createScene = (projects) => {
    const scene = new THREE.Scene();

    const heroCanvas = createHeroCanvas(projects);
    scene.add(heroCanvas);

    //add cards to scene
    // const cardsFrameOne = cardObjects.slice(0, cardsPerCanvas);
    // cardObjects.forEach(card => {
    //     scene.add(card);
    // });

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
const InfiniteScrollView = ({ projects }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Reset module-level arrays on each mount
        cardPositions = [];
        cardObjects = [];
        cardPositionsPerFrame = [];

        totalProjects = projects.length;
        totalCanvasses = Math.ceil(totalProjects / cardsPerCanvas);
        calculateCardPositions();
        createAbsoluteCardPositions();

        createCardCSS3DObjects(projects);

        const canvas = canvasRef.current;
        const camera = createCamera();
        const rendererCCS3D = setupCSS3DRenderer(canvas);
        const scene = createScene(projects);

        //--- set positions infinite scroll
        const setPositions = () => {
            //what should happen??
            const scrollX = state.scroll.current.x;
            const scrollY = state.scroll.current.y;

            const viewportOff = {
                x: state.viewport.width / 2,
                y: state.viewport.height / 2,
            };

            console.log('scrollX:', scrollX, 'scrollY:', scrollY);
        };

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

            setPositions();
        };

        const handleTouchDown = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            state.isDown = true;
            state.scroll.position = {
                x: state.scroll.current.x,
                y: state.scroll.current.y,
            };
            const touch = 'touches' in e ? e.touches[0] : e;
            state.startX = touch.clientX;
            state.startY = touch.clientY;
        };

        const handleTouchMove = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            if (!state.isDown) return;
            const touch = 'touches' in e ? e.touches[0] : e;
            const distanceX = (state.startX - touch.clientX) * state.scroll.scale;
            const distanceY = (state.startY - touch.clientY) * state.scroll.scale;

            state.scroll.target = {
                x: state.scroll.position.x - distanceX,
                y: state.scroll.position.y + distanceY,
            };
        };

        const handleTouchUp = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            state.isDown = false;
        };


        //--- render
        let animationId: number;
        const render = () => {
            // Calculate direction based on scroll movement
            state.direction.x = state.scroll.target.x > state.scroll.current.x ? 1 : -1;
            state.direction.y = state.scroll.target.y > state.scroll.current.y ? 1 : -1;

            // Smooth scroll interpolation (lerp)
            state.scroll.current.x += (state.scroll.target.x - state.scroll.current.x);
            state.scroll.current.y += (state.scroll.target.y - state.scroll.current.y);

            // Update positions with wrapping
            setPositions();

            rendererCCS3D.render(scene, camera);
            animationId = requestAnimationFrame(render);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('touchstart', handleTouchDown);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchUp);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('touchstart', handleTouchDown);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchUp);
            cancelAnimationFrame(animationId);
            rendererCCS3D.domElement.remove();

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
            width: '100%',
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

export default InfiniteScrollView;