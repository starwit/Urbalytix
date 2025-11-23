import {useState} from "react";
import DataFilter from "../../commons/filter/DataFilter";
import DateTimeFilter from "../../commons/filter/DateTimeFilter";
import FeatureFilter from "../../commons/filter/FeatureFilter";
import FilterLayout from "../../commons/filter/FilterLayout";
import MapFilter from "../../commons/filter/MapFilter";
import ObjectClassFilter from "../../commons/filter/ObjectClassFilter";
import DetectionMap from '../../commons/geographicalMaps/DetectionMap';
import {useDetectionCount} from "./hooks/useDetectionCount";
import {useFeatures} from "./hooks/useFeatures";
import {useVehicleData} from "./hooks/useVehicleData";
import {useVehicleRoutes} from "./hooks/useVehicleRoutes";
import {useObjectClasses} from "./hooks/useObjectClasses";


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
    const {
        detectionData
    } = useDetectionCount();

    const vehicleData = useVehicleData(2000);

    const handleObjectClasses = useObjectClasses();

    const [selectedFilterLabels, setSelectedFilterLabels] = useState([DATA_FILTERS[0].label]);
    const {
        features,
        selectedFeatureKeys,
        setSelectedFeatureKeys,
        selectedFeatures
    } = useFeatures();
    const [types, setTypes] = useState(['heatmap', 'hexagon']);

    const vehicleRoutes = useVehicleRoutes();

    function handleTypes(event, newTypes) {
        if (newTypes.length) {
            setTypes(newTypes);
        }
    }

    return (
        <>
            <FilterLayout leftPosition={10}>
                <DateTimeFilter
                    additionalLogic={(curStartDate, curEndDate, changed) => {
                        handleObjectClasses.loadObjectClasses(curStartDate, curEndDate, changed);
                    }}
                />
                <MapFilter
                    types={types}
                    handleTypes={handleTypes}
                />
                <ObjectClassFilter
                    prefix='wastedata'
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
                vehicleRoutes={vehicleRoutes}
                features={selectedFeatures}
                positionData={vehicleData}
                showPosition={selectedFilterLabels.includes("selection.currentPosition")}
                showHeatmap={types.includes("heatmap")}
                showHexagons={types.includes("hexagon")}
                showScatterplot={types.includes("scatterplot")}
                showCoverage={types.includes("coverage")}
            />
        </>
    );
}

export default DetectionOverview;