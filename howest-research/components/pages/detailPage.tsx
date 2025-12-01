import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { StyledText } from '../atoms/styledComponents';
import data from '../../assets/data/structured-data.json';
import BTNBack from '../atoms/BTNBack';
import { Colors, Fonts } from '@/constants/theme';
import Scene3D from '../3Dscenes/3DsceneNew';
import { getKeywords } from '../../scripts/getData';
import Card from '../atoms/card';

// import { createImagePaths } from '../scripts/create-image-paths';

const DetailPage = ({ page, setPage }) => {
    const clusters = data.clusters;
    const projects = data.projects;

    const project = projects.find(p => p.id === page.id);
    const keywordIDs = project.transitiedomeinen;
    const projectKeywords = getKeywords(keywordIDs);

    const handleOpendetailKeyword = (keywordId) => {
        console.log('KEYWORD ID', keywordId);
        setPage({
            page: 'detailKeyword',
            id: keywordId,
            previousPages: [
                ...page.previousPages || [],
                {
                    page: page.page,
                    id: page.id
                }
            ]
        })
    }

    console.log(page.previousPages.length);

    return (
        <View>
            <Card>
                
            </Card>
        </View>
        // <View style={styles.container}>
        //     <View style={styles.content}>
        //         {
        //             page.previousPages.length > 1 && <BTNBack project={project} page={page} setPage={setPage} />
        //         }

        //         <StyledText style={{ fontFamily: Fonts.rounded.bold, fontSize: 32, fontWeight: 'bold', backgroundColor: Colors.blue100 }}>{project.CCODE}</StyledText>
        //         <StyledText>
        //             {clusters.find(c => c.id === project.clusterId)?.label}
        //         </StyledText>

        //         <StyledText>Keywords</StyledText>
        //         {projectKeywords
        //             .map(keyword => (
        //                 <TouchableOpacity onPress={() => handleOpendetailKeyword(keyword.id)} key={keyword.id} style={styles.tag}>
        //                     <StyledText style={styles.tagStyledText}>{keyword.label} {keyword.id}</StyledText>
        //                 </TouchableOpacity>
        //             ))}
        //     </View>
        //     <View style={styles.container3D}>
        //         {/* <LinearGradient
        //                 colors={['rgba(255, 255, 255, 1)', 'transparent']}
        //                 style={styles.background}
        //             /> */}
        //         <Scene3D
        //             name="dom"
        //             projectKeywords={projectKeywords}
        //         />
        //     </View>
        // </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },

    content: {
        flex: 1,
    },

    container3D: {
        flex: 1,
        height: '100%',
        width: '100%',
    },

    button: {
        padding: 20,
        backgroundColor: 'green'
    },

    tag: {
        padding: 20,
        margin: 10,
        backgroundColor: 'pink'
    },
});