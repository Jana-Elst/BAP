import HomeScreenHologram from '../hologramVisualisations/hologram';

const ExternalScreen = ({ screen, page, setPage }: { screen: any; page: any; setPage: any }) => {
    const externalScreen = Object.values(screen)[0];

    return (
        <HomeScreenHologram
            screenWidth={externalScreen.width}
            screenHeight={externalScreen.height}
            page={page}
            setPage={setPage}
        />
    )
}

export default ExternalScreen