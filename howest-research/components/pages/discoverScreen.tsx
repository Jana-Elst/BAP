import { FlashList } from "@shopify/flash-list";
import { StyleSheet, View, PanResponder, Dimensions, Animated } from 'react-native';
import { Image } from 'expo-image';
import DiscoverCard from "../molecules/discoverCard";
import React, { useState, useRef, useEffect } from 'react';
import Header from "../organisms/header";
import Footer from "../organisms/footer";
import { InfiniteGrid } from "../../scripts/infiniteGrid";
import { or } from "three/src/nodes/TSL.js";

const { windowWidth, windowHeight } = Dimensions.get('window');

const originalSize = { w: 1522, h: 1238 };

const images = [
    require('../../assets/imgExample/image-1.jpg'),
    require('../../assets/imgExample/image-2.jpg'),
    require('../../assets/imgExample/image-3.jpg'),
    require('../../assets/imgExample/image-4.jpg'),
    require('../../assets/imgExample/image-5.jpg'),
    require('../../assets/imgExample/image-6.jpg'),
    require('../../assets/imgExample/image-7.jpg'),
    require('../../assets/imgExample/image-8.jpg'),
    require('../../assets/imgExample/image-9.jpg'),
]

const data = [
    { x: 71, y: 58, w: 400, h: 270 },
    { x: 211, y: 255, w: 540, h: 360 },
    { x: 631, y: 158, w: 400, h: 270 },
    { x: 1191, y: 245, w: 260, h: 195 },
    { x: 351, y: 687, w: 260, h: 290 },
    { x: 751, y: 824, w: 205, h: 154 },
    { x: 911, y: 540, w: 260, h: 350 },
    { x: 1051, y: 803, w: 400, h: 300 },
    { x: 71, y: 922, w: 350, h: 260 },
];

const DiscoverScreen = () => {
    return (
        <View style={styles.hero}>
            <InfiniteGridComponent />
        </View>
    );
};

// Separate component for infinite layer effect
const InfiniteGridComponent = () => {
    const [items, setItems] = useState([]);
    const gridRef = useRef(null); //store infinite grid object
    // const panResponderRef = useRef(null);

    const pan = useRef(new Animated.ValueXY()).current;

    const panResponderRef = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
            onPanResponderRelease: () => {
                pan.extractOffset();
            },
        }),
    ).current;

    // useEffect(() => {
    //     gridRef.current = InfiniteGrid({
    //         sources: images,
    //         data: data,
    //         originalSize: originalSize,
    //         onItemsUpdate: setItems,
    //     });

    //     gridRef.current.start();

    //     panResponderRef.current = PanResponder.create({
    //         //start capturing touch events
    //         onMoveShouldSetPanResponder: () => true,

    //         onPanResponderMove: (e, { dx, dy, moveX, moveY}) => {
    //             console.log('onScroll', dx, dy, moveX, moveY);

    //             if (gridRef.current) {
    //                 gridRef.current.onScroll(dx, dy);
    //             }
    //         },
    //     });

    //     return () => {
    //         if (gridRef.current) {
    //             gridRef.current.destroy();
    //         }
    //     };
    // }, []);

    return (
        <Animated.View
            style={[styles.images, { transform: [{ translateX: pan.x }, { translateY: pan.y }]   }]}
            {...panResponderRef.panHandlers}
        >
            {images.map((image, index) => (
                <View
                    key={index}
                    style={{
                        // position: 'absolute',
                        // width: item.w,
                        // height: item.h,
                        // transform: [
                        //     { translateX: item.translateX },
                        //     { translateY: item.translateY }
                        // ]                  
                    }}
                >
                    <Image
                        source={image}
                        style={{width: data[index].w, height: data[index].h, position: 'absolute', left: data[index].x, top: data[index].y }}
                    />
                </View>
            ))}
        </Animated.View>
    );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
    hero: {
        flex: 1,
    },

    images: {
        flex: 1,
        backgroundColor: 'blue',
        width: originalSize.w,
        height: originalSize.h,
    },

    image: {
        position: 'absolute',
    },
});