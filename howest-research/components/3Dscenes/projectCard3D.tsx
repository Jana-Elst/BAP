import { Image } from 'expo-image';

const ProjectCard3D = ({
    page,
    setPage,
    setVisible,
    project,
}) => {
    const imageSrc = require('../../assets/images/visualizationsProjects/composition.png');;

    const handleOpenDetail = () => {
        setPage({
            page: 'detailResearch',
            id: project.id,
            previousPages: [
                ...(page.previousPages || []),
                {
                    info: page.info,
                    page: page.page,
                    id: page.id
                }
            ]
        })
        setVisible(true);
    }

    // If project data is missing for any reason (render timing, incomplete data), do not render the card.
    if (!project) return null;

    return (
        <div style={styles.container} onClick={handleOpenDetail}>
            <div style={styles.card}>
                <div style={styles.texture}></div>

                <div style={styles.header}>
                    <p style={styles.headerTitle}>{project.title}</p>
                    <p style={styles.headerSubtitle}>{project.cluster.label}</p>
                </div>
                <div style={styles.imageContainer}>
                    <Image
                        source={imageSrc}
                        alt={project.title}
                        style={styles.image}
                        contentFit="cover"
                    />
                </div>
            </div>
            <div style={styles.gradient}></div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'grid',
        gridTemplateRows: '1fr',
        gridTemplateColumns: '1fr',
        alignItems: 'center',
        justifyItems: 'center',
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
        width: 'fit-content',
        border: '2px solid white',
        padding: '20px 12px 12px 12px',
        borderRadius: '42px',
        background: 'linear-gradient(123deg, rgba(255, 255, 255, 0.60) 12.29%, rgba(249, 249, 249, 0.56) 28.94%, rgba(224, 224, 224, 0.40) 90.97%)',
        boxShadow: '0 3px 30px -1.711px rgba(78, 78, 78, 0.20)',
        backdropFilter: 'blur(20px)',
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
        transform: 'rotate(-46.149deg)',
        flexShrink: 0,
        borderRadius: '326.486px',
        background: 'radial-gradient(65.35% 66.61% at 50% 50%, #998EBD 0%, rgba(153, 142, 189, 0.00) 100%)',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
    },
    headerTitle: {
        margin: 0,
        padding: 0,
        color: '#000',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '22px',
        lineHeight: '120%',
        letterSpacing: '1.1px',
        textTransform: 'capitalize',
    },
    headerSubtitle: {
        margin: 0,
        padding: 0,
        color: '#606060',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '16px',
    },
    imageContainer: {
        border: '2px solid white',
        padding: '16px 24px',
        borderRadius: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '225px',
        height: '225px',
        objectFit: 'cover',
    },
};

export default ProjectCard3D;