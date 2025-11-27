//This file is used to restructer the database of Howest Research
//It returns a new JSON file
//Run node scripts/create-db to create the file

const fs = require('fs');
const path = require('path');

const _ = require('lodash');

const rawData = require('../assets/data/data.json');

const formattedName = (text) => {
    return _.camelCase(text);
};

const createDB = () => {
    const data = rawData[0];
    let keywords = [];
    let keywordCategories = [];
    let transitiedomeinen = [];
    let transitiedomeinCategories = [];
    let onderzoeksgroepen = [];
    let clusters = [];
    let projectTypes = [];
    let projects = [];


    data.keywords.forEach(keyword => {
        const exists = keywords.some(k => k.label === keyword.KeywordLabel);
        if (!exists && keyword.KeywordLabel !== 'NULL' && keyword.KeywordLanguageID === 1) {
            keywords.push({
                id: keyword.KeywordID,
                label: keyword.KeywordLabel,
                keywordCategoryIDs: keyword.KeywordCategoryIDs,
                formattedName: formattedName(keyword.KeywordLabel)
            });
        }
    });
    keywords.sort((a, b) => a.ID - b.ID);

    data.keywords.forEach(keyword => {
        const exists = keywordCategories.some(k => k.label === keyword.KeywordCategories);
        if (!exists && keyword.KeywordLanguageID === 1 && keyword.KeywordCategories !== 'NULL') {
            keywordCategories.push({
                id: keyword.KeywordCategoryIDs,
                label: keyword.KeywordCategories,
                formattedName: formattedName(keywordCategories)
            });
        }
    });
    keywordCategories.sort((a, b) => a.ID - b.ID);


    let idTransitiedomeinCategories = 1;
    data.transitiedomeinen.forEach(transitiedomein => {
        const exists = transitiedomeinCategories.some(t => t.label === transitiedomein.KeywordCategories);
        if (!exists && transitiedomein.KeywordCategories !== 'NULL') {
            transitiedomeinCategories.push({
                id: idTransitiedomeinCategories,
                label: transitiedomein.KeywordCategories,
                formattedName: formattedName(transitiedomein.KeywordCategories)
            });

            idTransitiedomeinCategories++;
        }
    });

    let idTransitiedomeinen = 1;
    data.transitiedomeinen.forEach(transitiedomein => {
        const exists = transitiedomeinen.some(t => t.label === transitiedomein.KeywordLabel);
        if (!exists && transitiedomein.KeywordLabel !== 'NULL') {
            transitiedomeinen.push({
                id: idTransitiedomeinen,
                label: transitiedomein.KeywordLabel,
                formattedName: formattedName(transitiedomein.KeywordLabel),
                transitiedomeinCategoryID: transitiedomeinCategories.find(tc => tc.label === transitiedomein.KeywordCategories).id
            });
            idTransitiedomeinen++;
        }
    });

    let idOnderzoeksgroepen = 1;
    data.globaal.forEach(item => {
        const exists = onderzoeksgroepen.some(o => o.label === item.ResearchGroup);
        if (!exists && item.ResearchGroup !== 'NULL') {
            onderzoeksgroepen.push({
                id: idOnderzoeksgroepen,
                label: item.ResearchGroup,
                formattedName: formattedName(item.ResearchGroup)
            });
            idOnderzoeksgroepen++;
        }
    });

    let idClusters = 1;
    data.globaal.forEach(item => {
        const exists = clusters.some(c => c.label === item.Cluster);
        if (!exists && item.Cluster !== 'NULL' && item.Cluster !== '#N/B') {
            clusters.push({
                id: idClusters,
                label: item.Cluster,
                formattedName: formattedName(item.Cluster),
            });
            idClusters++;
        }
    });

    let idProjectTypes = 1;
    data.globaal.forEach(item => {
        const exists = projectTypes.some(p => p.label === item.ProjectTypeLabel);
        if (!exists && item.ProjectType !== 'NULL') {
            projectTypes.push({
                id: idProjectTypes,
                label: item.ProjectTypeLabel,
                formattedName: formattedName(item.ProjectTypeLabel),
            });
            idProjectTypes++;
        }
    });

    //create project table
    data.abstracts.forEach(project => {
        const globaalEntry = data.globaal.find(g => g.ID === project.ID);
        const keywordsEntry = data.keywords.filter(k => k.ProjectID === project.ID);
        const transitiedomeinenEntry = data.transitiedomeinen.filter(t => t.ProjectID === project.ID);

        projects.push({
            id: project.ID,
            projectTypeLabel: projectTypes.find(pt => pt.label === project.ProjectTypeLabel)?.Id || null,
            researchGroupId: globaalEntry ? onderzoeksgroepen.find(o => o.label === globaalEntry.ResearchGroup)?.id || null : null,
            clusterId: globaalEntry ? clusters.find(c => c.label === globaalEntry.Cluster)?.id || null : null,
            keywords: keywordsEntry ? [...new Set(keywordsEntry.map(k => keywords.find(kw => kw.label === k.KeywordLabel)?.id).filter(id => id !== undefined))] : [],
            transitiedomeinen: transitiedomeinenEntry ? [...new Set(transitiedomeinenEntry.map(t => transitiedomeinen.find(td => td.label === t.KeywordLabel)?.id).filter(id => id !== undefined))] : [],
            cossierManagerFullName: project.DossierManagerFullName,
            CCODE: project.CCODE,
            UCODE: project.UCODE,
            CDESC: project.CDESC,
            UDESC: project.UDESC,
            analyticalCode: project.AnalyticalCode,
            mainFundingLabel: project.MainFundingLabel,
            mainFundingSourceLabel: project.MainFundingSourceLabel,
            mainFundingChannelLabel: project.MainFundingChannelLabel,
            mainFundingCallLabel: project.MainFundingCallLabel,
            mainFundingExternalFundingID: project.MainFundingExternalFundingID,
            startDate: project.StartDate,
            endDate: project.EndDate,
            flowPhaseLabel: project.FlowPhaseLabel,
            approvedByManagementTimestamp: project.ApprovedByManagementTimestamp,
            isVisibleOnWebsite: project.IsVisibleOnWebsite,
            abstract: project.Abstract,
            teaserAbstractForWebsite: project.TeaserAbstractForWebsite,
            problemStatement: project.ProblemStatement,
            problemStatementHowest: project.ProblemStatementHowest,
            addedValue: project.AddedValue,
            addedValueOutcome: project.AddedValueOutcome,
            pictureCommunication: project.PictureCommunication,
            pictureStructure: project.PictureStructure,
        });
    });

    const structuredData = {
        keywords,
        keywordCategories,
        transitiedomeinen,
        transitiedomeinCategories,
        onderzoeksgroepen,
        clusters,
        projectTypes,
        projects,
    };

    const outputPath = path.resolve(__dirname, '../assets/data/structured-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(structuredData, null, 2), 'utf8');

    console.log(`✓ Structured data written to ${outputPath}`);
    console.log(`  - Projects: ${projects.length}`);

    return structuredData;
}

createDB();