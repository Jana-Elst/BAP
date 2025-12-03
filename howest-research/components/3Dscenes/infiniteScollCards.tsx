//https://codepen.io/chungeric/pen/oNEoKjg

'use dom';

//---------------------------- IMPORTS ----------------------------//
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import ProjectCard3D from './projectCard3D';

//---------------------------- CONSTANTS ----------------------------//
const gridGap = 0.5;
const cardWidth = 320; // From ProjectCard3D
const cardHeight = 380; // From ProjectCard3D
const CssScale = 0.01; // Scale factor to convert pixels to Three.js units
const tileWidth = cardWidth * CssScale; // 3.2 Three.js units
const tileHeight = cardHeight * CssScale; // 3.8 Three.js units
const tileSpaceX = tileWidth + gridGap;
const tileSpaceY = tileHeight + gridGap;
const gridSizeX = tileSpaceX * 3;
const gridSizeY = tileSpaceY * 3;
const totalGridSizeX = gridSizeX * 3;
const totalGridSizeY = gridSizeY * 3;

// Tile positions within a single grid
const TILE_POSITIONS: [number, number, number][] = [
    [-tileSpaceX, tileSpaceY, 0],
    [0, tileSpaceY, 0],
    [tileSpaceX, tileSpaceY, 0],
    [-tileSpaceX, 0, 0],
    [0, 0, 0],
    [tileSpaceX, 0, 0],
    [-tileSpaceX, -tileSpaceY, 0],
    [0, -tileSpaceY, 0],
    [tileSpaceX, -tileSpaceY, 0],
];

// Clone group positions (3x3 grid of grids)
const GROUP_POSITIONS: [number, number, number][] = [
    [-gridSizeX, gridSizeY, 0],
    [0, gridSizeY, 0],
    [gridSizeX, gridSizeY, 0],
    [-gridSizeX, 0, 0],
    [0, 0, 0],
    [gridSizeX, 0, 0],
    [-gridSizeX, -gridSizeY, 0],
    [0, -gridSizeY, 0],
    [gridSizeX, -gridSizeY, 0],
];

// Lerp function
const lerp = (start: number, end: number, amount: number): number => {
    return start * (1 - amount) + end * amount;
};

//---------------------------- COMPONENT ----------------------------//
interface InfiniteScrollViewProps {
    projects: {
        id: string;
        image?: string;
        title?: string;
    }[];
}

