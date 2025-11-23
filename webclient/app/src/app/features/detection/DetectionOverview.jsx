import dayjs from 'dayjs';
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
import {useDistricts} from "./hooks/useCityDistricts";
import {useVehicleData} from "./hooks/useVehicleData";
import {useVehicleRoutes} from "./hooks/useVehicleRoutes";

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

    const vehicleData = useVehicleData(2000);

    const [selectedFilterLabels, setSelectedFilterLabels] = useState([DATA_FILTERS[0].label]);
    const {
        features,
        selectedFeatureKeys,
        setSelectedFeatureKeys,
        selectedFeatures
    } = useFeatures();
    const {districts, setDistricts} = useDistricts();
    const [types, setTypes] = useState(['heatmap', 'hexagon']);

    const vehicleRoutes = useVehicleRoutes(startDate.toJSON(), endDate.toJSON());

    function handleTypes(event, newTypes) {
        if (newTypes.length) {
            setTypes(newTypes);
        }
    }

    return (
        <>
            <FilterLayout leftPosition={10}>
                <DateTimeFilter
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
                <MapFilter
                    types={types}
                    handleTypes={handleTypes}
                />
                <ObjectClassFilter
                    objectClasses={objectClasses}
                    selectedObjectClasses={selectedObjectClasses}
                    onSelectedObjectClassesChange={setSelectedObjectClasses}
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
                    onSelectedDistrictChange={setDistricts}
                />
            </FilterLayout>
            <DetectionMap
                viewState={VIEW_STATE}
                detectionData={detectionData}
                vehicleRoutes={vehicleRoutes}
                features={selectedFeatures}
                districts={districts}
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