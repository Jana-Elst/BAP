import data from '../assets/data/structured-data.json';

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