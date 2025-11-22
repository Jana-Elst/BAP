import { Canvas, useFrame } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { Dimensions } from 'react-native';
import { useAnimatedSensor, SensorType } from 'react-native-reanimated';

const Box = (props) => {
  const [active, setActive] = useState(false);
  const mesh = useRef();

  useFrame((state, delta) => {
    let { x, y, z } = props.touchInput;

    console.log(x, y);
    x = x / 250;
    y = y / 250;

    mesh.current.rotation.x = y;
    mesh.current.rotation.y = x;
  });

  return (
    <mesh {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={active ? 'green' : 'gray'} />
    </mesh>
  );
}

export default function HomeScreen() {
  const [touchInput, setTouchInput] = useState({ x: 0, y: 0 });

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const handleTouchMove = (e) => {
    const touch = e.nativeEvent.changedTouches[0];
    setTouchInput({
      x: touch.locationX - windowWidth / 2,
      y: touch.locationY - windowHeight / 2,
    });
  };

  return (
    <View style={{ flex: 1 }} onTouchMove={handleTouchMove}>
      <Canvas>
        <ambientLight />
        {/* <pointLight position={[10, 10, 10]} /> */}

        <Box touchInput={touchInput} position={[0, 0, 0]} />
      </Canvas>
    </View>
  )
}