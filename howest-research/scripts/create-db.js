//This file is used to restructer the database of Howest Research
//It returns a new JSON file
//Run node scripts/create-db to create the file

const fs = require('fs');
const path = require('path');

const rawData = require('../assets/data/data.json');

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
        const exists = keywords.some(k => k.Label === keyword.KeywordLabel);
        if (!exists && keyword.KeywordLabel !== 'NULL' && keyword.KeywordLanguageID === 1) {
            keywords.push({
                ID: keyword.KeywordID,
                Label: keyword.KeywordLabel,
                KeywordCategoryIDs: keyword.KeywordCategoryIDs
            });
        }
    });
    keywords.sort((a, b) => a.ID - b.ID);

    data.keywords.forEach(keyword => {
        const exists = keywordCategories.some(k => k.Label === keyword.KeywordCategories);
        if (!exists && keyword.KeywordLanguageID === 1 && keyword.KeywordCategories !== 'NULL') {
            keywordCategories.push({
                ID: keyword.KeywordCategoryIDs,
                Label: keyword.KeywordCategories,
            });
        }
    });
    keywordCategories.sort((a, b) => a.ID - b.ID);


    let idTransitiedomeinCategories = 1;
    data.transitiedomeinen.forEach(transitiedomein => {
        const exists = transitiedomeinCategories.some(t => t.Label === transitiedomein.KeywordCategories);
        if (!exists && transitiedomein.KeywordCategories !== 'NULL') {
            transitiedomeinCategories.push({
                ID: idTransitiedomeinCategories,
                Label: transitiedomein.KeywordCategories,
            });

            idTransitiedomeinCategories++;
        }
    });

    let idTransitiedomeinen = 1;
    data.transitiedomeinen.forEach(transitiedomein => {
        const exists = transitiedomeinen.some(t => t.Label === transitiedomein.KeywordLabel);
        if (!exists && transitiedomein.KeywordLabel !== 'NULL') {
            transitiedomeinen.push({
                Id: idTransitiedomeinen,
                Label: transitiedomein.KeywordLabel,
                transitiedomeinCategoryID: transitiedomeinCategories.find(tc => tc.Label === transitiedomein.KeywordCategories).ID
            });
            idTransitiedomeinen++;
        }
    });

    let idOnderzoeksgroepen = 1;
    data.globaal.forEach(item => {
        const exists = onderzoeksgroepen.some(o => o.Label === item.ResearchGroup);
        if (!exists && item.ResearchGroup !== 'NULL') {
            onderzoeksgroepen.push({
                Id: idOnderzoeksgroepen,
                Label: item.ResearchGroup,
            });
            idOnderzoeksgroepen++;
        }
    });

    let idClusters = 1;
    data.globaal.forEach(item => {
        const exists = clusters.some(c => c.Label === item.Cluster);
        if (!exists && item.Cluster !== 'NULL' && item.Cluster !== '#N/B') {
            clusters.push({
                Id: idClusters,
                Label: item.Cluster,
            });
            idClusters++;
        }
    });

    let idProjectTypes = 1;
    data.globaal.forEach(item => {
        const exists = projectTypes.some(p => p.Label === item.ProjectTypeLabel);
        if (!exists && item.ProjectType !== 'NULL') {
            projectTypes.push({
                Id: idProjectTypes,
                Label: item.ProjectTypeLabel,
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
            ID: project.ID,
            ProjectTypeLabel: projectTypes.find(pt => pt.Label === project.ProjectTypeLabel)?.Id || null,
            ResearchGroupId: globaalEntry ? onderzoeksgroepen.find(o => o.Label === globaalEntry.ResearchGroup)?.Id || null : null,
            ClusterId: globaalEntry ? clusters.find(c => c.Label === globaalEntry.Cluster)?.Id || null : null,
            Keywords: keywordsEntry ? [...new Set(keywordsEntry.map(k => keywords.find(kw => kw.Label === k.KeywordLabel)?.ID).filter(id => id !== undefined))] : [],
            transitiedomeinen: transitiedomeinenEntry ? [...new Set(transitiedomeinenEntry.map(t => transitiedomeinen.find(td => td.Label === t.KeywordLabel)?.Id).filter(id => id !== undefined))] : [],
            DossierManagerFullName: project.DossierManagerFullName,
            CCODE: project.CCODE,
            UCODE: project.UCODE,
            CDESC: project.CDESC,
            UDESC: project.UDESC,
            AnalyticalCode: project.AnalyticalCode,
            MainFundingLabel: project.MainFundingLabel,
            MainFundingSourceLabel: project.MainFundingSourceLabel,
            MainFundingChannelLabel: project.MainFundingChannelLabel,
            MainFundingCallLabel: project.MainFundingCallLabel,
            MainFundingExternalFundingID: project.MainFundingExternalFundingID,
            StartDate: project.StartDate,
            EndDate: project.EndDate,
            FlowPhaseLabel: project.FlowPhaseLabel,
            ApprovedByManagementTimestamp: project.ApprovedByManagementTimestamp,
            IsVisibleOnWebsite: project.IsVisibleOnWebsite,
            Abstract: project.Abstract,
            TeaserAbstractForWebsite: project.TeaserAbstractForWebsite,
            ProblemStatement: project.ProblemStatement,
            ProblemStatementHowest: project.ProblemStatementHowest,
            AddedValue: project.AddedValue,
            AddedValueOutcome: project.AddedValueOutcome,
            PictureCommunication: project.PictureCommunication,
            PictureStructure: project.PictureStructure,
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