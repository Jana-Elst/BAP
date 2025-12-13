import "@/styles/fonts.css";

const InfiniteScrollHero = () => {
    return (
        <div style={styles.textContainer}>
            <h1 style={styles.h1}>Ontdek dé oplossing voor jouw bedrijf.</h1>
            <p style={styles.p}>Wij deden het onderzoek.</p>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    textContainer: {
        backgroundColor: 'red',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '32px',
        width: 'fit-content',
        zIndex: -100,
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