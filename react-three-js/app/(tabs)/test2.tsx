// https://www.youtube.com/watch?v=oCU5j5P20To
// https://github.com/pmndrs/react-three-fiber/issues/3583
//--> fout in de package...

import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Box3, CatmullRomCurve3, MeshPhysicalMaterial, Vector3 } from "three";

import megaphone from "../../assets/models/active-health.glb";

const smallBoxSize = 1;
const largeBoxSize = 3;
const spacing = 4;

const boxComposition = [
  { position: [0, 0, 0], size: [4, 4, 4], color: "black", label: "Center Box" },
  { position: [4, 3, -1], size: [2, 2, 2], color: "red", label: "Center Box" },
  { position: [4, -2.5, 0], size: [1.4, 1.4, 1.4], color: "blue", label: "Center Box" },
  { position: [3, 0, 0], size: [1.2, 1.2, 1.2], color: "green", label: "Center Box" },
  { position: [-4, 0.5, 0], size: [1.1, 1.1, 1.1], color: "yellow", label: "Center Box" },
  { position: [-2.5, -3, 0], size: [1.6, 1.6, 1.6], color: "purple", label: "Center Box" },
  { position: [-3, 3.2, 0], size: [1, 1, 1], color: "orange", label: "Center Box" },
  { position: [-5, -2, 0], size: [1.8, 1.8, 1.8], color: "pink", label: "Center Box" },
];

const materials = {
  glass: new MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.293,
    transparent: true,
    opacity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    ior: 1.5,
    side: 2, // DoubleSide for glass
  }),

  color: new MeshPhysicalMaterial({
    color: 0x87CEEB,
    metalness: 0.0,
    roughness: 0.802,
    transparent: true,
    opacity: 1.0,
  }),
};

const models = [megaphone,
  // pencil, chacosse, chip, gameboy, dna, globe, keyboard
];
models.forEach(model => useGLTF.preload(model));

const Loader = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="gray" wireframe />
  </mesh>
);


export const Cube = (props) => {
  const mesh = useRef();
  // draw the box
  return (
    <mesh position={props.position} ref={mesh}>
      <boxGeometry args={props.size} />
      <meshStandardMaterial color={props.color} transparent opacity={1} wireframe={true} />
    </mesh>
  );
}


export const SimpleLine = (props) => {
  const points = [
    new Vector3(0, 0, 0),
    new Vector3(0, 5, 0),
  ];

  const curve = new CatmullRomCurve3(points);

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
      <meshStandardMaterial {...materials.color} />
    </mesh>
  );
};

export const BoxCluster = () => {
  return (
    <group>
      {boxComposition.map((box, index) => (
        <Cube key={index} position={box.position} size={box.size} color={box.color} />
      ))}
    </group>
  );
};

export const Model = (props) => {
  const mesh = useRef();
  const gltf = useGLTF(props.url);

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      if (child.name.includes("glass")) {
        child.material = materials.glass;
      } else {
        child.material = materials.color;
      }
    }
  });

  const bbox = new Box3().setFromObject(gltf.scene);
  const center = bbox.getCenter(new Vector3());
  const size = bbox.getSize(new Vector3());

  console.log(size);
  const sizeMax = props.s[0];;
  console.log(props.s[0]);
  const sizeOrig = Math.max(size.x, size.y, size.z);
  const scale = sizeMax / sizeOrig;

  gltf.scene.position.sub(center);

  // useFrame((state, delta) => {
  //   let { x, y } = props.touchInput;

  //   x = x / 100;
  //   y = y / 100;
  // });

  return (
    <group ref={mesh} position={props.position} scale={[scale, scale, scale]} rotation={[0, -Math.PI / 2, 0]}>
      <primitive object={gltf.scene} />
      {/* bounding box */}
      {/* <mesh>
        <boxGeometry args={[sizeOrig, sizeOrig, sizeOrig]} />
        <meshStandardMaterial color="red" transparent opacity={0.05} wireframe={true} />
      </mesh> */}
    </group>
  );
};

export default function HomeScreen() {
  const ref = useRef();

  const [touchInput, setTouchInput] = useState({ x: 0, y: 0 });

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const handleTouchMove = (e) => {
    const touch = e.nativeEvent.changedTouches[0];

    const newTouchInput = {
      x: touch.locationX - windowWidth / 2,
      y: touch.locationY - windowHeight / 2,
    };

    setTouchInput(newTouchInput);
  };

  return (
    <View style={{ flex: 1 }} onTouchMove={handleTouchMove}>
      <Canvas style={styles.canvas} camera={{ position: [0, 0, 10] }}  >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 5]} intensity={0.6} />
        <Suspense>
          {/* {models.map((model, index) => (
            <Model key={index} url={model} position={boxComposition[index].position} s={boxComposition[index].size} touchInput={touchInput} />
          ))} */}
          <BoxCluster />
          <SimpleLine />
        </Suspense>
      </Canvas>
      <View style={{ flex: 1, position: 'absolute', top: 50, left: 20 }}>
        <Text>LABEL</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: "#ffffff",
  },

  labelContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(146, 49, 49, 0.9)',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

