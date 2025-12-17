import data from '../assets/data/structured-data.json';
import * as utils from './utils/data-utils.js';

export const getAllKeywords = (keywordIDs) => utils.getAllKeywords(data, keywordIDs);
export const getAllTransitionDomains = () => utils.getAllTransitionDomains(data);
export const getKeywords = (keywordIDs) => utils.getKeywords(data, keywordIDs);
export const getTransitionDomain = (clusterId) => utils.getTransitionDomain(data, clusterId);
export const getClusterName = (clusterID) => utils.getClusterName(data, clusterID);
export const getProjectColor = utils.getProjectColor; // Pure
export const getDomainColor = utils.getDomainColor; // Pure
export const getEmail = utils.getEmail; // Pure
export const getYearAndMonth = utils.getYearAndMonth; // Pure
export const getResearchGroup = (researchGroupId) => utils.getResearchGroup(data, researchGroupId);
export const getProjectInfo = (projectID) => utils.getProjectInfo(data, projectID);
export const getProjectsByKeyword = (keywordID) => utils.getProjectsByKeyword(data, keywordID);
export const getProjectsByCluster = (clusterID) => utils.getProjectsByCluster(data, clusterID);
export const getFilteredProjects = (activeFilters) => utils.getFilteredProjects(data, activeFilters);