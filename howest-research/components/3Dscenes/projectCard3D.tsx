import { Image } from 'expo-image';
import useGetKeywordImages from '../../scripts/getVisualizationProjectImages';
import '../../styles/style.css';

// import { useGSAP } from '@gsap/react';
// import gsap from 'gsap';
// import { useRef } from 'react';

const ProjectCard3D = ({
    project
}) => {

    // const isLoading = checkIsLoading(page.isLoading);

    // const handleOpenDetail = () => {
    //     setPage({
    //         ...page,
    //         page: 'detailResearch',
    //         id: project.id,
    //         previousPages: [
    //             ...(page.previousPages || []),
    //             {
    //                 info: page.info,
    //                 page: page.page,
    //                 id: page.id
    //             }
    //         ],
    //         isLoading: {
    //             ipad: true,
    //             externalDisplay: false
    //         }
    //     });
    // }

    const imageSrc = useGetKeywordImages(project.formattedName);
    const color = project.color;
    // const containerGSAP = useRef<HTMLDivElement>(null);

    // useGSAP(() => {
    //     if (isDiscoverMode) {
    //         console.log('discover mode');
    //         gsap.to(containerGSAP.current, {
    //             x: `+=${gsap.utils.random(-20, 20)}`,
    //             y: `+=${gsap.utils.random(-20, 20)}`,
    //             rotation: gsap.utils.random(-3, 3),
    //             duration: gsap.utils.random(4, 7),
    //             repeat: -1,
    //             yoyo: true,
    //             ease: "power1.inOut",
    //         });
    //     } else {
    //         console.log('not discover mode');
    //         gsap.to(containerGSAP.current, {
    //             x: 0,
    //             y: 0,
    //             rotation: 0,
    //             duration: 0,
    //             ease: "power1.inOut",
    //         });
    //     }
    // }, { scope: containerGSAP, dependencies: [isDiscoverMode] });



    // useGSAP(() => {
    //     if (isLoading && page.page !== 'discover' && page.id !== project.id) {
    //         console.log('hide');
    //         gsap.to(containerGSAP.current, {
    //             opacity: 0,
    //             scale: 0,
    //             duration: gsap.utils.random(0.5, 1),
    //             ease: "power1.inOut",
    //         });
    //     } else if (isLoading && page.page !== 'discover' && page.id === project.id) {
    //         console.log('show KLIK');
    //         gsap.to(containerGSAP.current, {
    //             opacity: 1,
    //             scale: 1,
    //             duration: gsap.utils.random(0, 1),
    //             ease: "power1.inOut",
    //         });
    //     }

    //     if (page.page === 'discover' && page.id !== project.id) {
    //         gsap.to(containerGSAP.current, {
    //             opacity: 1,
    //             scale: 1,
    //             duration: gsap.utils.random(0, 1),
    //             ease: "power1.inOut",
    //         });
    //     }
    // }, { scope: containerGSAP, dependencies: [isLoading, page.page] });

    // const handleTap = () => {
    //     console.log('Tapped on project card');
    //     gsap.to(containerGSAP.current, {
    //         scale: 0.9,
    //         duration: 0.15,
    //         yoyo: true,
    //         repeat: 1,
    //         ease: "power1.inOut",
    //         onComplete: handleOpenDetail
    //     });
    // };

    if (!project) return null;

    return (
        //         <div style={styles.container} onClick={handleTap} ref={containerGSAP}>
        <div style={styles.container}>
            <div style={styles.card} className="card">
                <div style={styles.texture}></div>

                <div style={styles.header}>
                    <p style={styles.headerTitle}>{project.title}</p>
                    <p style={styles.headerTeaser}>Dit is een korte teaser van ongeveer acht woorden</p>
                </div>
                <div style={styles.imageContainer}>
                    <Image
                        source={imageSrc}
                        alt={project.title}
                        style={styles.image}
                        contentFit="cover"
                    />
                    <p style={{ ...styles.headerSubtitle, color: `var(--${color}-text)` }}>{project.cluster.label}</p>
                </div>
            </div>
            <div style={{ ...styles.gradient, background: `radial-gradient(65.35% 66.61% at 50% 50%, var(--${color}-100) 0%, var(--${color}-10) 100%)` }}></div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'grid',
        gridTemplateRows: '1fr',
        gridTemplateColumns: '1fr',
        alignItems: 'end',
        justifyItems: 'center',
        transformStyle: 'preserve-3d',
    },
    card: {
        gridRow: 1,
        gridColumn: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: 275,
        border: '2px solid white',
        padding: '20px 12px 12px 12px',
        borderRadius: '42px',
        background: 'linear-gradient(123deg, rgba(255, 255, 255, 0.60) 12.29%, rgba(249, 249, 249, 0.56) 28.94%, rgba(224, 224, 224, 0.40) 90.97%)',
        boxShadow: '0 3px 30px -1.711px rgba(78, 78, 78, 0.20)',
        backdropFilter: 'blur(20px)',
        transform: 'translateZ(1px)',
    },
    texture: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        borderRadius: '42px',
        pointerEvents: 'none',
        border: '0.855px solid #D9D9D9',
        opacity: 0.15,
        mixBlendMode: 'soft-light',
    },
    gradient: {
        gridRow: 1,
        gridColumn: 1,
        zIndex: -1,
        width: '214.279px',
        height: '326.486px',
        transform: 'rotate(-46.149deg) translateZ(-1px)',
        flexShrink: 0,
        borderRadius: '326.486px',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
    },
    headerTitle: {
        margin: 0,
        padding: 0,
        color: 'black',
        textAlign: 'center',
        fontFamily: 'VAGRoundedStd-Bold, sans-serif',
        fontSize: '22px',
        lineHeight: '120%',
        letterSpacing: '1.1px',
        textTransform: 'capitalize',

        marginTop: '8px',
        marginBottom: '4px',
    },
    headerSubtitle: {
        margin: 0,
        padding: 0,
        textAlign: 'center',
        fontFamily: ' OpenSans-Semibold, sans-serif',
        fontSize: '14px',
    },

    headerTeaser: {
        margin: 0,
        padding: 0,
        color: '#606060',
        textAlign: 'center',
        fontFamily: ' OpenSans-Semibold, sans-serif',
        fontSize: '16px',
    },

    imageContainer: {
        border: '2px solid white',
        padding: '12px 24px',
        paddingBottom: '12px',
        borderRadius: '30px',
        display: 'grid',
        gridTemplateRows: 'min-content min-content',
        gridTemplateColumns: '1fr',
        alignItems: 'end',
        justifyContent: 'center',
    },
    image: {
        gridRow: 1,
        gridColumn: 1,

        width: '225px',
        height: '200px',
        marginTop: '-8px',
        objectFit: 'cover',
    },
};

export default ProjectCard3D;