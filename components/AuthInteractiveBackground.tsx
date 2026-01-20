import React, { PropsWithChildren, useRef } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";

const clamp = (value: number, limit: number) =>
    Math.max(-limit, Math.min(limit, value));

const AuthInteractiveBackground = ({ children }: PropsWithChildren) => {
    const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    const resetPan = () => {
        Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 7,
            tension: 40,
        }).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gesture) =>
                Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,
            onPanResponderMove: (_, gesture) => {
                pan.setValue({
                    x: clamp(gesture.dx, 120),
                    y: clamp(gesture.dy, 120),
                });
            },
            onPanResponderRelease: resetPan,
            onPanResponderTerminate: resetPan,
        })
    ).current;

    const slowLayer = {
        transform: [
            { translateX: Animated.multiply(pan.x, 0.08) },
            { translateY: Animated.multiply(pan.y, 0.08) },
        ],
    };
    const midLayer = {
        transform: [
            { translateX: Animated.multiply(pan.x, -0.12) },
            { translateY: Animated.multiply(pan.y, 0.12) },
        ],
    };
    const fastLayer = {
        transform: [
            { translateX: Animated.multiply(pan.x, 0.2) },
            { translateY: Animated.multiply(pan.y, -0.16) },
        ],
    };

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            <Animated.View
                pointerEvents="none"
                style={[styles.blob, styles.blobOne, slowLayer]}
            />
            <Animated.View
                pointerEvents="none"
                style={[styles.blob, styles.blobTwo, midLayer]}
            />
            <Animated.View
                pointerEvents="none"
                style={[styles.blob, styles.blobThree, fastLayer]}
            />
            <View style={styles.content} pointerEvents="box-none">
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F5F0",
        overflow: "hidden",
    },
    content: {
        flex: 1,
    },
    blob: {
        position: "absolute",
        borderRadius: 999,
        opacity: 0.7,
    },
    blobOne: {
        width: 320,
        height: 320,
        top: -140,
        left: -90,
        backgroundColor: "#FFCF9F",
    },
    blobTwo: {
        width: 260,
        height: 260,
        top: 200,
        right: -110,
        backgroundColor: "#BFE8DE",
    },
    blobThree: {
        width: 220,
        height: 220,
        bottom: -90,
        left: 40,
        backgroundColor: "#F6B8C8",
    },
});

export default AuthInteractiveBackground;
