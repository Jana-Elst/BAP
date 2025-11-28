import { StyleSheet, View, PanResponder, Dimensions } from 'react-native';
import React, { useState, useRef, useEffect, use, useMemo } from 'react';
import { InfiniteGrid } from "../../scripts/infiniteGrid";
import ProjectCard from '../molecules/projectCard';
import getPositions from '../../scripts/placeCards';

const canvasSize = { w: 9000, h: 9000 };
const windowDimensions = Dimensions.get('window');

const InfiniteGridComponent = (props: { projects, page, setPage, isVisible }) => {
    const previousPan = useRef({ x: 0, y: 0 });
    const targetDist = useRef({ x: 0, y: 0 });
    const currentDist = useRef({ x: 0, y: 0 });
    const extra = useRef({ x: 0, y: 0 });
    const [finalPosition, setFinalPostion] = useState({ x: 0, y: 0 });

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (e, { dx, dy }) => {
                //dx -> links naar rechts, d = afgelegde afstand
                // dy -> top naar bottom, d = afgelegde afstand

                //verplaatste afstand van laatste positie
                const deltaX = dx - previousPan.current.x;
                const deltaY = dy - previousPan.current.y;

                previousPan.current = { x: dx, y: dy };

                targetDist.current.x += deltaX;
                targetDist.current.y += deltaY;

                //let start scrolling
                currentDist.current.x += (targetDist.current.x - currentDist.current.x);
                currentDist.current.y += (targetDist.current.y - currentDist.current.y);

                //determine scroll direction
                const directionX = currentDist.current.x > previousPan.current.x ? 'left' : 'right';
                const directionY = currentDist.current.y > previousPan.current.y ? 'up' : 'down';

                //how far did the user pan?
                const panX = currentDist.current.x;
                const panY = currentDist.current.y;

                //current position
                const posX = panX;
                const posY = panY;

                //infinite wrap horizontal
                const beforeX = posX > windowDimensions.width;
                const afterX = posX + windowDimensions.width < 0;
                if (directionX === 'right' && beforeX) extra.current.x -= windowDimensions.width;
                if (directionX === 'left' && afterX) extra.current.x += windowDimensions.width;

                //final positions
                const finalX = panX;
                const finalY = panY;

                setFinalPostion({ x: finalX, y: finalY });
            },

            onPanResponderRelease: () => {
                previousPan.current = { x: 0, y: 0 };
            },
        }),
    ).current;


    const totalProjects = props.projects.length;
    const cardsPerFrame = 6;
    const totalFrames = Math.ceil(totalProjects / cardsPerFrame);
    const canvasesPerRow = 3;
    const layers = 10;

    const positionsList = useMemo(() => {
        let positionList = [];
        for (let index = 0; index < totalFrames; index++) {
            const positions = getPositions(
                6, windowDimensions.width + windowDimensions.width / 2, windowDimensions.height + windowDimensions.height / 2, 330, 400,
            )

            positionList.push(positions);
        }

        return positionList;
    }, []);

    return (
        <View
            style={styles.panContainer}
            {...panResponder.panHandlers}
        >
            <View style={{ flex: 1 }}>
                {
                    positionsList.map((positions, indexCanvas) => {
                        const canvasWidth = windowDimensions.width + windowDimensions.width / 2;
                        const canvasHeight = windowDimensions.height + windowDimensions.height / 2;

                        const columnIndex = indexCanvas % canvasesPerRow;
                        const rowIndex = Math.floor(indexCanvas / canvasesPerRow);

                        return (
                            <View
                                key={indexCanvas}
                                style={{
                                    backgroundColor: 'blue',
                                    borderColor: 'yellow',
                                    borderStyle: 'solid',
                                    borderWidth: 2,
                                    borderRadius: 16,
                                    width: canvasWidth,
                                    height: canvasHeight,
                                    position: 'absolute',

                                    left: finalPosition.x + columnIndex * canvasWidth,
                                    top: finalPosition.y + rowIndex * canvasHeight,
                                }}>

                                {
                                    positions.map((position, indexCard) => {
                                        const index = indexCanvas * cardsPerFrame + indexCard
                                        return (
                                            <View
                                                key={indexCard}
                                                style={{
                                                    position: 'absolute',
                                                    left: position.x,
                                                    top: position.y,
                                                    width: 330,
                                                    height: 400
                                                }}>
                                                {
                                                    props.projects[index] &&
                                                    <ProjectCard project={props.projects[index]} page={props.page} setPage={props.setPage} isVisible={props.isVisible} />
                                                }
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        )
                    })
                }
            </View>
        </View >
    );
};

export default InfiniteGridComponent;

const styles = StyleSheet.create({
    panContainer: {
        backgroundColor: 'yellow',
        flex: 1,
        width: '100%',
        height: '100%',
    },

    image: {
        position: 'absolute',
    },
});