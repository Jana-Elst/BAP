import { View, Text, StyleSheet, Image, Dimensions } from "react-native";

export default function TabTwoScreen() {
  const scatterDirections = [
    { x: 1.3, y: 0.7 },
    { x: -1.5, y: 1.0 },
    { x: 1.1, y: -1.3 },
    { x: -1.7, y: -0.8 },
    { x: 0.8, y: 1.5 },
    { x: -1.0, y: -1.4 },
    { x: 1.6, y: 0.3 },
    { x: -0.7, y: 1.7 },
    { x: 1.2, y: -1.6 },
    { x: -1.4, y: 0.9 },
    { x: 1.8, y: -0.5 },
    { x: -1.1, y: -1.8 },
    { x: 0.9, y: 1.8 },
    { x: -1.9, y: 0.4 },
    { x: 1.0, y: -1.9 },
    { x: -0.8, y: 1.9 },
    { x: 1.7, y: -1.0 },
    { x: -1.3, y: -1.2 },
    { x: 0.7, y: 2.0 },
    { x: 1.25, y: -0.2 }
  ];

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const scatterMultiplier = 0.5;

  return (
    <View style={styles.container}>
      {/* {
        for (let index = 0; index < scatterDirections.length; index++) {
          const element = array[index];
          <View key={index} style={styles.card}></View>
        }
      } */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: 200,
    height: 200,
    backgroundColor: "lightblue",
    borderRadius: 10,
  },
});
