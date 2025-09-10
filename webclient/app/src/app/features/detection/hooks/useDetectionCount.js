import {useState, useEffect, useMemo} from "react";
import DetectionCountRest from "../../../services/DetectionCountRest";
import dayjs from 'dayjs';

/**
 * Custom hook to fetch detection data with a limit.
 * @param {number} initialCount - Initial detection count limit.
 * @returns {[Array, number, Function]} [detectionData, detectionCount, setDetectionCount]
 */
export function useDetectionCount() {
    const [detectionData, setDetectionData] = useState([]);
    const [startDate, setStartDate] = useState(dayjs().startOf('week'));
    const [endDate, setEndDate] = useState(dayjs().endOf('week'));
    const detectionCountRest = useMemo(() => new DetectionCountRest(), []);

    useEffect(() => {
        detectionCountRest.findByTimeFrame(startDate.toJSON(), endDate.toJSON()).then(response => {
            if (response.data != null) {
                setDetectionData(response.data);
            }
        });
    }, [detectionCountRest, startDate, endDate]);

    return [detectionData, setStartDate, setEndDate];
}
