import dayjs from 'dayjs';
import {useState} from "react";
import DateTimeFilter from "../../commons/filter/DateTimeFilter";
import FilterLayout from "../../commons/filter/FilterLayout";
import ObjectClassFilter from "../../commons/filter/ObjectClassFilter";
import DetectionCompareMap from '../../commons/geographicalMaps/DetectionCompareMap';
import {useDetectionCount} from "./hooks/useDetectionCount";
import {useFeatures} from "./hooks/useFeatures";

const VIEW_STATE = {
    longitude: 10.785000000000000,
    latitude: 52.41788232741599,
    zoom: 15,
    pitch: 50,
    bearing: 0
};

const DATA_FILTERS = [
    {value: 0, label: 'selection.currentPosition'},
]


function DetectionOverview() {
    const [startDate, setStartDate] = useState(dayjs().startOf('week'));
    const [endDate, setEndDate] = useState(dayjs().endOf('week'));

    const {
        detectionData,
        objectClasses,
        selectedObjectClasses,
        setSelectedObjectClasses
    } = useDetectionCount(startDate, endDate);

    return (
        <>
            <FilterLayout leftPosition={10}>
                <DateTimeFilter
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
                <ObjectClassFilter
                    objectClasses={objectClasses}
                    selectedObjectClasses={selectedObjectClasses}
                    onSelectedObjectClassesChange={setSelectedObjectClasses}
                    prefix='wastedata'
                />
            </FilterLayout>
            <DetectionCompareMap
                viewState={VIEW_STATE}
                detectionData={detectionData}
                showHexagons={true}
            />
        </>
    );
}

export default DetectionOverview;