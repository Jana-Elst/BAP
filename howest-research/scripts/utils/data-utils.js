
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

export const getAllKeywords = (data, keywordIDs) => {
    const keywords = data.keywords.filter(keyword => keywordIDs.includes(keyword.id));
    return keywords;
};

export const getAllTransitionDomains = (data) => {
    const transitionDomains = data.transitiedomeinen.filter(keyword => keyword.transitiedomeinCategoryID === 2);
    return transitionDomains;
};

export const getKeywords = (data, keywordIDs) => {
    const allKeywords = getAllKeywords(data, keywordIDs);
    const filteredKeywords = allKeywords.filter(keyword => keyword.keywordCategoryIDs !== 3);
    const keywordsUpperCase = filteredKeywords.map(keyword => ({ ...keyword, label: keyword.label.charAt(0).toUpperCase() + keyword.label.slice(1) }));
    return keywordsUpperCase;
}

export const getTransitionDomain = (data, clusterId) => {
    const transitionDomainId = colors.find(color => color.clusterId === clusterId).domainId;

    if (transitionDomainId === null) {
        return '';
    }

    const transitionDomain = data.transitiedomeinen.find(domain => domain.id === transitionDomainId);
    return transitionDomain.label;
};

export const getClusterName = (data, clusterID) => {
    const cluster = data.clusters.find(cluster => cluster.id === clusterID);

    if (cluster) {
        const clusterCopy = { ...cluster }; // Create a copy
        if (clusterCopy.label) {
            clusterCopy.label = clusterCopy.label.replace(/\s*\([^)]*\)/g, '').trim();
        }
        return clusterCopy;
    }
    return cluster;
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

export const getResearchGroup = (data, researchGroupId) => {
    const researchGroup = data.onderzoeksgroepen.find(group => group.id === researchGroupId);

    if (researchGroup) {
        return {
            ...researchGroup,
            label: researchGroup.label?.replace('Onderzoeksgroep ', '')
        };
    }
    return researchGroup;
}

export const getProjectInfo = (data, projectID) => {
    const project = data.projects.find(project => project.id === projectID);

    return {
        id: project.id,
        title: project.CCODE,
        formattedName: project.formattedName,
        cluster: getClusterName(data, project.clusterId),
        transitionDomain: getTransitionDomain(data, project.clusterId),
        keywords: getKeywords(data, project.keywords),
        color: getProjectColor(project.clusterId),
        abstract: project.teaserAbstractForWebsite,
        researchGroup: getResearchGroup(data, project.researchGroupId),
        contactPerson: project.dossierManagerFullName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        contactPersonEmail: getEmail(project.dossierManagerFullName),
        startDate: getYearAndMonth(project.startDate),
        endDate: getYearAndMonth(project.endDate),
        // images: project.pictureCommunication,
    }
};

export const getProjectsByKeyword = (data, keywordID) => {
    const projectsInfo = data.projects
        .filter(project => project.keywords.includes(keywordID))
        .map(project => {
            const projectInfo = getProjectInfo(data, project.id);
            return projectInfo;
        });
    return projectsInfo;
};

export const getProjectsByCluster = (data, clusterID) => {
    const projectsInfo = data.projects
        .filter(project => project.clusterId === clusterID)
        .map(project => {
            const projectInfo = getProjectInfo(data, project.id);
            return projectInfo;
        });
    return projectsInfo;
};

export const getFilteredProjects = (data, activeFilters) => {
    let filteredProjects = data.projects;

    const selectedTransitionDomains = activeFilters.filter(filter => filter.transitiedomeinCategoryID === 2);
    const selectedClusters = activeFilters.filter(filter => filter.transitiedomeinCategoryID !== 2);


    if (selectedTransitionDomains.length > 0) {
        const selectedTransitionDomainIDs = selectedTransitionDomains.map(transitionDomain => transitionDomain.id);

        const allowedClusterIds = colors
            .filter(colors => selectedTransitionDomainIDs.includes(colors.domainId))
            .map(colors => colors.clusterId);
        filteredProjects = filteredProjects.filter(project => {
            return allowedClusterIds.includes(project.clusterId);
        });
    }

    if (selectedClusters.length > 0) {
        const selectedClusterIDs = selectedClusters.map(cluster => cluster.id);

        filteredProjects = filteredProjects.filter(project => {
            if (!project.clusterId) return false;
            return selectedClusterIDs.includes(project.clusterId);
        });
    }

    return filteredProjects;
}
