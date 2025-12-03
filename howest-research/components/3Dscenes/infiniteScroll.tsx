//https://codepen.io/chungeric/pen/oNEoKjg

'use dom';

//---------------------------- IMPORTS ----------------------------//
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import ProjectCard3D from './projectCard3D';
import getPositions from '../../scripts/placeCards';
import data from '../../assets/data/structured-data.json';
import { getProjectInfo } from '../../scripts/getData';

//---------------------------- CONSTANTS ----------------------------//
const projects = data.projects;

const cardWidth = 320; // From ProjectCard3D
const cardHeight = 380; // From ProjectCard3D
const canvasScale = 1.3;
const canvasSize = {
    w: innerWidth * canvasScale,
    h: innerHeight * canvasScale
};

const cardsPerCanvas = 6;
const layers = 10;

const totalProjects = projects.length;
const totalCanvasses = Math.ceil(totalProjects / cardsPerCanvas);

const visibleRows = 5; // 2 above, 1 middle, 2 below
const visibleCols = 5; // Visible columns + buffer

//---------------------------- VARS ----------------------------//
let cardPositions: { x: number; y: number; z: number }[] = [];
let frameCardPositions: Map<number, { x: number; y: number; z: number }[]> = new Map();


//---------------------------- HELPER FUNCTIONS ----------------------------//
// Cache for card elements to avoid recreating
const cardElementCache = new Map<number, HTMLDivElement>();

// Create CSS3D objects for each tile position
const createCardElement = (index: number): HTMLDivElement => {
    if (cardElementCache.has(index)) {
        return cardElementCache.get(index)!.cloneNode(true) as HTMLDivElement;
    }

    const div = document.createElement('div');
    div.style.width = `${cardWidth}px`;
    div.style.height = `${cardHeight}px`;
    div.style.border = '3px solid red';           // ADD: Debug border
    div.style.boxSizing = 'border-box';           // ADD: Include border in size

    const rawProject = projects[index % projects.length];
    const project = getProjectInfo(rawProject.id);

    const root = createRoot(div);
    root.render(
        <ProjectCard3D
            title={project.title || 'Project Title'}
            subtitle={project.cluster.label || 'Subtitle'}
            imageSrc={project.image || ''}
            imageAlt={project.title || 'Project Image'}
        />
    );

    cardElementCache.set(index, div);

    return div;
};

// Get frame position based on row and column
const getFramePosition = (frameIndex: number, totalFrames: number, row: number) => {
    const frameWidth = canvasSize.w;
    const frameHeight = canvasSize.h;

    // Middle row is 0, above = positive rows, below = negative rows
    const distanceFromMiddle = Math.abs(row);

    // X offset: staircase effect (increases by 1 for each row away from middle)
    const xOffset = distanceFromMiddle;

    // Column position + offset, wrapping the frame index
    const wrappedFrameIndex = ((frameIndex + xOffset) % totalFrames + totalFrames) % totalFrames;

    // Y position: row * frame height
    const yPosition = row * frameHeight;

    return {
        x: frameIndex * frameWidth,
        y: yPosition,
        z: 0,
        wrappedFrameIndex // Which frame content to show
    };
};

const generateFrameGrid = (totalFrames: number, visibleRows: number, visibleCols: number) => {
    const positions: { x: number; y: number; z: number; frameContentIndex: number }[] = [];

    const halfRows = Math.floor(visibleRows / 2);
    const halfCols = Math.floor(visibleCols / 2);

    const frameWidth = canvasSize.w;
    const frameHeight = canvasSize.h;

    for (let row = halfRows; row >= -halfRows; row--) {
        const distanceFromMiddle = Math.abs(row);

        for (let col = -halfCols; col <= halfCols; col++) {
            // Apply staircase offset and wrap for CONTENT index only
            const offsetCol = ((col + distanceFromMiddle) % totalFrames + totalFrames) % totalFrames;

            positions.push({
                x: col * frameWidth,      // Position based on col (-2, -1, 0, 1, 2)
                y: row * frameHeight,     // Position based on row (-2, -1, 0, 1, 2)
                z: 0,
                frameContentIndex: offsetCol  // Which content to show (staircase)
            });
        }
    }

    console.log('Frame grid sample:', positions.slice(0, 5));
    return positions;
};

const calculateCameraZForScreen = (camera: THREE.PerspectiveCamera, screenHeight: number) => {
    const fov = camera.fov * (Math.PI / 180);
    // Rearranged formula: z = height / (2 * tan(fov/2))
    const z = screenHeight / (2 * Math.tan(fov / 2));
    return z;
};

// Calculate viewport - should now match screen dimensions
const calculateViewport = (camera: THREE.PerspectiveCamera) => {
    const fov = camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * camera.position.z;
    const width = height * camera.aspect;

    return { height, width };
};

const createFrameBorder = (): HTMLDivElement => {
    const div = document.createElement('div');
    div.style.width = `${canvasSize.w}px`;
    div.style.height = `${canvasSize.h}px`;
    div.style.border = '5px solid blue';
    div.style.boxSizing = 'border-box';
    div.style.backgroundColor = 'rgba(0, 0, 255, 0.05)'; // Light blue background
    div.style.pointerEvents = 'none'; // Don't block card clicks
    return div;
};

//---------------------------- FUNCTION ----------------------------//
interface InfiniteScrollViewProps {
    projects: {
        id: string;
        image?: string;
        title?: string;
    }[];
}

