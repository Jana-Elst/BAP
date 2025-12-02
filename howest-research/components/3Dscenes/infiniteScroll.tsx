'use dom';

//---------------------------- IMPORTS ----------------------------//
import * as THREE from 'three';
import { useEffect, useRef } from 'react';

//---------------------------- CONSTANTS ----------------------------//
const GRID_GAP = 0.5;
const TILE_SIZE = 3;
const TILE_SPACE = TILE_SIZE + GRID_GAP;
const GRID_SIZE = TILE_SPACE * 3;
const TOTAL_GRID_SIZE = GRID_SIZE * 3;
const IMAGE_RES = 512;

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
    }[];
}

const InfiniteScrollView = ({ projects }: InfiniteScrollViewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef({
        scroll: {
            ease: 0.05,
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

        // Setup renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: false,
            alpha: true,
        });
        renderer.setClearColor(0x000000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

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


        // Generate image URLs from projects or use placeholders
        const getImageUrl = (index: number): string => {
            if (projects[index]?.image) {
                return projects[index].image;
            }
            return `https://picsum.photos/${IMAGE_RES}?random=${index + 1}`;
        };

        // Add objects
        const textureLoader = new THREE.TextureLoader();
        TILE_POSITIONS.forEach((pos, i) => {
            const imageUrl = getImageUrl(i);
            const imageTexture = textureLoader.load(imageUrl);
            const geometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
            const material = new THREE.MeshBasicMaterial({ map: imageTexture });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...pos);

            state.tileGroups.forEach((obj) => obj.group.add(mesh.clone()));
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
                camera.position.z = 20;
                state.scroll.scale = 0.08;
            } else {
                camera.position.z = 10;
                state.scroll.scale = 0.02;
            }

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
            renderer.dispose();

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
                    backgroundColor: 'black',
                }}
            />
        </div>
    );
};

export default InfiniteScrollView;