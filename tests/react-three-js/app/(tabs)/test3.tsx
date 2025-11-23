import DOMComponent from '../../components/3Dscene';

export default function App() {
    return (
        // This is a DOM component. It re-exports a wrapped `react-native-webview` behind the scenes.
        <DOMComponent name="dom" />
    );
}