const InfiniteScrollView = ({ projects }: InfiniteScrollViewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef({
        scroll: {
            ease: 0.05, // Easing only applies on release
            scale: 0.02,
            current: { x: 0, y: 0 },
            target: { x: 0, y: 0 },
            last: { x: 0, y: 0 },
            position: { x: 0, y: 0 },
        },

        direction: { x: 1, y: 1 },
        isDown: false,
        startX: 0,
        startY: 0,
        screen: { width: 0, height: 0 },
        viewport: { width: 0, height: 0 },
        tileGroups: GROUP_POSITIONS.map((pos) => ({
            pos,
            offset: { x: 0, y: 0 },
            group: new THREE.Group(),
        })),
    });

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const state = stateRef.current;

        // Setup CSS3D renderer
        const renderer = new CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        canvas.parentElement?.appendChild(renderer.domElement);

        // Setup camera
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        camera.position.z = 10;

        // Setup scene
        const scene = new THREE.Scene();

        // Create CSS3D objects for each tile position
        const createCardElement = (index: number): HTMLDivElement => {
            const div = document.createElement('div');
            div.style.width = `${cardWidth}px`;
            div.style.height = `${cardHeight}px`;

            const project = projects[index % projects.length] || {
                title: 'Project Title',
                subtitle: 'Subtitle',
                image: '',
            };

            const root = createRoot(div);
            root.render(
                <ProjectCard3D
                    title={project.title || 'Project Title'}
                    subtitle={project.subtitle || 'Subtitle'}
                    imageSrc={project.image || ''}
                    imageAlt={project.title}
                />
            );

            return div;
        };

        // Add CSS3D objects to each group
        TILE_POSITIONS.forEach((pos, i) => {
            state.tileGroups.forEach((obj) => {
                const element = createCardElement(i);
                const cssObject = new CSS3DObject(element);
                cssObject.position.set(pos[0], pos[1], pos[2]);
                cssObject.scale.set(CssScale, CssScale, CssScale);
                obj.group.add(cssObject);
            });
        });

        state.tileGroups.forEach((obj) => scene.add(obj.group));

        // Calculate viewport
        const calculateViewport = () => {
            const fov = camera.fov * (Math.PI / 180);
            const height = 2 * Math.tan(fov / 2) * camera.position.z;
            const width = height * camera.aspect;
            return { height, width };
        };

        // Set positions
        const setPositions = () => {
            const scrollX = state.scroll.current.x;
            const scrollY = state.scroll.current.y;

            state.tileGroups.forEach((obj, i) => {
                const posX = obj.pos[0] + scrollX + obj.offset.x;
                const posY = obj.pos[1] + scrollY + obj.offset.y;
                const dir = state.direction;
                const groupOff = GRID_SIZE / 2;
                const viewportOff = {
                    x: state.viewport.width / 2,
                    y: state.viewport.height / 2,
                };

                obj.group.position.set(posX, posY, obj.pos[2]);

                // Wrap horizontally
                if (dir.x < 0 && posX - gridSizeX / 2 > viewportOff.x) {
                    state.tileGroups[i].offset.x -= totalGridSizeX;
                } else if (dir.x > 0 && posX + gridSizeX / 2 < -viewportOff.x) {
                    state.tileGroups[i].offset.x += totalGridSizeX;
                }

                // Wrap vertically
                if (dir.y < 0 && posY - gridSizeY / 2 > viewportOff.y) {
                    state.tileGroups[i].offset.y -= totalGridSizeY;
                } else if (dir.y > 0 && posY + gridSizeY / 2 < -viewportOff.y) {
                    state.tileGroups[i].offset.y += totalGridSizeY;
                }
            });
        };

        // Resize handler
        const handleResize = () => {
            state.screen = {
                width: window.innerWidth,
                height: window.innerHeight,
            };
            renderer.setSize(state.screen.width, state.screen.height);
            camera.aspect = state.screen.width / state.screen.height;
            camera.updateProjectionMatrix();

            camera.position.z = 10;
            state.scroll.scale = 0.02;

            state.viewport = calculateViewport();
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

        // Animation loop
        let animationId: number;
        const render = () => {
            // Direct follow when touching, ease only on release
            if (state.isDown) {
                // Immediate 1:1 follow
                state.scroll.current = {
                    x: state.scroll.target.x,
                    y: state.scroll.target.y,
                };
            } else {
                // Apply easing only when finger is released
                state.scroll.current = {
                    x: lerp(state.scroll.current.x, state.scroll.target.x, state.scroll.ease),
                    y: lerp(state.scroll.current.y, state.scroll.target.y, state.scroll.ease),
                };
            }

            // Update direction
            if (state.scroll.current.y > state.scroll.last.y) {
                state.direction.y = -1;
            } else if (state.scroll.current.y < state.scroll.last.y) {
                state.direction.y = 1;
            }
            if (state.scroll.current.x > state.scroll.last.x) {
                state.direction.x = -1;
            } else if (state.scroll.current.x < state.scroll.last.x) {
                state.direction.x = 1;
            }

            setPositions();

            state.scroll.last = {
                x: state.scroll.current.x,
                y: state.scroll.current.y,
            };

            renderer.render(scene, camera);
            animationId = requestAnimationFrame(render);
        };

        // Initialize
        handleResize();

        // Add event listeners
        window.addEventListener('resize', handleResize);
        window.addEventListener('touchstart', handleTouchDown);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchUp);

        render();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('touchstart', handleTouchDown);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchUp);
            cancelAnimationFrame(animationId);

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
};

export default InfiniteScrollView;