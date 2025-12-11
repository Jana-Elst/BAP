import { Dimensions, StyleSheet, Text, View } from 'react-native';
import data from '../../assets/data/structured-data.json';
import { getProjectInfo } from '../../scripts/getData';
import HomeScreenHologram from '../hologramVisualisations/hologram';
import ProjectImage from '../organisms/projectImage';

const windowDimensions = Dimensions.get('window');
console.log('Window dimensions:', windowDimensions);

const ExternalScreen = ({ screen, page, setPage }) => {
    console.log('ExternalScreen:', screen);
    const externalScreen = Object.values(screen)[0];
    console.log('ExternalScreen screen prop:', externalScreen);

    const externalScreenWidth = externalScreen.width
    const externalScreenHeight = externalScreen.height;

    console.log('External screen dimensions:', externalScreenWidth, externalScreenHeight);

    if (page.page === 'detailResearch') {
        const projectInfo = getProjectInfo(page.id);

        return (
            <View style={{ flex: 1 }}>
                <ProjectImage
                    screenWidth={externalScreenWidth}
                    screenHeight={externalScreenHeight}
                    width={externalScreenWidth}
                    height={externalScreenHeight}
                    project={projectInfo}
                    setPage={setPage}
                    page={page}
                />
            </View>
        );
    } else if (page.page === 'detailKeyword') {
        const keyword = data.keywords.find(k => k.id === page.id);
        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 72, fontWeight: 'bold' }}>{keyword.label}</Text>
            </View>
        )
    } else {
        return (
            <>
                <HomeScreenHologram
                    screenWidth={externalScreenWidth}
                    screenHeight={externalScreenHeight}
                    page={page}
                    setPage={setPage}
                />
                {/* <View
                    style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 0,
                        right: 0,
                        borderRadius: 1000,
                    }}
                >
                    <StyledText style={{
                        color: Colors.blueText,
                        fontFamily: Fonts.sans.ExtraBoldItalic,
                        fontSize: 75,
                        textAlign: 'center',
                    }}>Klik op een project om te beginnen</StyledText>
                </View> */}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
});

export default ExternalScreen;