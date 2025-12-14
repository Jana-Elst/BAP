import * as React from "react";
import { useMemo, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { default as Animated, useSharedValue } from 'react-native-reanimated';
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
import { getEnteringFade, getEnteringFadeScale, getExitingFade, getExitingFadeScale } from "@/scripts/animations";
import { getProjectInfo } from "@/scripts/getData";
import { checkIsLoading } from "@/scripts/getHelperFunction";
import { Shimmer, ShimmerProvider } from 'react-native-fast-shimmer';
import { Easing } from 'react-native-reanimated';
import { Title, TitleXSmall } from "../atoms/styledComponents";

const windowWidth = Dimensions.get("window").width;
const cardWidth = 866;
const cardHeight = 741;
const gap = 32;

const DetailPage = ({ page, setPage }) => {
    const ref = useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    
    const projectRef = useRef(getProjectInfo(page.id));
    if (page.page === 'detailResearch') {
        projectRef.current = getProjectInfo(page.id);
    }
    const project = projectRef.current;

    const isLoading = useMemo(() => {
        console.log('isLoading', page.isLoading);
        return checkIsLoading(page.isLoading);
    }, [page.isLoading]);

    const renderItems = useMemo(() => {
        if (!isLoading) {
            return [
                "model", "info", "images", "qrCode"
            ];
        }
        return [
            "model"
        ];
    }, [isLoading]);

    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };

    const previousPage = page.previousPages[page.previousPages.length - 1]?.page;

    return (
        <Animated.View
            entering={previousPage === 'discover' ? getEnteringFadeScale(400).delay(400) : undefined}
            exiting={previousPage === 'discover' ? getExitingFadeScale() : getExitingFade(400)}
            style={{ gap: 16, flex: 1, paddingBottom: 8 }}>
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
                            <Animated.View style={{ flex: 1 }} entering={index !== 0 ? getEnteringFade(800) : getEnteringFade(0)}>
                                <View style={styles.header}>
                                    <Title style={{ color: Colors[project.color + 'Text'] }}>{project.title}</Title>
                                    <TitleXSmall style={{ color: Colors[project.color + '80'] }}>{project.transitionDomain}</TitleXSmall>
                                </View>

                                <View style={{ flex: 1 }}>
                                    {
                                        item === "model" ? <ModelView width={cardWidth} height={741} project={project} setPage={setPage} page={page} /> :
                                            item === "info" ? <Info project={project} /> :
                                                item === "images" ? <Images project={project} /> :
                                                    item === "qrCode" ? <QrCode project={project} /> :
                                                        null
                                    }
                                </View>
                            </Animated.View>

                            {
                                isLoading && (
                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
                                        <Card style={{ width: cardWidth, height: cardHeight }}>
                                            <ShimmerProvider duration={2000}>
                                                <View style={{ width: '100%', height: '100%' }}>
                                                    <Shimmer
                                                        style={{ width: '100%', height: '100%' }}
                                                        easing={Easing.linear}
                                                        speed={1}
                                                        linearGradients={['transparent', 'rgba(255, 255, 255, 0.2)', 'transparent']}
                                                    />
                                                </View>
                                            </ShimmerProvider>
                                        </Card>
                                    </View>
                                )
                            }
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
                containerStyle={{ gap: 8, marginTop: 0, opacity: isLoading ? 0 : 1 }}
                onPress={onPressPagination}
            />
        </Animated.View >
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