import {useEffect, useState} from "react";
import DateFilter from "../../commons/filter/DateFilter";
import DetectionMap from '../../commons/geographicalMaps/DetectionMap2';
import {useFeatures} from "./hooks/useFeatures";
import {useVehicleData} from "./hooks/useVehicleData";
import {useDetectionCount} from "./hooks/useDetectionCount";
import FilterLayout from "../../commons/filter/FilterLayout";
import FeatureFilter from "../../commons/filter/FeatureFilter";

const VIEW_STATE = {
    longitude: 10.800000000000000,
    latitude: 52.41988232741599,
    zoom: 13,
    pitch: 0,
    bearing: 0
};


function DetectionOverview() {
    const [detectionData, detectionCount, setDetectionCount] = useDetectionCount(1000);
    const vehicleData = useVehicleData(2000);
    const {
        features,
        selectedFeatureKeys,
        setSelectedFeatureKeys,
        selectedFeatures
    } = useFeatures();

    return (
        <>
            <FilterLayout leftPosition={10}>
                <DateFilter
                    timeFilter={detectionCount}
                    onTimeFilterChange={setDetectionCount}
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
            />
        </>
    );
}

export default DetectionOverview;