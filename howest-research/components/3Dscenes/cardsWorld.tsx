//https://codepen.io/chungeric/pen/oNEoKjg

'use dom';

//---------------------------- IMPORTS ----------------------------//
import { createRoot, Root } from 'react-dom/client';
import * as THREE from 'three';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useCallback, useEffect, useMemo, useRef } from 'react';

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

const updateHero = (heroRef) => {
    if (heroRef.current) {
        heroRef.current.render(
            <InfiniteScrollHero />
        );

        console.log('heroImage is updated');
    }
};

const createCards = (projects, cardsRef, page, setPage, isDiscoverMode, onRender) => {
    const cardsObjsRef = [];

    projects.forEach((project, index) => {
        const div = document.createElement('div');
        div.style.width = `${cardWidth}px`;
        div.style.height = `${cardHeight}px`;
        div.className = 'card';

        const root = createRoot(div);
        cardsRef.current.set(project.id, root);

        //1. create card
        const projectInfo = getProjectInfo(project.id);
        updateCard(root, projectInfo, page, setPage, isDiscoverMode);

        //2. make object from card
        const cardObj = new CSS3DObject(div);
        cardObj.position.set(0, 0, 0);

        //0. add event listeners
        div.addEventListener('click', () => {
            console.log('Tapped on project card');
            gsap.to(cardObj.scale, {
                x: 0.9,
                y: 0.9,
                duration: 0.15,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
                onUpdate: onRender,
                onComplete: () => {
                    setPage({
                        ...page,
                        page: 'detailResearch',
                        id: project.id,
                        previousPages: [
                            ...(page.previousPages || []),
                            {
                                info: page.info,
                                page: page.page,
                                id: page.id
                            }
                        ],
                        isLoading: {
                            ipad: true,
                            externalDisplay: false
                        }
                    });
                }
            });
        });

        // @ts-ignore
        cardObj.userData = { id: project.id };

        cardsObjsRef.push(cardObj);
    });

    return cardsObjsRef;
}

const updateCard = (root: Root, project, page, setPage, isDiscoverMode) => {
    root.render(
        <ProjectCard3D
            project={project}
        />
    );
};

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
        { x: -window.innerWidth / 2 + 100, y: 150, z: 0 },
        { x: 200, y: 300, z: 0 },
        { x: window.innerWidth / 2 - 50, y: 100, z: 0 },
        { x: -350, y: -window.innerHeight / 2 + 100, z: 0 },
        { x: -150, y: window.innerHeight / 2 + 50, z: 0 },
        { x: window.innerWidth / 2 - 200, y: -window.innerHeight / 2 + 50, z: 0 },
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

//
const updateLimits = (isDiscoverMode: boolean, totalProjects: number, limitsRef) => {
    // Update Limits
    if (isDiscoverMode) {
        limitsRef.current.min.set(-32, -Infinity, -Infinity);
        limitsRef.current.max.set(32, Infinity, Infinity);
    } else {
        // Grid Mode Limits
        const gap = 16;
        const cardsPerRow = Math.floor(window.innerWidth / (cardWidth + gap / 2));
        const rows = Math.ceil(totalProjects / cardsPerRow);
        const gridH = rows * (cardHeight + gap) + ((cardHeight + gap) / 2);

        const minY = -(gridH - (window.innerHeight + gap * 5));
        limitsRef.current.min.set(0, Math.min(0, minY), -Infinity);
        limitsRef.current.max.set(0, 0, Infinity);
    }
}

//--- gsap animations
const animateCardsToState = (
    cards: CSS3DObject[],
    positions: { x: number, y: number, z: number }[],
    isDiscoverMode: boolean,
    duration: number = 1.5,
    delay: number = 0
) => {
    cards.forEach((cardObj, index) => {
        const targetPos = positions[index];
        if (!targetPos) return;

        // Kill existing tweens
        gsap.killTweensOf(cardObj.position);
        gsap.killTweensOf(cardObj.rotation);

        const tl = gsap.timeline();
        // 1. Move to Target Position & Reset Rotation
        if (index < 12) {
            tl.to(cardObj.position, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z || 0,
                duration: duration,
                delay: delay - 0.5,
                ease: "power4.out"
            }, 0);
        } else {
            tl.to(cardObj.position, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z || 0,
                duration: 0,
                delay: delay,
                ease: "power4.out"
            }, 0);
        }

        // Reset rotation (or animate to 0)
        tl.to(cardObj.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: duration,
            ease: "power2.inOut"
        }, 0);

        // 2. Start Wiggle (only if Discover Mode)
        if (isDiscoverMode) {
            tl.add(() => {
                gsap.to(cardObj.position, {
                    x: `+=${gsap.utils.random(-20, 20)}`,
                    y: `+=${gsap.utils.random(-20, 20)}`,
                    duration: gsap.utils.random(4, 7),
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut"
                });
                gsap.to(cardObj.rotation, {
                    x: `+=${gsap.utils.random(-0.1, 0.1)}`,
                    y: `+=${gsap.utils.random(-0.1, 0.1)}`,
                    duration: gsap.utils.random(4, 7),
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut"
                });
            });
        }
    });
}

