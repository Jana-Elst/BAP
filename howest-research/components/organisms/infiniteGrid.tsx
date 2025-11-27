import { StyleSheet, View, PanResponder } from 'react-native';
import React, { useState, useRef, useEffect, use, useMemo } from 'react';
import { InfiniteGrid } from "../../scripts/infiniteGrid";
import DiscoverCard from '../molecules/discoverCard';
import getPositions from '../../scripts/placeCards';

const canvasSize = { w: 5000, h: 5000 };

const InfiniteGridComponent = (props: { projects, page, setPage, isVisible }) => {
    const [items, setItems] = useState([]);
    const gridRef = useRef(null); //store infinite grid object
    const lastPanRef = useRef({ x: 0, y: 0 });

    const data = useMemo(() =>
        getPositions(
            props.projects.length,
            canvasSize.w,
            canvasSize.h,
            300,
            300
        ),
        [props.projects.length]
    );

    // const originalSize = { w: 300 * props.projects.length, h: 300 * props.projects.length };
    const originalSize = { w: canvasSize.w, h: canvasSize.h };

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