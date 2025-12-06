import * as React from "react";
import { useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
    ICarouselInstance,
    Pagination,
} from "react-native-reanimated-carousel";


import Images from "../cardsDetailPage/images";
import Info from "../cardsDetailPage/info";
import ModelView from "../cardsDetailPage/modelView";
import QRCode from "../cardsDetailPage/qrCode";

import { Colors, Fonts } from "@/constants/theme";
import { getProjectInfo } from "@/scripts/getData";
import { StyledText, Title, TitleXSmall } from "../atoms/styledComponents";

const renderItems = [
    "model", "info", "images", "qrCode"
];

const windowWidth = Dimensions.get("window").width;
const cardWidth = 866;
const gap = 32;



const DetailPage = ({ page, setPage }) => {
    const ref = useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);

    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            /**
             * Calculate the difference between the current index and the target index
             * to ensure that the carousel scrolls to the nearest index
             */
            count: index - progress.value,
            animated: true,
        });
    };

    const project = getProjectInfo(page.id);
    console.log('PROJECT', project.transitionDomain);

    return (
        <View>
            <Carousel
                ref={ref}
                onProgressChange={progress}
                loop={false}
                style={{
                    width: windowWidth,
                    height: 741,
                    justifyContent: "center",
                }}

                width={cardWidth + gap}
                data={[...renderItems]}
                renderItem={({ item, index, animationValue }) => {
                    return (
                        <View style={[{ flex: 1 }, styles.card]}>
                            <View style={styles.header}>
                                <Title style={styles.title}>{project.title}</Title>
                                <TitleXSmall style={styles.subtitle}>{project.transitionDomain}</TitleXSmall>
                            </View>

                            <View style={{ flex: 1 }}>
                                {
                                    item === "model" ? <ModelView width={cardWidth} height={741} project={project} setPage={setPage} page={page} /> :
                                        item === "info" ? <Info project={project} /> :
                                            item === "images" ? <Images /> :
                                                item === "qrCode" ? <QRCode /> :
                                                    null
                                }
                            </View>
                        </View>
                    );
                }}

                // customAnimation={parallaxLayout(
                //     {
                //         size: Dimensions.get("window").width,
                //         vertical: false,
                //     },
                //     {
                //         parallaxScrollingScale: 1,
                //         parallaxAdjacentItemScale: 0.5,
                //         parallaxScrollingOffset: 40,
                //     },
                // )}
                scrollAnimationDuration={600}
            />

            <Pagination.Basic
                progress={progress}
                data={[...renderItems]}
                dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
                containerStyle={{ gap: 5, marginTop: 10 }}
                onPress={onPressPagination}
            />
        </View >

    );
}

const styles = StyleSheet.create({
    card: {
        padding: 64,
        borderColor: Colors.blue100,
        borderWidth: 2,
        borderRadius: 16,
        backgroundColor: Colors.white,
    },

    header: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'baseline',
        backgroundColor: 'green'
    },

    title: {
        fontFamily: Fonts.rounded.bold,
        fontSize: 48,
        color: Colors.blue100,
        backgroundColor: 'yellow'
    },

    subtitle: {
        fontFamily: Fonts.rounded.bold,
        fontSize: 24,
        color: Colors.blue80,
    }
});

export default DetailPage;