//https://codepen.io/chungeric/pen/oNEoKjg

'use dom';

//---------------------------- IMPORTS ----------------------------//
import { createRoot, Root } from 'react-dom/client';
import * as THREE from 'three';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';

import { getProjectInfo } from '@/scripts/getData';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import getDiscoverPositions from '../../scripts/placeCards';
import InfiniteScrollHero from './infiniteScrollHero';
import ProjectCard3D from './projectCard3D';

gsap.registerPlugin(useGSAP);

//---------------------------- CONSTANTS ----------------------------//
const cardWidth = 320; // From ProjectCard3D
const cardHeight = 380; // From ProjectCard3D

const gridScale = 1.3;
const cardsPerCanvas = 5;

//---------------------------- FUNCTIONS ----------------------------//
//--- to create & update the scene
const calculateCameraZForScreen = (camera: THREE.PerspectiveCamera, screenHeight: number) => {
    const fov = camera.fov * (Math.PI / 180);
    const z = screenHeight / (2 * Math.tan(fov / 2));
    return z;
};

const calculateViewport = (camera: THREE.PerspectiveCamera) => {
    const fov = camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * camera.position.z;
    const width = height * camera.aspect;
    return { height, width };
};

const updateHero = (projects, page, setPage, heroRef) => {
    if (heroRef.current) {
        heroRef.current.render(
            <>
                <InfiniteScrollHero
                    projects={projects}
                    cardsPerCanvas={cardsPerCanvas}
                    page={page}
                    setPage={setPage}
                />
            </>
        );

        console.log('heroImage is updated');
    }
};

const createCards = (projects, cardsRef, page, setPage) => {
    const cardsObjsRef = [];

    projects.forEach((project, index) => {
        const div = document.createElement('div');
        div.style.width = `${cardWidth}px`;
        div.style.height = `${cardHeight}px`;

        const root = createRoot(div);
        cardsRef.current.set(project.id, root);

        //1. create card
        const projectInfo = getProjectInfo(project.id);
        updateCard(root, projectInfo, page, setPage);

        //2. make object from card
        const cardObj = new CSS3DObject(div);
        cardObj.position.set(0, 0, 0);

        cardsObjsRef.push(cardObj);
    });

    return cardsObjsRef;
}

const updateCard = (root: Root, project, page, setPage) => {
    root.render(
        <ProjectCard3D
            page={page}
            setPage={setPage}
            project={project}
        />
    );
};

const setCardPositions = (positions, cardsObjsRef) => {
    cardsObjsRef.current.forEach((cardObj, index) => {
        const position = positions[index];
        if (position) {
            cardObj.position.set(position.x, position.y, 0);
        }
    });
}

//--- xxxx
const calculateSizeCanvas = (totalProjects: number) => {
    const totalCanvasses = Math.ceil(totalProjects / cardsPerCanvas);
    const gridCols = Math.ceil(Math.sqrt(totalCanvasses));
    const gridRows = Math.ceil(totalCanvasses / gridCols);

    const gridSize = {
        w: window.innerWidth * gridScale,
        h: window.innerHeight * gridScale
    };

    const totalWidth = gridCols * gridSize.w;
    const totalHeight = gridRows * gridSize.h;

    return { totalWidth, totalHeight, gridSize };
};

const calculateCardPositionsDiscover = (totalProjects: number, totalWidth: number, totalHeight: number, gridSize: { w: number, h: number }) => {
    const totalProjectsWithoutHero = totalProjects - cardsPerCanvas;

    const positions = [
        { x: -window.innerWidth/2 + 100, y: 150, z: 0 },
        { x: 200, y: 300, z: 0 },
        { x: window.innerWidth/2 - 50, y:100, z: 0 },
        { x: -350, y: -window.innerHeight/2 + 100, z: 0 },
        { x: -150, y:window.innerHeight/2 + 50, z: 0 },
        { x: window.innerWidth/2 - 200, y: -window.innerHeight/2 + 50, z: 0 },
    ];

    const positionsAroundHero = getDiscoverPositions(
        totalProjectsWithoutHero, totalWidth, totalHeight, cardWidth, cardHeight, gridSize.w, gridSize.h
    );

    positionsAroundHero.forEach((position, index) => {
        positions.push({
            x: position.x - totalWidth / 2 + cardWidth / 2,
            y: position.y - totalHeight / 2 + cardHeight / 2,
            z: 0
        });
    });

    // Center positions
    const cardPositionsDiscover = positions.map(pos => ({
        x: pos.x,
        y: pos.y,
        z: pos.z
    }));

    console.log('positionsDiscover calculated');
    return cardPositionsDiscover;
}

const calculateCardPositionsGrid = (totalProjects: number) => {
    const gap = 16;
    const cardsPerRow = Math.floor(window.innerWidth / (cardWidth + gap));
    const rows = Math.ceil(totalProjects / cardsPerRow);

    const positions = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cardsPerRow; j++) {
            const x = (j - (cardsPerRow - 1) / 2) * (cardWidth + gap);
            const y = -i * (cardHeight + gap) + (cardHeight + gap) / 2;
            positions.push({ x, y, z: 0 });
        }
    }
    console.log('positionsGRID calculated');
    return positions;
}

const createOrbitControls = (camera: THREE.PerspectiveCamera, renderer: CSS3DRenderer) => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 0;
    controls.maxDistance = 4000;
    controls.minDistance = 500;
    controls.zoomSpeed = 1;
    controls.panSpeed = 1;
    controls.zoomToCursor = true;
    return controls;
}

const setControlSettings = (controls: OrbitControls, isDiscoverMode: boolean) => {
    if (isDiscoverMode) {
        controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN };
    } else {
        controls.touches = { ONE: THREE.TOUCH.PAN };
    }
}

