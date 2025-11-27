import { StyleSheet, View, PanResponder } from 'react-native';
import { Image } from 'expo-image';
import React, { useState, useRef, useEffect } from 'react';
import { InfiniteGrid } from "../../scripts/infiniteGrid";
import DiscoverCard from '../molecules/discoverCard';

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

//position on screen
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

const InfiniteGridComponent = (props: { projects, page, setPage, isVisible }) => {
    const [items, setItems] = useState([]);
    const gridRef = useRef(null); //store infinite grid object
    const lastPanRef = useRef({ x: 0, y: 0 });

    const panResponderRef = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (e, { dx, dy }) => {

                // Calculate delta from last position
                const deltaX = dx - lastPanRef.current.x;
                const deltaY = dy - lastPanRef.current.y;

                lastPanRef.current = { x: dx, y: dy };

                if (gridRef.current) {
                    gridRef.current.onScroll(deltaX, deltaY);
                }
            },
            onPanResponderRelease: () => {
                lastPanRef.current = { x: 0, y: 0 };
            },
        }),
    ).current;

    useEffect(() => {
        gridRef.current = InfiniteGrid({
            sources: images,
            data: data,
            originalSize: originalSize,
            onItemsUpdate: setItems,
        });

        gridRef.current.start();

        return () => {
            if (gridRef.current) {
                gridRef.current.destroy();
            }
        };
    }, []);

    return (
        <View
            style={styles.images}
            {...panResponderRef.panHandlers}
        >
            <View>
                {items.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            position: 'absolute',
                            width: item.w,
                            height: item.h,
                            left: item.translateX,
                            top: item.translateY,
                        }}
                    >
                        <Image
                            source={item.src}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

export default InfiniteGridComponent;

const styles = StyleSheet.create({
    images: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    image: {
        position: 'absolute',
    },
});