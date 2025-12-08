import { Text } from 'react-native';
import useGetClusterImages from '../../scripts/getClusterImages';


const HomeScreenHologram = () => {
    const images = useGetClusterImages('clusteroverschrijdendImages');
    console.log('HomeScreenHologram images:', images);

            return (
                    <Text style={{ color: 'white', fontSize: 72, fontWeight: 'bold' }}>HOME SCREEN</Text>
            );
}

export default HomeScreenHologram;