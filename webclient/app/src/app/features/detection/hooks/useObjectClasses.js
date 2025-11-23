import {useCallback, useContext, useMemo} from "react";
import {FilterContext} from "../../../commons/FilterProvider";
import DetectionCountRest from "../../../services/DetectionCountRest";

export function useObjectClasses() {
    const {objectClasses, selectedObjectClasses, setSelectedObjectClasses, setObjectClasses} = useContext(FilterContext);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);

    const loadObjectClasses = useCallback((startDate, endDate, changed) => {
        // only load data initially or after startDate / endDate changes even it components are rerendered
        if (changed || !objectClasses || objectClasses.length === 0) {
            detectionCountRest.getObjectClasses(startDate.toJSON(), endDate.toJSON()).then(response => {
                const newClasses = response.data;
                const containsAll = selectedObjectClasses?.every(item => newClasses?.includes(item));
                setObjectClasses(newClasses);
                if (!containsAll || selectedObjectClasses?.length === 0)
                    setSelectedObjectClasses(newClasses);
            });
        }
    }, [objectClasses, detectionCountRest, selectedObjectClasses, setObjectClasses, setSelectedObjectClasses]);

    return {
        loadObjectClasses
    };
}