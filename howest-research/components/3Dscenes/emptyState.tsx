import { Image } from 'expo-image';
import image from '../../assets/images/noResults.png';
import '../../styles/style.css';


const EmptyState = ({ setPage, page }) => {
    return (
        <div style={styles.container}>
            <Image source={image} style={{ width: 300, height: 300 }} contentFit="contain" />
            <div style={styles.textContainer}>
                <p style={styles.title}>Met jouw gekozen filters voerden we nog geen onderzoek uit.</p>
                <p style={styles.text}>Heb jij een idee? Laat van je horen!</p>
            </div>
            <button onClick={() => setPage((prev: any) => ({ ...prev, info: 'contact' }))} style={styles.button}>Neem contact op</button>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        gap: '64px',
    },

    textContainer: {
        maxWidth: '66%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
    },

    title: {
        fontFamily: "VAGRoundedStd-Light",
        color: '#000',
        textAlign: 'center',
        fontSize: 40,
        fontStyle: 'normal',
        lineHeight: '120%',
        margin: 0,
    },
    text: {
        fontFamily: "OpenSans-Regular",
        fontSize: 24,
        fontStyle: 'normal',
        textAlign: 'center',
        margin: 0,
    },

    button: {
        display: 'flex',
        padding: '16px 20px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        borderRadius: '100px',
        background: 'linear-gradient(90deg, var(--blue-100, #44C8F5) 0%, var(--blue-25, #D4EDFB) 50.48%, var(--blue-100, #44C8F5) 100%)',
        boxShadow: '0 3px 4px 0 rgba(78, 78, 78, 0.20)',
        color: '#000',
        textAlign: 'center',
        fontFamily: "OpenSans-Regular",
        fontSize: 24,
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '110%',
        margin: 0,
        border: 'none',
        cursor: 'pointer',
    }

}

export default EmptyState;