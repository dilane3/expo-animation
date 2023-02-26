import React from "react";
import { Image, SafeAreaView, StyleSheet, useWindowDimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";

type ContextType = {
  x: number;
};

const SlideItem = ({ img }: { img: number }) => {
  return <Animated.View style={styles.sliderItem}>
    <Image 
      source={{ uri: `https://i.pravatar.cc/500?img=${img}` }}
      style={{ width: "100%", height: "100%", borderRadius: 20 }}
    />
  </Animated.View>;
};

export default function TabOneScreen() {
  // Constants
  const SLIDER_WIDTH = 200;
  const { width: WINDOW_WIDTH } = useWindowDimensions();

  // Animation values
  const translateX = useSharedValue(0);

  // Gesture handlers
  const gestureEvent = useAnimatedGestureHandler({
    onStart: (_, context: ContextType) => {
      context.x = translateX.value;
    },

    onActive: (event, context: ContextType) => {
      if (
        context.x + event.translationX > 0 &&
        context.x + event.translationX < SLIDER_WIDTH * 9 - 2*WINDOW_WIDTH
      ) {
        translateX.value = context.x + event.translationX;
      }

      console.log("translateX.value", translateX.value);
    },

    onEnd: (event, _) => {
      // Use withDecay
      console.log("event.velocityX", event.velocityX);
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [0, SLIDER_WIDTH * 9 - 2*WINDOW_WIDTH],
      });
    },
  });

  // Animated Style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          [0, SLIDER_WIDTH * 8 - WINDOW_WIDTH],
          [-((SLIDER_WIDTH + 20) * 8 - WINDOW_WIDTH + 20), SLIDER_WIDTH + 10],
          "clamp"
        ),
      },
    ],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureEvent}>
        <Animated.View style={[styles.sliderContainer, animatedStyle]}>
          <SlideItem img={1} />
          <SlideItem img={2} />
          <SlideItem img={3} />
          <SlideItem img={4} />
          <SlideItem img={5} />
          <SlideItem img={6} />
          <SlideItem img={7} />
          <SlideItem img={8} />
        </Animated.View>
      </PanGestureHandler>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#369AE1",
  },
  sliderContainer: {
    height: "100%",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  sliderItem: {
    width: 200,
    height: 340,
    borderRadius: 20,
    backgroundColor: "white",
    elevation: 5,
    marginRight: 20,
  },
});
