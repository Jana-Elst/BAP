import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { StyledText } from '../atoms/styledComponents';
import { Colors, Fonts } from "@/constants/theme";
import Card from "@/components/atoms/card";
import RadialGradientComponent from '../atoms/radialGradient';

import activeHealthCah from '../../assets/images/filters/activeHealthCah.png';
import architectuurEnDesignCad from '../../assets/images/filters/architectuurEnDesignCad.png';
import bedrijfEnOrganisatieCbo from '../../assets/images/filters/bedrijfEnOrganisatieCbo.png';
import businessEnMediaCbm from '../../assets/images/filters/businessEnMediaCbm.png';
import designTechnologyArtCdta from '../../assets/images/filters/designTechnologyArtCdta.png';
import digitalArtsAndEntertainmentCdae from '../../assets/images/filters/digitalArtsAndEntertainmentCdae.png';
import informaticaEnTechnologieCit from '../../assets/images/filters/informaticaEnTechnologieCit.png';
import lifeSciencesCls from '../../assets/images/filters/lifeSciencesCls.png';
import mensEnWelzijnCmw from '../../assets/images/filters/mensEnWelzijnCmw.png';
import schoolOfEducationCse from '../../assets/images/filters/schoolOfEducationCse.png';
import schoolOfNursingCsn from '../../assets/images/filters/schoolOfNursingCsn.png';
import smartTechCst from '../../assets/images/filters/smartTechCst.png';
import sociaalAgogischWerkCsaw from '../../assets/images/filters/sociaalAgogischWerkCsaw.png';

import digitaal from '../../assets/images/filters/digitaal.png';
import ecologisch from '../../assets/images/filters/ecologisch.png';
import gezond from '../../assets/images/filters/gezond.png';
import sociaal from '../../assets/images/filters/sociaal.png';
import leren from '../../assets/images/filters/leren.png';
import { useMemo, useState } from 'react';
import { getDomainColor } from '@/scripts/getData';

const images = {
    'activeHealthCah': activeHealthCah,
    'architectuurEnDesignCad': architectuurEnDesignCad,
    'bedrijfEnOrganisatieCbo': bedrijfEnOrganisatieCbo,
    'businessEnMediaCbm': businessEnMediaCbm,
    'designTechnologyArtCdta': designTechnologyArtCdta,
    'digitalArtsAndEntertainmentCdae': digitalArtsAndEntertainmentCdae,
    'informaticaEnTechnologieCit': informaticaEnTechnologieCit,
    'lifeSciencesCls': lifeSciencesCls,
    'mensEnWelzijnCmw': mensEnWelzijnCmw,
    'schoolOfEducationCse': schoolOfEducationCse,
    'schoolOfNursingCsn': schoolOfNursingCsn,
    'smartTechCst': smartTechCst,
    'sociaalAgogischWerkCsaw': sociaalAgogischWerkCsaw,
    'digitaal': digitaal,
    'ecologisch': ecologisch,
    'gezond': gezond,
    'sociaal': sociaal,
    'leren': leren,
}


const FilterCard = ({ project, onPress, isActive, filter }) => {
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    
    const color = useMemo(() => {
        if (filter === 'domain') {
            return getDomainColor(project.formattedName);
        }
        return '';
    }, [filter, project.formattedName]);


    const handleLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerSize({ width, height });
        console.log('Container size:', width, height);
    };

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Card
                style={[
                    styles.card,
                    isActive && { backgroundColor: Colors.blue100 },
                    filter === 'cluster' && { width: 170, height: 170, padding: 12 }
                ]}
                onLayout={handleLayout}>
                <View style={styles.imageContainer}>
                    <Image
                        style={[styles.image, filter === 'cluster' && { width: 150, height: 100 }]}
                        source={images[project.formattedName] || null}
                        contentFit="contain"
                    />
                </View>

                {filter === 'cluster' && (
                    <StyledText style={styles.text}>{project.label}</StyledText>
                )}
            </Card>


            {filter === 'domain' && (
                <View style={styles.radialGradientContainer}>
                    <RadialGradientComponent width={containerSize.width} height={containerSize.height} color={color} />
                </View>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
    },

    card: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    text: {
        fontFamily: Fonts.rounded.light,
        textAlign: 'center',
    },

    imageContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: 210,
        height: 210,
    },

    radialGradientContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        borderRadius: 30,
        overflow: 'hidden',
    },
});

export default FilterCard;