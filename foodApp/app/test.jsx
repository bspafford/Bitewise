import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function RippleButton() {
  const [ripples, setRipples] = useState([]);
  const rippleCount = useRef(0);
  const buttonRef = useRef(null);

  const createRipple = (x, y) => {
    const size = 200; // ripple diameter
    const scale = new Animated.Value(0);
    const opacity = new Animated.Value(0.3);
    const id = rippleCount.current++;

    setRipples((prev) => [...prev, { id, x, y, scale, opacity }]);

    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    });
  };

  return (
    <View style={styles.container}>
      <Pressable
        ref={buttonRef}
        style={styles.button}
        onPressIn={(e) => {
          if (Platform.OS === "ios") {
            const { pageX, pageY } = e.nativeEvent;
            buttonRef.current.measure((fx, fy, width, height, px, py) => {
              const localX = pageX - px;
              const localY = pageY - py;
              createRipple(localX, localY);
            });
          }
        }}
        android_ripple={{ color: "rgba(255,255,255,0.3)" }}
        onPress={() => console.log("Pressed!")}
      >
        {ripples.map((r) => (
          <Animated.View
            key={r.id}
            style={[
              styles.ripple,
              {
                top: r.y - 100,
                left: r.x - 100,
                transform: [{ scale: r.scale }],
                opacity: r.opacity,
              },
            ]}
          />
        ))}
        <Text style={styles.text}>Press me</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 20,
    borderRadius: 8,
    overflow: "hidden", // needed for clipping ripple to border radius
    width: 400,
    height: 500,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
  ripple: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "white",
  },
});
