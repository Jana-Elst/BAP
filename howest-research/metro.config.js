// Learn more https://docs.expo.io/guides/customizing-metro
// https://www.npmjs.com/package/react-native-svg-transformer

const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo")
};

config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"]
};

[("js", "jsx", "json", "ts", "tsx", "cjs", "mjs")].forEach((ext) => {
    if (config.resolver.sourceExts.indexOf(ext) === -1) {
        config.resolver.sourceExts.push(ext);
    }
});

["glb", "gltf", "png", "jpg"].forEach((ext) => {
    if (config.resolver.assetExts.indexOf(ext) === -1) {
        config.resolver.assetExts.push(ext);
    }
});



module.exports = config;