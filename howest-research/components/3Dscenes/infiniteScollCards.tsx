'use dom';

//---------------------------- IMPORTS ----------------------------//
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import ProjectCard3D from './projectCard3D';

//---------------------------- CONSTANTS ----------------------------//
const GRID_GAP = 50;
const TILE_SIZE = 300;
const TILE_SPACE = TILE_SIZE + GRID_GAP;
const GRID_SIZE = TILE_SPACE * 3;
const TOTAL_GRID_SIZE = GRID_SIZE * 3;

// Tile positions within a single grid
const TILE_POSITIONS: [number, number, number][] = [
    [-TILE_SPACE, TILE_SPACE, 0],
    [0, TILE_SPACE, 0],
    [TILE_SPACE, TILE_SPACE, 0],
    [-TILE_SPACE, 0, 0],
    [0, 0, 0],
    [TILE_SPACE, 0, 0],
    [-TILE_SPACE, -TILE_SPACE, 0],
    [0, -TILE_SPACE, 0],
    [TILE_SPACE, -TILE_SPACE, 0],
];

// Clone group positions (3x3 grid of grids)
const GROUP_POSITIONS: [number, number, number][] = [
    [GRID_SIZE * -1, GRID_SIZE * 1, 0],
    [0, GRID_SIZE, 0],
    [GRID_SIZE, GRID_SIZE, 0],
    [GRID_SIZE * -1, 0, 0],
    [0, 0, 0],
    [GRID_SIZE, 0, 0],
    [GRID_SIZE * -1, GRID_SIZE * -1, 0],
    [0, GRID_SIZE * -1, 0],
    [GRID_SIZE, GRID_SIZE * -1, 0],
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
        subtitle?: string;
    }[];
}

const InfiniteScrollView = ({ projects }: InfiniteScrollViewProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef({
        scroll: {
            ease: 0.05,
            scale: 0.5,
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
        if (!containerRef.current) return;

        const container = containerRef.current;
        const state = stateRef.current;

        // Setup CSS3D renderer
        const renderer = new CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        container.appendChild(renderer.domElement);

        // Setup camera
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            5000
        );
        camera.position.z = 1500;

        // Setup scene
        const scene = new THREE.Scene();

        // Create CSS3D objects for each tile position
        const createCardElement = (index: number): HTMLDivElement => {
            const div = document.createElement('div');
            div.style.width = `${TILE_SIZE}px`;
            div.style.height = `${TILE_SIZE}px`;

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
                if (dir.x < 0 && posX - groupOff > viewportOff.x) {
                    state.tileGroups[i].offset.x -= TOTAL_GRID_SIZE;
                } else if (dir.x > 0 && posX + groupOff < -viewportOff.x) {
                    state.tileGroups[i].offset.x += TOTAL_GRID_SIZE;
                }

                // Wrap vertically
                if (dir.y < 0 && posY - groupOff > viewportOff.y) {
                    state.tileGroups[i].offset.y -= TOTAL_GRID_SIZE;
                } else if (dir.y > 0 && posY + groupOff < -viewportOff.y) {
                    state.tileGroups[i].offset.y += TOTAL_GRID_SIZE;
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

            // Mobile adjustments
            if (state.screen.width < 768) {
                camera.position.z = 2500;
                state.scroll.scale = 2;
            } else {
                camera.position.z = 1500;
                state.scroll.scale = 0.5;
            }

            state.viewport = calculateViewport();
            setPositions();
        };

        // Touch/mouse handlers
        const handleTouchDown = (e: MouseEvent | TouchEvent) => {
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
            if (!state.isDown) return;
            const touch = 'touches' in e ? e.touches[0] : e;
            const distanceX = (state.startX - touch.clientX) * state.scroll.scale;
            const distanceY = (state.startY - touch.clientY) * state.scroll.scale;

            state.scroll.target = {
                x: state.scroll.position.x - distanceX,
                y: state.scroll.position.y + distanceY,
            };
        };

        const handleTouchUp = () => {
            state.isDown = false;
        };

        // Animation loop
        let animationId: number;
        const render = () => {
            state.scroll.current = {
                x: lerp(state.scroll.current.x, state.scroll.target.x, state.scroll.ease),
                y: lerp(state.scroll.current.y, state.scroll.target.y, state.scroll.ease),
            };

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
        container.addEventListener('mousedown', handleTouchDown);
        container.addEventListener('mousemove', handleTouchMove);
        container.addEventListener('mouseup', handleTouchUp);
        container.addEventListener('touchstart', handleTouchDown);
        container.addEventListener('touchmove', handleTouchMove);
        container.addEventListener('touchend', handleTouchUp);

        render();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('mousedown', handleTouchDown);
            container.removeEventListener('mousemove', handleTouchMove);
            container.removeEventListener('mouseup', handleTouchUp);
            container.removeEventListener('touchstart', handleTouchDown);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchUp);
            cancelAnimationFrame(animationId);
            container.removeChild(renderer.domElement);
        };
    }, [projects]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100vh',
                position: 'relative',
                touchAction: 'none',
                overflow: 'hidden',
                backgroundColor: '#F0F0F0',
            }}
        />
    );
};

export default InfiniteScrollView;