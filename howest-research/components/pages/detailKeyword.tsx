import { Canvas, Image as SkiaImage, useImage } from '@shopify/react-native-skia';
import { StyleSheet, View } from 'react-native';
import { StyledText, SubTitle, Title } from '../atoms/styledComponents';

import { Colors, Fonts } from '@/constants/theme';
import { getProjectsByKeyword } from "@/scripts/getData";
import { getVisiblePixelsInfo } from '@/scripts/getHelperFunction';
import { FlashList } from '@shopify/flash-list';
import Card from "../atoms/card";
import ProjectCardLarge from '../molecules/projectCardLarge';

const DetailKeyword = ({ page, setPage, setVisible }) => {
    const filteredProjects = getProjectsByKeyword(page.id);
    const keywordImage = useImage(page.info.keywordImageSource);

    const visibleInfo = getVisiblePixelsInfo(keywordImage, 180, 180);
    console.log("visibleInfo:", visibleInfo);

    // Calculate how to position the full image so visible pixels fill the canvas
    const imageScale = visibleInfo ? visibleInfo.boundingBox.width / visibleInfo.sourceRect.width : 1;
    const imageX = visibleInfo ? -visibleInfo.sourceRect.x * imageScale : 0;
    const imageY = visibleInfo ? -visibleInfo.sourceRect.y * imageScale : 0;
    const imageWidth = keywordImage ? keywordImage.width() * imageScale : 0;
    const imageHeight = keywordImage ? keywordImage.height() * imageScale : 0;

    console.log("imageScale:", imageScale, "imageX:", imageX, "imageY:", imageY);

    return (
        <View style={{ flex: 1, paddingHorizontal: 128, marginTop: 72, height: '845' }}>
            <Card fill={true}>
                <View style={{ flex: 1, paddingHorizontal: 44, paddingTop: 72, gap: 32 }}>
                    <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center' }}>
                        {keywordImage && visibleInfo && (
                            <Canvas style={{
                                width: visibleInfo.boundingBox.width,
                                height: visibleInfo.boundingBox.height,
                                overflow: 'hidden'
                            }}>
                                <SkiaImage
                                    image={keywordImage}
                                    x={imageX}
                                    y={imageY}
                                    width={imageWidth}
                                    height={imageHeight}
                                />
                            </Canvas>
                        )}
                        <View style={{ alignItems: 'baseline', gap: 16, maxWidth: 650 }}>
                            <Title>{page.info.keyword.label}</Title>
                            <SubTitle style={{ marginBottom: 16, fontSize: 24 }}>Innovatie voor een actieve, gezonde en veerkrachtige samenleving</SubTitle>
                            <StyledText style={{ fontSize: 20, fontFamily: Fonts.sans.semiBold, color: Colors.blueText }}>{filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projecten"}</StyledText>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlashList
                            data={filteredProjects}
                            numColumns={2}
                            contentContainerStyle={{ paddingBottom: 32 }}
                            renderItem={({ item: project }) => {
                                return (
                                    <View style={{ padding: 8 }}>
                                        <ProjectCardLarge project={project} page={page} setPage={setPage} setVisible={setVisible} />
                                    </View>
                                )
                            }
                            }
                            showsVerticalScrollIndicator={false}
                            estimatedItemSize={200}
                        />
                    </View>
                </View>
            </Card>
        </View>
        // <Card fill={true}>
        //     <View style={styles.imageContainer}>
        //         <Image
        //             style={styles.image}
        //             source={ImageProject1}
        //             contentFit="contain"
        //         />
        //     </View>
        //     <StyledText>TITEL</StyledText>
        //     <StyledText>uitleg</StyledText>
        //     <StyledText>{filteredProjects.length} projecten</StyledText>
        //     <View style={styles.listContainer}>
        //         <FlashList
        //             data={filteredProjects}
        //             numColumns={2}
        //             renderItem={({ item: project }) => {
        //                 return (
        //                     <ProjectCardLarge project={project} page={page} setPage={setPage} setVisible={setVisible} cardSize='large' />
        //                 )
        //             }
        //             }
        //             showsVerticalScrollIndicator={true}
        //             estimatedItemSize={200}
        //         />
        //     </View>
        // </Card>
    )
}

const styles = StyleSheet.create({
});

export default DetailKeyword;