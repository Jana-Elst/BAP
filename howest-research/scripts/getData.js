import data from '../assets/data/structured-data.json';

export const getAllKeywords = (keywordIDs) => {
    const keywords = data.keywords.filter(keyword => keywordIDs.includes(keyword.ID));    
    return keywords;
};

export const getKeywords = (keywordIDs) => {
    const allKeywords = getAllKeywords(keywordIDs);
    const filteredKeywords = allKeywords.filter(keyword => keyword.KeywordCategoryIDs !== 3);
    return filteredKeywords;    
}

export const getTransitionDomain = (keywords) => {
    const keywordIDs = keywords.map(keyword => keyword.ID);
    const allKeywords = getAllKeywords(keywordIDs);
    const transitionDomain = allKeywords.find(keyword => keyword.KeywordCategoryIDs === 3);
    return transitionDomain;
};