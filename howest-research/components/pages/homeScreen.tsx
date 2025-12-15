import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import CardsWorld from '../3Dscenes/cardsWorld';
import ViewToggle from "../molecules/viewToggle";
import Header from "../organisms/header";
import InstructionHomeScreen from '../organisms/instructionsHomeScreen';

const HomeScreen = ({ page, setPage, activeFilters, setActiveFilters, projects, setProjects }) => {
    const [isDiscoverMode, setIsDiscoverMode] = useState(true);

    const opacity = useSharedValue(page.isTouched ? 1 : 0);
    const instructionsOpacity = useSharedValue(page.isTouched ? 0 : 1);

    useEffect(() => {
        opacity.value = withTiming(page.isTouched ? 1 : 0, { duration: 500 });
        instructionsOpacity.value = withDelay(2000, withTiming(page.isTouched ? 0 : 1, { duration: 1000 }));
    }, [page.isTouched]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const instructionsAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: instructionsOpacity.value,
        };
    });

    return (
        <View style={styles.container}>
            <Header activeFilters={activeFilters} setActiveFilters={setActiveFilters} setProjects={setProjects} style={animatedStyle} />

            <View style={styles.cardsWorld}>
                <CardsWorld
                    name="dom"
                    projects={projects}
                    page={page}
                    setPage={setPage}
                    isDiscoverMode={isDiscoverMode}
                />
            </View>

            <Animated.View style={styles.footer}>
                <InstructionHomeScreen style={instructionsAnimatedStyle}/>
                <Animated.View style={animatedStyle}>
                    <ViewToggle setActive={setIsDiscoverMode} isActive={isDiscoverMode} />
                </Animated.View>
            </Animated.View>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },

    cardsWorld: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },

    footer: {
        alignSelf: 'center',
        marginBottom: 32,
    }
});