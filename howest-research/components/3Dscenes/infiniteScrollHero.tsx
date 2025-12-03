import "../../styles/fonts.css";
import ProjectCard3D from './projectCard3D';
import { View } from 'react-native';
import { getProjectInfo } from '@/scripts/getData';

const InfiniteScrollHero = ({ projects, cardsPerCanvas }) => {
    const projectsShown = projects.slice(0, cardsPerCanvas);
    const positions = [
        { x: innerWidth-180, y: 64 },
        { x: 64, y: 320 },
        { x: 400, y: innerHeight - 200 },
        { x: innerWidth, y: 500 },
        { x: 600, y: 0 },
        { x: 0, y: 0 },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.textContainer}>
                <h1 style={styles.h1}>Ontdek dé oplossing voor jouw bedrijf.</h1>
                <p style={styles.p}>Wij deden het onderzoek.</p>
            </div>
            <div>
                {projectsShown.map((project, index) => {
                    const projectInformation = getProjectInfo(project.id);
                    return (
                        <View key={index} style={[styles.projectCard, { left: positions[index].x, top: positions[index].y }]}>
                            <ProjectCard3D
                                title={projectInformation.title || 'Project Title'}
                                subtitle={projectInformation.cluster.label || 'Subtitle'}
                                imageSrc={projectInformation.image || ''}
                                imageAlt={projectInformation.title || 'Project Image'}
                            />
                        </View>
                    )
                })}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },

    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },

    h1: {
        fontFamily: "VAGRoundedStd-Bold",
        fontSize: 40,
        lineHeight: '120%',
        margin: 0,
        padding: 0,
    },
    p: {
        fontFamily: "OpenSans-Semibold",
        fontSize: 28,
        fontStyle: "normal",
        lineHeight: '120%', /* 33.6px */
        margin: 0,
        padding: 0,
    },

    projectCard: {
        position: 'absolute',
        top: 0,
        left: 0,
    }
};

export default InfiniteScrollHero;