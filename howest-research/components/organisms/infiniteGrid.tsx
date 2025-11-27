import { StyleSheet, View, PanResponder } from 'react-native';
import React, { useState, useRef, useEffect, use } from 'react';
import { InfiniteGrid } from "../../scripts/infiniteGrid";
import DiscoverCard from '../molecules/discoverCard';
import getPositions from '../../scripts/placeCards';

//position on screen
// const data = [
//     { x: 300, y: 0, w: 300, h: 300 },
//     { x: 600, y: 0, w: 300, h: 300 },
//     { x: 900, y: 0, w: 300, h: 300 },
//     { x: 1200, y: 0, w: 300, h: 300 },
//     { x: 1500, y: 0, w: 300, h: 300 },
//     { x: 1800, y: 0, w: 300, h: 300 },
//     { x: 2100, y: 0, w: 300, h: 300 },
//     { x: 2400, y: 0, w: 300, h: 300 },
//     { x: 2700, y: 0, w: 300, h: 300 },
// ];

const InfiniteGridComponent = (props: { projects, page, setPage, isVisible }) => {
    const [items, setItems] = useState([]);
    const gridRef = useRef(null); //store infinite grid object
    const lastPanRef = useRef({ x: 0, y: 0 });

    const data = props.projects.map((project, index) => {
        return {
            x: (index * 300),
            y: 0,
            w: 300,
            h: 300,
        }
    });

    // const [data, setData] = useState(
    //     getPositions(
    //         props.projects.length,
    //         5000,
    //         5000,
    //         300,
    //         300
    //     )
    // );

    // console.log('DATA POSITIONS:', data);

const originalSize = { w: 300 * props.projects.length, h: 300 * props.projects.length };
// const originalSize = { w: 5000, h: 5000 };

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
            {items.map((item, index) => {
                return (
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
                        <DiscoverCard project={props.projects[index % props.projects.length]} page={props.page} setPage={props.setPage} isVisible={props.isVisible} />
                    </View>
                )
            }
            )}
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