//---------------------------- COMPONENT ----------------------------//
const CardsWorld = ({ projects, page, setPage, isDiscoverMode }) => {
    //--- REFS
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<THREE.Scene>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const rendererRef = useRef<CSS3DRenderer>(null);
    const controlsRef = useRef<OrbitControls>(null);

    const heroRef = useRef<Root>(null);
    const heroObjectRef = useRef<CSS3DObject>(null);

    const cardsRef = useRef<Map<number, Root>>(new Map());
    const cardsObjsRef = useRef<CSS3DObject[]>([]);

    //--- MEMOS
    const totalProjects = projects.length;

    // We only need to recalculate these if totalProjects changes (or screen size if we were tracking that)
    const { totalWidth, totalHeight, gridSize } = useMemo(() => calculateSizeCanvas(totalProjects), [totalProjects]);

    const cardPositionsDiscover = useMemo(() =>
        calculateCardPositionsDiscover(totalProjects, totalWidth, totalHeight, gridSize),
        [totalProjects, totalWidth, totalHeight, gridSize]
    );

    const cardPositionsGrid = useMemo(() =>
        calculateCardPositionsGrid(totalProjects),
        [totalProjects]
    );

    // Determines which set of positions to use
    const cardPositions = useMemo(() => {
        return isDiscoverMode ? cardPositionsDiscover : cardPositionsGrid;
    }, [isDiscoverMode, cardPositionsDiscover, cardPositionsGrid]);


    // 1. Initialize
    useEffect(() => {
        if (!canvasRef.current) return;

        //create scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        //create camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = calculateCameraZForScreen(camera, window.innerHeight);
        cameraRef.current = camera;

        //create renderer
        const renderer = new CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        rendererRef.current = renderer;

        if (canvasRef.current && canvasRef.current.parentNode) {
            canvasRef.current.parentNode.appendChild(renderer.domElement);
        }

        //--- create hero
        // 1. create canvas
        const heroCanvas = document.createElement('div');
        heroCanvas.style.width = `${gridSize.w}px`;
        heroCanvas.style.height = `${gridSize.h}px`;
        const heroRoot = createRoot(heroCanvas);
        heroRef.current = heroRoot;

        //2. render hero
        updateHero(projects, page, setPage, heroRef);
        const heroObj = new CSS3DObject(heroCanvas);
        heroObj.name = 'heroCanvas';
        heroObj.position.set(0, 0, 0);
        heroObjectRef.current = heroObj;

        if (isDiscoverMode) scene.add(heroObj);

        //--- create cards
        // 1.create cards
        cardsObjsRef.current = createCards(projects, cardsRef, page, setPage);

        //2. add cards to scene
        cardsObjsRef.current.forEach(cardObj => {
            sceneRef.current.add(cardObj);
        });

        //3. set card positions
        setCardPositions(cardPositions, cardsObjsRef);

        //--- add controls
        // 1. create controls
        controlsRef.current = createOrbitControls(camera, renderer);
        // 2. set control settings
        setControlSettings(controlsRef.current, isDiscoverMode);

        controlsRef.current.addEventListener('change', () => {
            renderer.render(scene, camera);
        });

        //--- render scene
        renderer.render(scene, camera);

        return () => {
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }
            if (renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }

            console.log('initial card world destroyed');
        };

    }, []);

    // 2. if mode is changing
    useEffect(() => {
        if (controlsRef.current) {
            setControlSettings(controlsRef.current, isDiscoverMode);
            controlsRef.current.reset();
        }

        // Reset Camera
        if (cameraRef.current) {
            cameraRef.current.position.set(0, 0, calculateCameraZForScreen(cameraRef.current, window.innerHeight));
            cameraRef.current.rotation.set(0, 0, 0);
            cameraRef.current.updateProjectionMatrix();
        }

        if (controlsRef.current) {
            controlsRef.current.update();
        }

        // Update Hero Visibility
        const scene = sceneRef.current;
        const heroObj = heroObjectRef.current;
        if (scene && heroObj) {
            if (isDiscoverMode) {
                if (!scene.getObjectByName('heroCanvas')) scene.add(heroObj);
            } else {
                const existing = scene.getObjectByName('heroCanvas');
                if (existing) scene.remove(existing);
            }
        }

        // Update Card Positions
        cardsObjsRef.current.forEach((cardObj, index) => {
            const position = cardPositions[index];
            // We can animate this using GSAP later if desired
            cardObj.position.set(position.x, position.y, 0);
        });

        // Re-render
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }

        console.log('Mode or positions updated');

    }, [isDiscoverMode]);

    // 3. if projects are changing
    useEffect(() => {
        if (!sceneRef.current) return;

        cardsRef.current.clear();

        // Remove cards
        cardsObjsRef.current.forEach(cardObj => {
            sceneRef.current.remove(cardObj);
        });

        // Create new cards
        cardsObjsRef.current = createCards(projects, cardsRef, page, setPage);

        // Add new cards to scene
        cardsObjsRef.current.forEach(cardObj => {
            sceneRef.current.add(cardObj);
        });

        // Update Card Positions
        setCardPositions(cardPositions, cardsObjsRef);

        //update hero
        updateHero(projects, page, setPage, heroRef);

        //Update camera & controls
        if (cameraRef.current && controlsRef.current) {
            const currentZ = cameraRef.current.position.z;
            cameraRef.current.position.set(0, 0, currentZ);

            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }

        // Re-render
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }

        console.log('projects updated');
    }, [totalProjects]);


    //---------------------------- RENDER ----------------------------//
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
};

export default CardsWorld;