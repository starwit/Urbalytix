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

const VIEW_STATE = {
    longitude: 10.785000000000000,
    latitude: 52.41788232741599,
    zoom: 15,
    pitch: 60,
    bearing: 0
};


function DetectionComparison() {
    const [viewState, setViewState] = useState(VIEW_STATE);
    const {date} = useContext(FilterContext);
    const [startCompDate, setStartCompDate] = useState(date.subtract(1, 'week').startOf('week'));
    const [endCompDate, setEndCompDate] = useState(date.subtract(1, 'week').endOf('week'));
    const {t} = useTranslation();

    const {
        detectionData
    } = useDetectionCount();
    const handleObjectClasses = useObjectClasses();
    const [types, setTypes] = useState(['hexcompare', '3d']);
    const {detectioncomparisonData} = useDetectionCountDiff(startCompDate, endCompDate);
    const vehicleRoutes = useVehicleRoutes();

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
                    prefix='wastedata'
                />
            </FilterLayout>

            <CompareMapMenu
                types={types}
                handleTypes={handleTypes}
                setViewState={setViewState}
            />

            <DetectionCompareMap
                viewState={viewState}
                onViewStateChange={({viewState}) => setViewState(viewState)}
                detectionData={detectionData}
                detectioncomparisonData={detectioncomparisonData}
                vehicleRoutes={vehicleRoutes}
                showHexagons={types.includes("hexcompare")}
                showCoverage={types.includes("coverage")}
            />
        </>
    );
}

export default DetectionComparison;