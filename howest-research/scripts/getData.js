import { Color } from 'three';
import data from '../assets/data/structured-data.json';

const colors = [
    {
        clusterId: 1,
        color: 'pink',
    },
    {
        clusterId: 2,
        color: 'blue',
    },
    {
        clusterId: 3,
        color: 'blue',
    },
    {
        clusterId: 4,
        color: 'blue',
    },
    {
        clusterId: 5,
        color: 'yellow',
    },
    {
        clusterId: 6,
        color: 'blue',
    },
    {
        clusterId: 7,
        color: 'pink',
    },
    {
        clusterId: 8,
        color: 'blue',
    },
    {
        clusterId: 9,
        color: 'purple',
    },
    {
        clusterId: 10,
        color: 'pink',
    },
    {
        clusterId: 11,
        color: 'green',
    },
    {
        clusterId: 12,
        color: 'blue',
    },
    {
        clusterId: 13,
        color: 'pink',
    },
    {
        clusterId: 14,
        color: 'green',
    }
]

export const getAllKeywords = (keywordIDs) => {
    const keywords = data.transitiedomeinen.filter(keyword => keywordIDs.includes(keyword.id));
    return keywords;
};

export const getKeywords = (keywordIDs) => {
    const allKeywords = getAllKeywords(keywordIDs);
    console.log('ALL KEYWORDS', allKeywords);
    const filteredKeywords = allKeywords.filter(keyword => keyword.transitiedomeinCategoryID !== 2);
    return filteredKeywords;
}

export const getTransitionDomain = (keywords) => {
    const keywordIDs = keywords.map(keyword => keyword.id);
    const allKeywords = getAllKeywords(keywordIDs);
    const transitionDomain = allKeywords.find(keyword => keyword.transitiedomeinCategoryID === 3);
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
    const projetName = project.CCODE;

    return {
        id: project.id,
        title: projetName,
        cluster: getClusterName(project.clusterId),
        transitionDomain: getTransitionDomain(project.keywords),
        keywords: getKeywords(project.keywords),
        color: getProjectColor(project.clusterId),
    }
};