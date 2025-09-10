import {useEffect, useState} from "react";
import DateTimeFilter from "../../commons/filter/DateTimeFilter";
import FeatureFilter from "../../commons/filter/FeatureFilter";
import FilterLayout from "../../commons/filter/FilterLayout";
import DetectionMap from '../../commons/geographicalMaps/DetectionMap2';
import {useDetectionCount} from "./hooks/useDetectionCount";
import {useFeatures} from "./hooks/useFeatures";
import {useVehicleData} from "./hooks/useVehicleData";
import DataFilter from "../../commons/filter/DataFilter";

const VIEW_STATE = {
    longitude: 10.800000000000000,
    latitude: 52.41988232741599,
    zoom: 13,
    pitch: 0,
    bearing: 0
};

const DATA_FILTERS = [
    {value: 0, label: 'selection.currentPosition'},
]


function DetectionOverview() {
    const [detectionData, detectionCount, setDetectionCount] = useDetectionCount(1000);
    const vehicleData = useVehicleData(2000);
    const [selectedFilterLabels, setSelectedFilterLabels] = useState([DATA_FILTERS[0].label]);
    const {
        features,
        selectedFeatureKeys,
        setSelectedFeatureKeys,
        selectedFeatures
    } = useFeatures();



    return (
        <>
            <FilterLayout leftPosition={10}>
                <DateTimeFilter
                    timeFilter={detectionCount}
                    onTimeFilterChange={setDetectionCount}
                />
                <DataFilter
                    prefix='vehicle'
                    filters={DATA_FILTERS}
                    selectedFilterLabels={selectedFilterLabels}
                    onSelectedFilterLabels={setSelectedFilterLabels}
                />
                <FeatureFilter
                    availableFeatureKeys={Object.keys(features)}
                    selectedFeatureKeys={selectedFeatureKeys}
                    onSelectedFeatureChange={setSelectedFeatureKeys}
                />
            </FilterLayout>
            <DetectionMap
                viewState={VIEW_STATE}
                detectionData={detectionData}
                features={selectedFeatures}
                positionData={vehicleData}
                showPosition={selectedFilterLabels.includes("selection.currentPosition")}
            />
        </>
    );
}

export default DetectionOverview;