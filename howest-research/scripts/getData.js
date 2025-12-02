import { Color } from 'three';
import data from '../assets/data/structured-data.json';

const colors = [
    {
        clusterId: 1,
        domainId: 4,
        color: 'pink',
    },
    {
        clusterId: 2,
        domainId: 9,
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

export const getAllKeywords = (keywordIDs) => {
    const keywords = data.transitiedomeinen.filter(keyword => keywordIDs.includes(keyword.id));
    return keywords;
};

export const getAllTransitionDomains = () => {
    const transitionDomains = data.transitiedomeinen.filter(keyword => keyword.transitiedomeinCategoryID === 2);
    return transitionDomains;
};

export const getKeywords = (keywordIDs) => {
    const allKeywords = getAllKeywords(keywordIDs);
    const filteredKeywords = allKeywords.filter(keyword => keyword.transitiedomeinCategoryID !== 2);
    return filteredKeywords;
}

export const getTransitionDomain = (keywords) => {
    const keywordIDs = keywords.map(keyword => keyword.id);
    const allKeywords = getAllKeywords(keywordIDs);
    const transitionDomain = allKeywords.find(keyword => keyword.transitiedomeinCategoryID === 2);
    return transitionDomain;
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

export const getProjectInfo = (projectID) => {
    const project = data.projects.find(project => project.id === projectID);
    const projectName = project.CCODE;

    return {
        id: project.id,
        title: projectName,
        cluster: getClusterName(project.clusterId),
        transitionDomain: getTransitionDomain(project.keywords),
        keywords: getKeywords(project.keywords),
        color: getProjectColor(project.clusterId),
        abstract: project.teaserAbstractForWebsite,
        researchGroup: getResearchGroup(project.researchGroupId),
        contactPerson: project.dossierManagerFullName,
        startDate: project.startDate,
        endDate: project.endDate,
    }
};

export const getResearchGroup = (researchGroupId) => {
    const researchGroup = data.onderzoeksgroepen.find(group => group.id === researchGroupId);
    return researchGroup;
}

export const getProjectsByKeyword = (keywordID) => {
    const projects = data.projects.filter(project =>
        project.keywords?.includes(keywordID)
    );
    return projects;
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