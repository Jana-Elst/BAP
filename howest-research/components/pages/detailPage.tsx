import * as React from "react";
import { useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
    ICarouselInstance,
    Pagination,
} from "react-native-reanimated-carousel";


import Card from "../atoms/card";
import Images from "../cardsDetailPage/images";
import Info from "../cardsDetailPage/info";
import ModelView from "../cardsDetailPage/modelView";
import QrCode from "../cardsDetailPage/qrCode";

import { Colors } from "@/constants/theme";
import { getProjectInfo } from "@/scripts/getData";
import { StyledText, Title, TitleXSmall } from "../atoms/styledComponents";


const renderItems = [
    "model", "info", "images", "qrCode"
];

const windowWidth = Dimensions.get("window").width;
const cardWidth = 866;
const cardHeight = 741;
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
        <View style={{ gap: 14, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Carousel
                ref={ref}
                onProgressChange={progress}
                loop={false}
                style={{
                    width: windowWidth,
                    height: cardHeight,
                    justifyContent: "center",
                }}

                width={cardWidth + gap}
                data={[...renderItems]}
                renderItem={({ item, index, animationValue }) => {
                    return (
                        <Card style={[styles.card]} fill={true} containerStyle={{ width: cardWidth }}>
                            <View style={styles.header}>
                                <Title style={styles.title}>{project.title}</Title>
                                <TitleXSmall style={styles.subtitle}>{project.transitionDomain}</TitleXSmall>
                            </View>

                            <View style={{ flex: 1}}>
                                {
                                    item === "model" ? <ModelView width={cardWidth} height={741} project={project} setPage={setPage} page={page} /> :
                                        item === "info" ? <Info project={project} /> :
                                            item === "images" ? <Images project={project} /> :
                                                item === "qrCode" ? <QrCode /> :
                                                    null
                                }
                            </View>
                        </Card>
                    );
                }}

                scrollAnimationDuration={600}
            />

            <Pagination.Basic
                progress={progress}
                data={[...renderItems]}
                dotStyle={{ backgroundColor: "rgba(255, 255, 255, 0.50)", borderRadius: 50, width: 12, height: 12 }}
                activeDotStyle={{ backgroundColor: "white", borderRadius: 50, width: 12, height: 12 }}
                containerStyle={{ gap: 8, marginTop: 0 }}
                onPress={onPressPagination}
            />
        </View >

    );
}

const styles = StyleSheet.create({
    card: {
        padding: 64,
    },

    header: {
        flexDirection: 'row',
        gap: 18,
        alignItems: 'baseline',
    },

    title: {
        color: Colors.blue100,
    },

    subtitle: {
        color: Colors.blue80,
    }
});

export default DetailPage;