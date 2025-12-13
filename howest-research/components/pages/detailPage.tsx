import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
    ICarouselInstance,
    Pagination,
} from "react-native-reanimated-carousel";
import { Shimmer, ShimmerProvider } from 'react-native-fast-shimmer';
import { Easing } from 'react-native-reanimated';


import Card from "../atoms/card";
import Info from "../cardsDetailPage/info";
import ModelView from "../cardsDetailPage/modelView";
import QrCode from "../cardsDetailPage/qrCode";

import { Colors } from "@/constants/theme";
import { getProjectInfo } from "@/scripts/getData";
import { checkIsLoading } from "@/scripts/getHelperFunction";
import { Title, TitleXSmall } from "../atoms/styledComponents";


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
    const project = getProjectInfo(page.id);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log('page.isLoading CHANGING', page.isLoading);
        const loadState = checkIsLoading(page.isLoading);
        setIsLoading(loadState);
        if (loadState) {
            console.log('isLoading LAAAD');
        }
    }, [page.isLoading]);

    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };

    if (isLoading) {
        // background: linear - gradient(-45deg, #eee 40 %, #fafafa 50 %, #eee 60 %);
        return (
            <Card style={{ width: cardWidth, height: cardHeight}}>
                <ShimmerProvider duration={1000}>
                    <View>
                        <Shimmer />
                    </View>
                </ShimmerProvider>
            </Card>
        )
    }

    return (
        <View style={{ gap: 16, flex: 1, paddingBottom: 8 }}>
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
                                <Title style={{ color: Colors[project.color + 'Text'] }}>{project.title}</Title>
                                <TitleXSmall style={{ color: Colors[project.color + '80'] }}>{project.transitionDomain}</TitleXSmall>
                            </View>

                            <View style={{ flex: 1 }}>
                                {
                                    item === "model" ? <ModelView width={cardWidth} height={741} project={project} setPage={setPage} page={page} /> :
                                        item === "info" ? <Info project={project} /> :
                                            // item === "images" ? <Images project={project} /> :
                                            item === "qrCode" ? <QrCode project={project} /> :
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
});

export default DetailPage;