import HomeScreenHologram from '../hologramVisualisations/hologram';

const ExternalScreen = ({ screen, page, setPage }: { screen: any; page: any; setPage: any }) => {
    const externalScreen = Object.values(screen)[0];

    // if (page.page === 'detailResearch') {
    //     const projectInfo = getProjectInfo(page.id);

    //     return (
    //         <View style={{ flex: 1 }}>
    //             <ProjectImage
    //                 screenWidth={externalScreen.width}
    //                 screenHeight={externalScreen.height}
    //                 width={externalScreen.width}
    //                 height={externalScreen.height}
    //                 project={projectInfo}
    //                 setPage={setPage}
    //                 page={page}
    //             />
    //         </View>
    //     );
    // }

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