//--- eventListeners
const changeControls = (controlsRef, cameraRef, limitsRef, rendererRef, sceneRef) => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;

    const { min, max } = limitsRef.current;
    if (controls && camera) {
        const copyOfControls = new THREE.Vector3().copy(controls.target);
        controls.target.clamp(min, max);
        copyOfControls.sub(controls.target);
        camera.position.sub(copyOfControls);
    } renderer.render(scene, camera);
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
    const limitsRef = useRef<{ min: THREE.Vector3, max: THREE.Vector3 }>({ min: new THREE.Vector3(-Infinity, -Infinity, -Infinity), max: new THREE.Vector3(Infinity, Infinity, Infinity) });

    //--- MEMOS
    const totalProjects = useMemo(() => projects.length, [projects]);

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

    //--- CALLBACKS, EVENTLISTENERS
    const chachedChangeControls = useCallback(() => {
        changeControls(controlsRef, cameraRef, limitsRef, rendererRef, sceneRef);
    }, []);


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
        heroCanvas.style.width = 'fit-content';
        heroCanvas.style.height = 'fit-content';
        heroCanvas.style.zIndex = '-100';

        const heroRoot = createRoot(heroCanvas);
        heroRef.current = heroRoot;

        //2. render hero
        updateHero(heroRef);
        const heroObj = new CSS3DObject(heroCanvas);
        heroObj.name = 'heroCanvas';
        heroObj.position.set(0, 0, 0);
        heroObjectRef.current = heroObj;

        scene.add(heroObj);

        //--- create cards
        // 1.create cards
        cardsObjsRef.current = createCards(projects, cardsRef, page, setPage, isDiscoverMode, chachedChangeControls);

        //2. add cards to scene
        cardsObjsRef.current.forEach(cardObj => {
            sceneRef.current.add(cardObj);
        });

        //3. set card Positions
        animateCardsToState(cardsObjsRef.current, cardPositions, isDiscoverMode, 0, 0);

        //--- add controls
        // 1. create controls
        controlsRef.current = createOrbitControls(camera, renderer);
        // 2. set control settings
        setControlSettings(controlsRef.current, isDiscoverMode);

        controlsRef.current.addEventListener('change', () => chachedChangeControls());
        // Persistent ticker for animations
        gsap.ticker.add(chachedChangeControls);

        //--- render scene
        renderer.render(scene, camera);

        return () => {
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }
            if (renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
            gsap.ticker.remove(chachedChangeControls);

            console.log('initial card world destroyed');
        };

    }, []);

    // 2. if mode is changing
    useEffect(() => {
        const currentZ = cameraRef.current?.position.z || 0;
        const targetZ = calculateCameraZForScreen(cameraRef.current, window.innerHeight);
        const cameraIsChanging = Math.round(currentZ) !== Math.round(targetZ);

        console.log(currentZ, targetZ);
        console.log('cameraIsChanging', cameraIsChanging);

        let transitionDuration = cameraIsChanging ? 1.5 : 0;
        if (transitionDuration > 0) {
          transitionDuration = isDiscoverMode ? 0 : transitionDuration;   
        }

        console.log('transitionDuration', transitionDuration);

        if (controlsRef.current) {
            setControlSettings(controlsRef.current, isDiscoverMode);
            // controlsRef.current.reset();
            gsap.to(controlsRef.current.target, {
                x: 0,
                y: 0,
                z: 0,
                duration: transitionDuration,
                ease: "power2.inOut"
            });
        }

        // Reset Camera
        if (cameraRef.current) {
            gsap.to(cameraRef.current.position, {
                x: 0,
                y: 0,
                z: targetZ,
                duration: transitionDuration,
                ease: "power2.inOut",
                onUpdate: () => {
                    cameraRef.current?.updateProjectionMatrix();
                }
            });

            gsap.to(cameraRef.current.rotation, {
                x: 0,
                y: 0,
                z: 0,
                duration: transitionDuration,
                ease: "power2.inOut"
            });
        }

        if (controlsRef.current) {
            controlsRef.current.update();
        }

        // Animate Cards
        animateCardsToState(cardsObjsRef.current, cardPositions, isDiscoverMode, 1.5, transitionDuration);
        updateLimits(isDiscoverMode, totalProjects, limitsRef);

    }, [isDiscoverMode, totalWidth, totalHeight, totalProjects]);

    // 3. if projects are changing
    useEffect(() => {
        console.log('projects changed');
        if (!sceneRef.current) return;

        cardsRef.current.clear();

        // Remove cards
        cardsObjsRef.current.forEach(cardObj => {
            sceneRef.current.remove(cardObj);
        });

        // Create new cards
        cardsObjsRef.current = createCards(projects, cardsRef, page, setPage, isDiscoverMode, chachedChangeControls);

        // Add new cards to scene
        cardsObjsRef.current.forEach(cardObj => {
            sceneRef.current.add(cardObj);
        });

        // Animate Cards
        animateCardsToState(cardsObjsRef.current, cardPositions, isDiscoverMode);

        updateHero(heroRef);

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