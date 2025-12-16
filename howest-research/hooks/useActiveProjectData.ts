import { useMemo, useRef } from 'react';

export const useActiveProjectData = (page: any, project: any, positionData: any) => {
    const previousProjectDataRef = useRef({ project: project, positionData: positionData });

    if ((page.page === 'detailResearch' || page.page === 'detailKeyword') && project) {
        previousProjectDataRef.current = { project: project, positionData: positionData };
    }

    const activeProjectData = useMemo(() => {
        return (page.page === 'detailKeyword' || page.page === 'detailCluster')
            ? previousProjectDataRef.current
            : { project: project, positionData: positionData };
    }, [project, page.page, positionData]);

    return activeProjectData;
};
