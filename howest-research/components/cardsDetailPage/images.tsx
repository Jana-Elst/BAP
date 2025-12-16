//https://www.npmjs.com/package/react-native-base64
// https://reactnative.dev/docs/images

import { Canvas, Skia, Image as SkiaImage } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";

const Images = ({ project }) => {
    const data = Skia.Data.fromBase64("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
    const image = Skia.Image.MakeImageFromEncoded(data);

    // const imageSource = base64.decode(project.images);
    // console.log(imageSource)

    return (
        <Canvas style={{ flex: 1 }}>
            {/* <SkiaImage image={image} fit="contain" x={0} y={0} /> */}
        </Canvas>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 30,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});

export default Images;