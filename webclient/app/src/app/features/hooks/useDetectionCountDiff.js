import {useState, useEffect, useMemo, useContext} from "react";
import DetectionCountRest from '../../services/DetectionCountRest';
import {FilterContext} from "../../commons/FilterProvider";

/**
 * Custom hook to fetch and filter detection data within a time frame.
 * @param {Date} startDate - The start date of the time frame.
 * @param {Date} endDate - The end date of the time frame.
 * @returns {{detectioncomparisonData: Array}} An object containing the filtered detection data.
 */
export function useDetectionCountDiff(startDate, endDate) {
    const {selectedObjectClasses} = useContext(FilterContext);
    const [rawDetectionData, setDetectionData] = useState([]);
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);

    useEffect(() => {
        detectionCountRest.findByTimeFrame(startDate.toJSON(), endDate.toJSON()).then(response => {
            if (response.data != null) {
                setDetectionData(response.data);
            }
        });
    }, [detectionCountRest, startDate, endDate]);

    var detectioncomparisonData = rawDetectionData.filter(d => selectedObjectClasses.includes(d.className));

    return {
        detectioncomparisonData
    };
}
