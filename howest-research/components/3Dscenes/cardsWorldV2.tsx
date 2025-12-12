//https://codepen.io/chungeric/pen/oNEoKjg

'use dom';

//---------------------------- IMPORTS ----------------------------//
import { createRoot, Root } from 'react-dom/client';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import InfiniteScrollHero from './infiniteScrollHero';
import ProjectCard3D from './projectCard3D';

import { getProjectInfo } from '../../scripts/getData';
import getPositions from '../../scripts/placeCards';

gsap.registerPlugin(useGSAP);

//---------------------------- CONSTANTS ----------------------------//
const cardWidth = 320; // From ProjectCard3D
const cardHeight = 380; // From ProjectCard3D

const gridScale = 1.3;
const cardsPerCanvas = 5;

const CardsWorld = ({ projects, page, setPage, isDiscoverMode }) => {
    const [pageData, setPageData] = useState({});

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

    const calculateSizeCanvas = () => {
        const totalProjects = projects.length;
        const totalCanvasses = Math.ceil(totalProjects / cardsPerCanvas);
        const gridCols = Math.ceil(Math.sqrt(totalCanvasses));
        const gridRows = Math.ceil(totalCanvasses / gridCols);

        const gridSize = {
            w: window.innerWidth * gridScale,
            h: window.innerHeight * gridScale
        };

        const totalWidth = gridCols * gridSize.w;
        const totalHeight = gridRows * gridSize.h;

        return { totalWidth, totalHeight };
    };

    const calculateCardPositionsDiscover = () => {
        const positions = getPositions(
            totalProjects, totalWidth, totalHeight, cardWidth, cardHeight, gridSizeRef.current.w, gridSizeRef.current.h
        );
        // Center positions
        const cardPositionsDiscover = positions.map(pos => ({
            x: pos.x - totalWidth / 2 + cardWidth / 2,
            y: pos.y - totalHeight / 2 + cardHeight / 2,
            z: pos.z || 0
        }));

        return cardPositionsDiscover;
    }

    const calculateCardPositionsGrid = () => {
        
    }

    useEffect(() => {

    }, []);

}