import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as utils from './utils/data-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/data/structured-data.json'), 'utf8'));

export const getAllKeywords = (keywordIDs) => utils.getAllKeywords(data, keywordIDs);
export const getAllTransitionDomains = () => utils.getAllTransitionDomains(data);
export const getKeywords = (keywordIDs) => utils.getKeywords(data, keywordIDs);
export const getTransitionDomain = (clusterId) => utils.getTransitionDomain(data, clusterId);
export const getClusterName = (clusterID) => utils.getClusterName(data, clusterID);
export const getProjectColor = utils.getProjectColor; // Pure, no data needed
export const getDomainColor = utils.getDomainColor; // Pure, no data needed
export const getEmail = utils.getEmail; // Pure, no data needed
export const getYearAndMonth = utils.getYearAndMonth; // Pure, no data needed
export const getResearchGroup = (researchGroupId) => utils.getResearchGroup(data, researchGroupId);
export const getProjectInfo = (projectID) => utils.getProjectInfo(data, projectID);
export const getProjectsByKeyword = (keywordID) => utils.getProjectsByKeyword(data, keywordID);
export const getProjectsByCluster = (clusterID) => utils.getProjectsByCluster(data, clusterID);
export const getFilteredProjects = (activeFilters) => utils.getFilteredProjects(data, activeFilters);
