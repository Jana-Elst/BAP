import { Colors, Fonts } from "@/constants/theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { StyledText } from "../atoms/styledComponents";
import AccordeonItem from "./accordeonItem";

const AccordeonHowestResearch = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handlePress = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    }

    return (
        <View>
            <AccordeonItem
                title={'Onderzoek klaar om in te zetten'}
                onPress={() => handlePress(0)}
                isVisible={activeIndex === 0}
            >
                <View style={styles.content}>
                    <StyledText style={styles.intro}>Denk je dat onderzoek tijdrovend of moeilijk toepasbaar is in je bedrijf?</StyledText>
                    <StyledText>Bij Howest hebben we het werk al gedaan. Onze onderzoekers hebben projecten opgezet, uitgetest en vertaald naar concrete oplossingen die klaarstaan om in jouw organisatie te worden ingezet.</StyledText>
                    <StyledText>Benieuwd of een project relevant is voor jouw bedrijf? Scan de QR-code en plan een gratis adviesgesprek. Samen bekijken we hoe dit onderzoek jouw werking sterker, efficiënter of innovatiever kan maken.</StyledText>
                </View>
            </AccordeonItem>

            <AccordeonItem
                title={"Waarom Howest Research?"}
                onPress={() => handlePress(1)}
                isVisible={activeIndex === 1}
            >
                <View style={styles.content}>
                    <StyledText style={styles.intro}>Bent u op zoek naar antwoorden op de uitdagingen waar uw organisatie voor staat?</StyledText>
                    <StyledText style={styles.intro}>Wilt u ondersteuning bij de ontwikkeling van een product of dienst?</StyledText>
                    <StyledText style={styles.intro}>Bent u geïnteresseerd in deelname aan een onderzoeksproject?</StyledText>
                    <StyledText>Om uw organisatie of bedrijf te helpen, screenen onze onderzoekers continu nieuwe evoluties en technologieën om kansen voor optimalisatie en innovatie te identificeren. Bovendien kunt u onze state-of-the-art infrastructuur gebruiken om nieuwigheden te testen en te ontwikkelen. Wilt u liever meer te weten komen tijdens een persoonlijk gesprek en kennismaken met een van onze experts? Dat kan dankzij het Blikopener-programma van de Vlaamse Overheid.</StyledText>
                </View>
            </AccordeonItem>


            <AccordeonItem
                title={'Onze missie'}
                onPress={() => handlePress(2)}
                isVisible={activeIndex === 2}
            >
                <View style={styles.content}>
                    <StyledText>Met onderzoek dat ertoe doet en innovatie die het verschil maakt, dragen we bij aan de realisatie van onder andere Vizier 2030, de Vlaamse vertaling van de SDG's en Visie 2050, de langetermijnvisie voor Vlaanderen.</StyledText>
                    <StyledText>Howest Research kiest voor missiegedreven en impactgericht onderzoek. Onze hogeschool zet in op innovatieve onderzoeksprojecten als antwoord op maatschappelijke uitdagingen, toegespitst op vijf strategische transitiedomeinen, met elk hun missies.</StyledText>
                </View>
            </AccordeonItem>
        </View>
    );
};

const styles = StyleSheet.create({
    intro: {
        color: Colors.blueText,
        fontFamily: Fonts.sans.semiBold,
        fontSize: 18,
    },
    content: {
        gap: 16,
    }
});

export default AccordeonHowestResearch;