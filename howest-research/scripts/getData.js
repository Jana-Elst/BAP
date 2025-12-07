// import data from '../assets/data/structured-data.json';

import fs from 'fs';
import path, { format } from 'path';
const data = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), '../assets/data/structured-data.json'), 'utf8'));

const colors = [
    {
        clusterId: 1,
        domainId: 4,
        color: 'pink',
    },
    {
        clusterId: 2,
        domainId: null,
        color: 'blue',
    },
    {
        clusterId: 3,
        domainId: 9,
        color: 'blue',
    },
    {
        clusterId: 4,
        domainId: 9,
        color: 'blue',
    },
    {
        clusterId: 5,
        domainId: 10,
        color: 'yellow',
    },
    {
        clusterId: 6,
        domainId: 9,
        color: 'blue',
    },
    {
        clusterId: 7,
        domainId: 4,
        color: 'pink',
    },
    {
        clusterId: 8,
        domainId: 9,
        color: 'blue',
    },
    {
        clusterId: 9,
        domainId: 5,
        color: 'purple',
    },
    {
        clusterId: 10,
        domainId: 4,
        color: 'pink',
    },
    {
        clusterId: 11,
        domainId: 3,
        color: 'green',
    },
    {
        clusterId: 12,
        domainId: 9,
        color: 'blue',
    },
    {
        clusterId: 13,
        domainId: 4,
        color: 'pink',
    },
    {
        clusterId: 14,
        domainId: 3,
        color: 'green',
    }
]

const domainColors = {
    'gezond': 'pink',
    'digitaal': 'blue',
    'ecologisch': 'green',
    'sociaal': 'purple',
    'leren': 'yellow',
}

const months = [
    'Januari',
    'Februari',
    'Maart',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Augustus',
    'September',
    'Oktober',
    'November',
    'December',
]

export const getAllKeywords = (keywordIDs) => {
    const keywords = data.keywords.filter(keyword => keywordIDs.includes(keyword.id));
    return keywords;
};

export const getAllTransitionDomains = () => {
    const transitionDomains = data.transitiedomeinen.filter(keyword => keyword.transitiedomeinCategoryID === 2);
    return transitionDomains;
};

export const getKeywords = (keywordIDs) => {
    const allKeywords = getAllKeywords(keywordIDs);
    const filteredKeywords = allKeywords.filter(keyword => keyword.keywordCategoryIDs !== 3);
    const keywordsUpperCase = filteredKeywords.map(keyword => ({ ...keyword, label: keyword.label.charAt(0).toUpperCase() + keyword.label.slice(1) }));
    return keywordsUpperCase;
}

export const getTransitionDomain = (clusterId) => {
    console.log('clusterId', clusterId);
    const transitionDomainId = colors.find(color => color.clusterId === clusterId).domainId;

    if (transitionDomainId === null) {
        return '';
    }

    const transitionDomain = data.transitiedomeinen.find(domain => domain.id === transitionDomainId);
    return transitionDomain.label;
};

export const getClusterName = (clusterID) => {
    const cluster = data.clusters.find(cluster => cluster.id === clusterID);
    if (cluster && cluster.label) {
        cluster.label = cluster.label.replace(/\s*\([^)]*\)/g, '').trim();
    }
    return cluster
};

export const getProjectColor = (clusterID) => {
    const clusterColor = colors.find(color => color.clusterId === clusterID).color;
    return clusterColor;
};

export const getDomainColor = (domainName) => {
    const domainColor = domainColors[domainName];
    return domainColor;
};

export const getEmail = (name) => {
    const nameSplitted = name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('.');
    return nameSplitted + '@howest.be';
};

export const getYearAndMonth = (date) => {
    const timeSplitted = date.split(' ')[0];
    const dateSplitted = timeSplitted.split('/');

    const month = months[dateSplitted[1] - 1];
    return month + ' ' + dateSplitted[2];
}

export const getProjectInfo = (projectID) => {
    const project = data.projects.find(project => project.id === projectID);

    return {
        id: project.id,
        title: project.CCODE,
        formattedName: project.formattedName,
        cluster: getClusterName(project.clusterId),
        transitionDomain: getTransitionDomain(project.clusterId),
        keywords: getKeywords(project.keywords),
        color: getProjectColor(project.clusterId),
        abstract: project.teaserAbstractForWebsite,
        researchGroup: getResearchGroup(project.researchGroupId),
        contactPerson: project.dossierManagerFullName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        contactPersonEmail: getEmail(project.dossierManagerFullName),
        startDate: getYearAndMonth(project.startDate),
        endDate: getYearAndMonth(project.endDate),
        // images: project.pictureCommunication,
    }
};

export const getResearchGroup = (researchGroupId) => {
    const researchGroup = data.onderzoeksgroepen.find(group => group.id === researchGroupId);

    if (researchGroup) {
        return {
            ...researchGroup,
            label: researchGroup.label?.replace('Onderzoeksgroep ', '')
        };
    }
    return researchGroup;
}

export const getProjectsByKeyword = (keywordID) => {
    console.log('keywordID', keywordID);
    const projectsInfo = data.projects
        .filter(project => project.keywords.includes(keywordID))
        .map(project => {
            const projectInfo = getProjectInfo(project.id);
            console.log('projectInfo', projectInfo.title);
            return projectInfo;
        });
    return projectsInfo;
};

export const getFilteredProjects = (activeFilters) => {
    console.log('Active Filters:', activeFilters);
    let filteredProjects = data.projects;

    const selectedTransitionDomains = activeFilters.filter(filter => filter.transitiedomeinCategoryID === 2);
    const selectedClusters = activeFilters.filter(filter => filter.transitiedomeinCategoryID !== 2);


    if (selectedTransitionDomains.length > 0) {
        const selectedTransitionDomainIDs = selectedTransitionDomains.map(transitionDomain => transitionDomain.id);

        const allowedClusterIds = colors
            .filter(colors => selectedTransitionDomainIDs.includes(colors.domainId))
            .map(colors => colors.clusterId);
        console.log('Allowed Cluster IDs:', allowedClusterIds);
        filteredProjects = filteredProjects.filter(project => {
            return allowedClusterIds.includes(project.clusterId);
        });
    }

    if (selectedClusters.length > 0) {
        const selectedClusterIDs = selectedClusters.map(cluster => cluster.id);
        console.log('selectedClusterIDs:', selectedClusterIDs);

        filteredProjects = filteredProjects.filter(project => {
            if (!project.clusterId) return false;
            return selectedClusterIDs.includes(project.clusterId);
        });
    }

    return filteredProjects;
}