const InfiniteScrollView: React.FC<InfiniteScrollViewProps> = ({ projects }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // useEffect(() => {
    //     frameCardPositions = new Map();
    //     cardElementCache.clear();
    // }, []);

    const gridSizeX = canvasSize.w; // Size of one frame
    const gridSizeY = canvasSize.h;
    const totalGridSizeX = visibleCols * canvasSize.w;
    const totalGridSizeY = visibleRows * canvasSize.h;

    // Calculate card positions
    if (frameCardPositions.size === 0) {
        for (let frameIndex = 0; frameIndex < totalCanvasses; frameIndex++) {
            const positions = getPositions(
                cardsPerCanvas, canvasSize.w, canvasSize.h, cardWidth, cardHeight,
            );
            frameCardPositions.set(frameIndex, positions);
        }
        console.log('Frame card positions generated for', frameCardPositions.size, 'frames');
    }

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        console.time('Setup'); // Performance timing

        const state = {
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

        //setup CSS3D renderer
        const renderer = new CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        canvas.parentElement?.appendChild(renderer.domElement);

        // Setup camera
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 50000);
        camera.position.z = calculateCameraZForScreen(camera, window.innerHeight);

        // Setup scene
        const scene = new THREE.Scene();

        //the frames
        const frameGrid = generateFrameGrid(totalCanvasses, visibleRows, visibleCols);

        console.log('Total frames to render:', frameGrid.length);

        const frameObjects: {
            pos: { x: number; y: number; z: number };
            offset: { x: number; y: number };
            group: THREE.Group;
        }[] = [];

        console.log('7. Starting frame loop...');

        frameGrid.forEach((framePos) => {
            const group = new THREE.Group();
            group.position.set(framePos.x, framePos.y, framePos.z);

            const borderElement = createFrameBorder();
            const borderObject = new CSS3DObject(borderElement);
            borderObject.position.set(0, 0, -1); // Slightly behind cards
            group.add(borderObject);

            // Get the card positions for THIS frame's content
            const frameContentIndex = framePos.frameContentIndex;
            const positions = frameCardPositions.get(frameContentIndex) || [];

            console.log(`Frame at (${framePos.x}, ${framePos.y}) using content ${frameContentIndex}, cards: ${positions.length}`);

            let cardsAdded = 0;
            positions.forEach((card, i) => {
                if (!card) return;

                // Create card
                const cardIndex = frameContentIndex * cardsPerCanvas + i;
                const element = createCardElement(cardIndex);
                const cssObject = new CSS3DObject(element);

                // Position card RELATIVE to this frame's center
                cssObject.position.set(
                    card.x - canvasSize.w / 2 + cardWidth / 2,
                    -card.y + canvasSize.h / 2 - cardHeight / 2,
                    card.z || 0
                );

                group.add(cssObject);
                cardsAdded++;
            });

            console.log(`  → Added ${cardsAdded} cards to group`);

            scene.add(group);

            frameObjects.push({
                pos: { x: framePos.x, y: framePos.y, z: framePos.z },
                offset: { x: 0, y: 0 },
                group: group,
            });
        });

        console.log('Total frameObjects:', frameObjects.length);
        console.timeEnd('Setup');

        console.log(calculateViewport(camera));
        state.viewport = calculateViewport(camera);

        // Set positions with infinite scroll wrapping
        const setPositions = () => {
            const scrollX = state.scroll.current.x;
            const scrollY = state.scroll.current.y;

            const viewportOff = {
                x: state.viewport.width / 2,
                y: state.viewport.height / 2,
            };

            frameObjects.forEach((obj, i) => {
                const posX = obj.pos.x + scrollX + obj.offset.x;
                const posY = obj.pos.y + scrollY + obj.offset.y;
                const dir = state.direction;

                // Update group position
                obj.group.position.set(posX, posY, obj.pos.z);

                // Wrap horizontally
                if (dir.x < 0 && posX - gridSizeX / 2 > viewportOff.x) {
                    frameObjects[i].offset.x -= totalGridSizeX;
                } else if (dir.x > 0 && posX + gridSizeX / 2 < -viewportOff.x) {
                    frameObjects[i].offset.x += totalGridSizeX;
                }

                // Wrap vertically
                if (dir.y < 0 && posY - gridSizeY / 2 > viewportOff.y) {
                    frameObjects[i].offset.y -= totalGridSizeY;
                } else if (dir.y > 0 && posY + gridSizeY / 2 < -viewportOff.y) {
                    frameObjects[i].offset.y += totalGridSizeY;
                }
            });
        };

        const handleResize = () => {
            state.screen = {
                width: window.innerWidth,
                height: window.innerHeight,
            };
            canvasSize.w = window.innerWidth * canvasScale;
            canvasSize.h = window.innerHeight * canvasScale;

            renderer.setSize(state.screen.width, state.screen.height);
            camera.aspect = state.screen.width / state.screen.height;
            camera.updateProjectionMatrix();

            // Camera Z based on SCREEN height (not canvas)
            camera.position.z = calculateCameraZForScreen(camera, window.innerHeight);
            state.viewport = calculateViewport(camera);

            setPositions();
        };

        // Touch/mouse handlers
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

        let animationId: number;

        const render = () => {
            // Calculate direction based on scroll movement
            state.direction.x = state.scroll.target.x > state.scroll.current.x ? 1 : -1;
            state.direction.y = state.scroll.target.y > state.scroll.current.y ? 1 : -1;

            // Smooth scroll interpolation (lerp)
            state.scroll.current.x += (state.scroll.target.x - state.scroll.current.x) * state.scroll.ease;
            state.scroll.current.y += (state.scroll.target.y - state.scroll.current.y) * state.scroll.ease;

            // Update positions with wrapping
            setPositions();

            renderer.render(scene, camera);
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
            renderer.domElement.remove();

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