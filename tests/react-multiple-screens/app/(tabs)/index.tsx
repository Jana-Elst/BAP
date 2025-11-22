import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ExternalDisplay, {
  useExternalDisplay,
} from 'react-native-external-display';

export default function HomeScreen() {
  //if total screen count is 1 --> external screen is connected!
  const screens = useExternalDisplay();
  const screenIds = Object.keys(screens);
  const screenCount = screenIds.length;

  console.log(screens);

  const colors = ['red', 'yellow', 'blue'];
  const [selectedColor, setSelectedColor] = useState('pink');

  const changeColor = (color: string) => {
    console.log('Setting color to:', color);
    setSelectedColor(color);
  }

  if (screenCount > 0) {
    return (
      <>
        <ExternalDisplay
          mainScreenStyle={{ flex: 1 }}
          fallbackInMainScreen
          screen={Object.keys(screens)[0]}
          // screen={screenIds[0]}
        >
          <View style={[styles.externalContainer, { backgroundColor: selectedColor }]}>
            <Text style={styles.externalText}>
              This is the External Display!
            </Text>
          </View>
        </ExternalDisplay>

        <View style={{ flex: 1}}>

          {
            colors.map(color => {
              return (
                <Pressable
                  key={color}
                  onPress={() => changeColor(color)}
                  style={[styles.buttonContainer, { backgroundColor: color }]}
                >
                  <Text>{color}</Text>
                </Pressable>
              )
            })
          }
        </View>
      </>
    )

  } else {
    return (
      <View style={{ flex: 1 }}>
        <Text>Er is geen extra scherm geconnecteerd</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  externalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  externalText: {
    color: 'white',
    fontSize: 96,
    fontWeight: 'bold',
  },

  buttonContainer: {
    height: 100,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
})