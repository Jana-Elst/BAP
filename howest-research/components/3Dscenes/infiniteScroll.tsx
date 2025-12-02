//https://codesandbox.io/p/sandbox/11-pcktl?file=%2Fsrc%2Findex.js%3A90%2C1-91%2C1
//https://tympanus.net/codrops/2021/10/27/creating-the-effect-of-transparent-glass-and-plastic-in-three-js/

//react tree fiber & drei

'use dom';

//---------------------------- IMPORTS ----------------------------//
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//---------------------------- FUNCTIONS ----------------------------//
const createCamera = (scene, size) => {
    //LUNA - speel maar met de camera
    const camera = new THREE.PerspectiveCamera(30, size.width / size.height, 0.1, 100);
    camera.position.set(0, 0, 15);
    scene.add(camera);

    return camera;
}


//---------------------------- COMPONENT ----------------------------//
interface infiniteScrollViewProps {
    projects: any[];
}

const InfiniteScrollView = ({ projects }: infiniteScrollViewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const scene = new THREE.Scene();

        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        const camera = createCamera(scene, size);

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        renderer.sortObjects = true;

        let animationId: number;

        const draw = () => {
            controls.update();
            renderer.render(scene, camera);
            animationId = window.requestAnimationFrame(draw);
        };

        const handleResize = () => {
            size.width = window.innerWidth;
            size.height = window.innerHeight;

            camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();

            renderer.setSize(size.width, size.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        window.addEventListener('resize', handleResize);

        draw();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            window.cancelAnimationFrame(animationId);
            controls.dispose();
            renderer.dispose();

            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach(mat => mat.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        };
    }, []);

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            position: 'relative',
        }}>
            <canvas
                ref={canvasRef}
                className="webgl"
                style={{
                    display: 'block', width: '100%', height: '100%',
                    backgroundColor: 'black' //LUNA - Pas hier  de achtergrondkleur aan
                }}
            />
        </div>
    );
}

export default InfiniteScrollView;