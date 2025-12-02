import * as React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Carousel, {
    ICarouselInstance,
    Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { useRef } from "react";

import { BlurView as _BlurView } from "expo-blur";
import { parallaxLayout } from "../../app/carrousel/parallax";

import Card from "../atoms/card";

import ModelView from "../cardsDetailPage/modelView";
import Info from "../cardsDetailPage/info";
import Images from "../cardsDetailPage/images";
import QRCode from "../cardsDetailPage/qrCode";

import data from '../../assets/data/structured-data.json';
import { getKeywords, getProjectInfo, getTransitionDomain } from "@/scripts/getData";
import { StyledText } from "../atoms/styledComponents";

const renderItems = [
    "model", "info", "images", "qrCode"
];

const windowWidth = Dimensions.get("window").width;
const cardWidth = 866;
const gap = 32;

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

const DetailPage = ({page, setPage}) => {
    console.log('Project', page.id);
    const project = getProjectInfo(page.id);
    console.log('PROJECT DETAIL PAGE', project);

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
                    alignItems: "center",
                }}

                width={cardWidth + gap}
                data={[...renderItems]}
                renderItem={({ item, index, animationValue }) => {
                    return (
                        <View style={{ flex: 1 }}>                            <StyledText>{project.title}</StyledText>
                            <StyledText>TransitieDomein</StyledText>

                            {
                                item === "model" ? <ModelView width={cardWidth} height={741} project={project} /> :
                                    item === "info" ? <Info project={project} /> :
                                        item === "images" ? <Images /> :
                                            item === "qrCode" ? <QRCode /> :
                                                null
                            }
                        </View>
                    );

                    // if (item === "model") {
                    //     return <ModelView width={cardWidth} height={741} />;
                    // } else if (item === "info") {
                    //     return <Info />;
                    // } else if (item === "images") {
                    //     return <Images />;
                    // } else if (item === "qrCode") {
                    //     return <QRCode />;
                    // }
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

export default DetailPage;