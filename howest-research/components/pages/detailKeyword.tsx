import { Canvas, Image as SkiaImage } from '@shopify/react-native-skia';
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
    const keywordImage = page.info.keywordImageSource;

    const visibleInfo = getVisiblePixelsInfo(keywordImage, 180, 180);

    // Calculate how to position the full image so visible pixels fill the canvas
    const imageScale = visibleInfo ? visibleInfo.boundingBox.width / visibleInfo.sourceRect.width : 1;
    const imageX = visibleInfo ? -visibleInfo.sourceRect.x * imageScale : 0;
    const imageY = visibleInfo ? -visibleInfo.sourceRect.y * imageScale : 0;
    const imageWidth = keywordImage ? keywordImage.width() * imageScale : 0;
    const imageHeight = keywordImage ? keywordImage.height() * imageScale : 0;
    const xPos = imageX + (180 - visibleInfo!.boundingBox.width) / 2;
    const yPos = imageY + (180 - visibleInfo!.boundingBox.height) / 2;

    const Header = () => {
        return (
            <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center', marginBottom: 44 }}>
                {keywordImage && visibleInfo && (
                    <Canvas style={{
                        width: 180,
                        height: 180,
                        overflow: 'hidden',
                    }}>
                        <SkiaImage
                            image={keywordImage}
                            x={xPos}
                            y={yPos}
                            width={imageWidth}
                            height={imageHeight}
                        />
                    </Canvas>
                )}
                <View style={{ alignItems: 'baseline', gap: 16, maxWidth: 650 }}>
                    <Title>{page.info.keyword.label}</Title>
                    <SubTitle style={{ marginBottom: 16, fontSize: 24 }}>Innovatie voor een actieve, gezonde en veerkrachtige samenleving</SubTitle>
                    <StyledText style={{ fontSize: 20, fontFamily: Fonts.sans.semiBold, color: Colors.textGrey }}>{filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projecten"}</StyledText>
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, paddingHorizontal: 128, marginTop: 72, height: '845' }}>
            <Card fill={true}>
                {/* <View style={{ flex: 1, paddingHorizontal: 44, gap: 32 }}> */}
                <View style={{ flex: 1 }}>
                    <FlashList
                        data={filteredProjects}
                        numColumns={2}
                        ListHeaderComponent={<Header />}
                        contentContainerStyle={{ paddingBottom: 32, paddingTop: 72, paddingHorizontal: 44 }}
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
                {/* </View> */}
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
});

export default DetailKeyword;