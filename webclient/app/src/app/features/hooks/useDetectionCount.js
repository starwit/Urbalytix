import {useContext, useEffect, useMemo, useState} from "react";
import {FilterContext} from "../../commons/FilterProvider";
import DetectionCountRest from "../../services/DetectionCountRest";

/**
 * Custom hook to fetch detection data based on FilterContext.
 * @returns {Array} detectionData
 */
export function useDetectionCount() {
    const {startDate, endDate, selectedObjectClasses} = useContext(FilterContext);
    const [rawDetectionData, setRawDetectionData] = useState([]);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);

    useEffect(() => {
        detectionCountRest.findByTimeFrame(startDate.toJSON(), endDate.toJSON()).then(response => {
            if (response.data != null) {
                setRawDetectionData(response.data);
            }
        });
    }, [startDate, endDate]);

    const detectionData = useMemo(() => {
        return rawDetectionData.filter(d => {
            if (selectedObjectClasses.includes(d.className)) {
                return true;
            }
            return false;
        });
    }, [selectedObjectClasses, rawDetectionData]);

    return {
        detectionData
    };
}
