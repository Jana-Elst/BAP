//https://codepen.io/chungeric/pen/oNEoKjg

'use dom';

//---------------------------- IMPORTS ----------------------------//
import { createRoot, Root } from 'react-dom/client';
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

const gridScale = 1.3;
const cardsPerCanvas = 5;

//---------------------------- COMPONENT ----------------------------//
const CardsWorld = ({ projects, page, setPage, isDiscoverMode }) => {
    //--- Refs (State that persists without triggering re-renders)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<CSS3DRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const animIdRef = useRef<number>(0);

    // Objects & Roots
    const heroObjectRef = useRef<CSS3DObject | null>(null);
    const heroRootRef = useRef<Root | null>(null);
    const cardObjectsRef = useRef<CSS3DObject[]>([]);
    const cardRootsRef = useRef<Map<string, Root>>(new Map()); // Map projectId -> Root

    // Layout Data
    const cardPositionsDiscoverRef = useRef<{ x: number, y: number, z: number }[]>([]);
    const cardPositionsGridRef = useRef<{ x: number, y: number, z: number }[]>([]);
    const gridSizeRef = useRef({ w: 0, h: 0 });

    // Interaction State
    const state = useRef({
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
    }).current;


    //---------------------------- HELPER FUNCTIONS ----------------------------//
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

    const updateHero = (projects, curPage) => {
        if (heroRootRef.current) {
            heroRootRef.current.render(
                <>
                    <InfiniteScrollHero
                        projects={projects}
                        cardsPerCanvas={cardsPerCanvas}
                        page={curPage}
                        setPage={setPage}
                    />
                </>
            );
        }
    };

    const updateCard = (root: Root, project, curPage) => {
        root.render(
            <ProjectCard3D
                page={curPage}
                setPage={setPage}
                project={project}
            />
        );
    };

    //---------------------------- EFFECTS ----------------------------//

    // 1. INITIALIZATION (Run once)
    useEffect(() => {
        if (!canvasRef.current) return;

        //-- Calculations
        const totalProjects = projects.length;
        const totalCanvasses = Math.ceil(totalProjects / cardsPerCanvas);
        const gridCols = Math.ceil(Math.sqrt(totalCanvasses));
        const gridRows = Math.ceil(totalCanvasses / gridCols);

        gridSizeRef.current = {
            w: window.innerWidth * gridScale,
            h: window.innerHeight * gridScale
        };

        const totalWidth = gridCols * gridSizeRef.current.w;
        const totalHeight = gridRows * gridSizeRef.current.h;


        //-- Calculate Positions (Discover)
        if (cardPositionsDiscoverRef.current.length === 0) {
            const positions = getPositions(
                totalProjects, totalWidth, totalHeight, cardWidth, cardHeight, gridSizeRef.current.w, gridSizeRef.current.h
            );
            // Center positions
            cardPositionsDiscoverRef.current = positions.map(pos => ({
                x: pos.x - totalWidth / 2 + cardWidth / 2,
                y: pos.y - totalHeight / 2 + cardHeight / 2,
                z: pos.z || 0
            }));
        }

        //-- Calculate Positions (Grid)
        if (cardPositionsGridRef.current.length === 0) {
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
            cardPositionsGridRef.current = positions;
        }

        //-- Create Scene & Camera
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 50000);
        camera.position.z = calculateCameraZForScreen(camera, window.innerHeight);
        cameraRef.current = camera;

        const renderer = new CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        canvasRef.current.parentElement?.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        //-- Create Hero Canvas Object
        const heroDiv = document.createElement('div');
        heroDiv.style.width = `${gridSizeRef.current.w}px`;
        heroDiv.style.height = `${gridSizeRef.current.h}px`;

        const hRoot = createRoot(heroDiv);
        heroRootRef.current = hRoot;

        // Initial Render of Hero
        updateHero(projects, page);

        const heroObj = new CSS3DObject(heroDiv);
        heroObj.name = 'heroCanvas';
        heroObj.position.set(0, 0, 0);
        heroObjectRef.current = heroObj;

        // Only add hero if discover mode (initial state check, though effect below handles logic too)
        if (isDiscoverMode) scene.add(heroObj);


        //-- Create Card Objects
        projects.forEach((project, index) => {
            const div = document.createElement('div');
            div.style.width = `${cardWidth}px`;
            div.style.height = `${cardHeight}px`;

            const root = createRoot(div);
            // Store root for updates
            cardRootsRef.current.set(project.id, root);

            // Initial Render
            const projectInfo = getProjectInfo(project.id);
            updateCard(root, projectInfo, page);

            const cardObj = new CSS3DObject(div);
            // Position will be set by update mode effect
            cardObj.position.set(0, 0, 0);

            cardObjectsRef.current.push(cardObj);
            scene.add(cardObj);
        });


        //-- Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.rotateSpeed = 0;
        controls.maxDistance = 7000;
        controls.minDistance = 500;
        controls.zoomSpeed = 1;
        controls.panSpeed = 1;
        controls.zoomToCursor = true;

        // Initial control settings
        if (isDiscoverMode) {
            controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN };
        } else {
            controls.touches = { ONE: THREE.TOUCH.PAN };
        }
        controlsRef.current = controls;

        // Custom Pan/Zoom Limits
        const minPan = new THREE.Vector3(-totalWidth / 2, -totalHeight / 2, -Infinity);
        const maxPan = new THREE.Vector3(totalWidth / 2, totalHeight / 2, Infinity);
        const _v = new THREE.Vector3();
        const zoomSpeedTo = gsap.quickTo(controls, "zoomSpeed", { duration: 0.5, ease: "power1.out" });

        controls.addEventListener("change", () => {
            _v.copy(controls.target);
            controls.target.clamp(minPan, maxPan);
            _v.sub(controls.target);
            camera.position.sub(_v);

            const dist = controls.getDistance();
            const range = controls.maxDistance - controls.minDistance;
            const progress = (dist - controls.minDistance) / range;
            const targetSpeed = Math.max(0.3, 1 - progress);
            zoomSpeedTo(targetSpeed);
        });


        //-- Render Loop
        const renderLoop = () => {
            renderer.render(scene, camera);
            animIdRef.current = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        //-- Resize Handler
        const handleResize = () => {
            state.screen = { width: window.innerWidth, height: window.innerHeight };
            gridSizeRef.current.w = window.innerWidth * gridScale;
            gridSizeRef.current.h = window.innerHeight * gridScale;

            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = state.screen.width / state.screen.height;
            camera.updateProjectionMatrix();

            camera.position.z = calculateCameraZForScreen(camera, window.innerHeight);
            state.viewport = calculateViewport(camera);

            // Update hero size if needed (requires recreating div or scaling, omitted for simple refactor)
        };
        window.addEventListener('resize', handleResize);


        //-- Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animIdRef.current);
            renderer.domElement.remove();
            controls.dispose();

            // Dispose scene objects
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) object.material.forEach(m => m.dispose());
                    else object.material.dispose();
                }
            });

            // Unmount Roots?
            // Since we are unmounting the whole component, React might handle it, 
            // but best practice is to unmount roots explicitly if we manually created them.
            if (heroRootRef.current) heroRootRef.current.unmount();
            cardRootsRef.current.forEach(root => root.unmount());
        };

    }, []); // Run ONCE on mount


    // 2. UPDATE CONTENT (When Page or Projects change)
    useEffect(() => {
        // Update Hero
        updateHero(projects, page);

        // Update Cards
        projects.forEach(project => {
            const root = cardRootsRef.current.get(project.id);
            if (root) {
                const projectInfo = getProjectInfo(project.id);
                updateCard(root, projectInfo, page);
            }
        });

    }, [projects, page]); // Only updates the React Content inside the 3D objects


    // 3. LAYOUT / MODE CHANGE (Discover vs Grid)
    useEffect(() => {
        const controls = controlsRef.current;
        const scene = sceneRef.current;
        const heroObj = heroObjectRef.current;

        // Reset Camera & Controls
        const camera = cameraRef.current;
        if (camera) {
            const z = calculateCameraZForScreen(camera, window.innerHeight);
            camera.position.set(0, 0, z);
            camera.rotation.set(0, 0, 0);
            camera.updateProjectionMatrix();
        }

        if (controls) {
            controls.target.set(0, 0, 0);
            controls.update();
        }

        if (!controls || !scene) return;

        if (isDiscoverMode) {
            // Position cards for Discover
            cardObjectsRef.current.forEach((cardObj, index) => {
                const pos = cardPositionsDiscoverRef.current[index];
                if (pos) cardObj.position.set(pos.x, pos.y, 0);
            });

            // Add Hero
            if (heroObj && !scene.getObjectByName('heroCanvas')) {
                scene.add(heroObj);
            }

            // Controls
            controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN };

        } else {
            // Position cards for Grid
            cardObjectsRef.current.forEach((cardObj, index) => {
                const pos = cardPositionsGridRef.current[index];
                if (pos) cardObj.position.set(pos.x, pos.y, 0);
            });

            // Remove Hero
            if (heroObj) {
                const existingHero = scene.getObjectByName('heroCanvas');
                if (existingHero) scene.remove(existingHero);
            }

            // Controls
            controls.touches = { ONE: THREE.TOUCH.PAN };
        }

    }, [isDiscoverMode]);


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