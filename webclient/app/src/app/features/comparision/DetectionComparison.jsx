import {useContext, useEffect, useState} from "react";
import {useTranslation} from 'react-i18next';
import DateTimeFilter from "../../commons/filter/DateTimeFilter";
import FilterLayout from "../../commons/filter/FilterLayout";
import ObjectClassFilter from "../../commons/filter/ObjectClassFilter";
import {FilterContext} from '../../commons/FilterProvider';
import DetectionCompareMap from './DetectionCompareMap';
import CompareMapMenu from './CompareMapMenu';
import {useDetectionCount} from "../hooks/useDetectionCount";
import {useDetectionCountDiff} from "../hooks/useDetectionCountDiff";
import {useObjectClasses} from "../hooks/useObjectClasses";
import {useVehicleRoutes} from '../hooks/useVehicleRoutes';
import {useDistricts} from "../hooks/useCityDistricts";

function DetectionComparison() {
    const {date, showDistricts, setShowDistricts, types, setTypes} = useContext(FilterContext);
    const is3d = types.includes("3d");
    const [viewState, setViewState] = useState({
        longitude: 10.785000000000000,
        latitude: 52.41788232741599,
        zoom: 15,
        pitch: is3d ? 60 : 0,
        bearing: 0
    });

    const [startCompDate, setStartCompDate] = useState(date.subtract(1, 'week').startOf('week'));
    const [endCompDate, setEndCompDate] = useState(date.subtract(1, 'week').endOf('week'));
    const {t} = useTranslation();

    const {
        detectionData
    } = useDetectionCount();
    const handleObjectClasses = useObjectClasses();
    const {detectioncomparisonData} = useDetectionCountDiff(startCompDate, endCompDate);
    const vehicleRoutes = useVehicleRoutes();
    const {districts} = useDistricts({showDistricts});

    useEffect(() => {
        setStartCompDate(date.subtract(1, 'week').startOf('week'));
        setEndCompDate(date.subtract(1, 'week').endOf('week'));
    }, [date]);

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
                <ObjectClassFilter
                    prefix='detectiondata'
                />
            </FilterLayout>

            <CompareMapMenu
                types={types}
                handleTypes={handleTypes}
                setViewState={setViewState}
                setShowDistricts={setShowDistricts}
            />

            <DetectionCompareMap
                viewState={viewState}
                onViewStateChange={({viewState}) => setViewState(viewState)}
                detectionData={detectionData}
                detectioncomparisonData={detectioncomparisonData}
                districts={districts}
                vehicleRoutes={vehicleRoutes}
                showHexagons={types.includes("hexagon")}
                showCoverage={types.includes("coverage")}
                showDistricts={showDistricts}
            />
        </>
    );
}

export default DetectionComparison;