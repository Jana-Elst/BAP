import { FlashList } from "@shopify/flash-list";
import { StyleSheet, View, PanResponder, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import DiscoverCard from "../molecules/discoverCard";
import React, { useState, useRef, useEffect } from 'react';
import Header from "../organisms/header";
import Footer from "../organisms/footer";
import { InfiniteGrid } from "../../scripts/infiniteGrid";

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
// const InfiniteGrid = () => {
//     return (
//         <View style={styles.images}>
//             {images.map((img, index) => (
//                 <Image
//                     key={index}
//                     source={img}
//                     style={[styles.image, { top: data[index].y, left: data[index].x, width: data[index].w, height: data[index].h }]}
//                 />
//             ))}
//         </View>
//     );
// };

const InfiniteGridComponent = () => {
    const [items, setItems] = useState([]);
    const gridRef = useRef(null);
    const panResponderRef = useRef(null);

    useEffect(() => {
        gridRef.current = new InfiniteGrid({
            sources: images,
            data: data,
            originalSize: originalSize,
            onItemsUpdate: setItems,
        });

        gridRef.current.start();

        panResponderRef.current = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, { dx, dy }) => {
                if (gridRef.current) {
                    gridRef.current.onScroll(dx, dy);
                }
            },
        });

        return () => {
            if (gridRef.current) {
                gridRef.current.destroy();
            }
        };
    }, []);

    return (
        <View
            style={styles.images}
            {...panResponderRef.current?.panHandlers}
        >
            {items.map((item) => (
                <View
                    key={item.id}
                    style={{
                        position: 'absolute',
                        width: item.w,
                        height: item.h,
                        transform: [
                            { translateX: item.translateX },
                            { translateY: item.translateY }
                        ]
                    }}
                >
                    <Image
                        source={item.src}
                        style={{ width: '100%', height: '100%' }}
                    />
                </View>
            ))}
        </View>
    );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
    hero: {
        flex: 1,
    },

    images: {
        flex: 1,
    },

    image: {
        position: 'absolute',
    },
});