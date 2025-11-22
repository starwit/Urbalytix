import HexagonIcon from '@mui/icons-material/Hexagon';
import {Box, Paper, Typography} from '@mui/material';
import {useContext, useEffect, useState} from "react";
import {useTranslation} from 'react-i18next';
import CompareMapFilter from '../../commons/filter/CompareMapFilter';
import DateTimeFilter from "../../commons/filter/DateTimeFilter";
import FilterLayout from "../../commons/filter/FilterLayout";
import ObjectClassFilter from "../../commons/filter/ObjectClassFilter";
import {FilterContext} from '../../commons/FilterProvider';
import DetectionCompareMap from '../../commons/geographicalMaps/DetectionCompareMap';
import {useDetectionCount} from "./hooks/useDetectionCount";
import {useDetectionCountDiff} from "./hooks/useDetectionCountDiff";
import {useVehicleRoutes} from './hooks/useVehicleRoutes';

const VIEW_STATE = {
    longitude: 10.785000000000000,
    latitude: 52.41788232741599,
    zoom: 15,
    pitch: 50,
    bearing: 0
};


function DetectionComparison() {
    const {date} = useContext(FilterContext);
    const [startCompDate, setStartCompDate] = useState(date.subtract(1, 'week').startOf('week'));
    const [endCompDate, setEndCompDate] = useState(date.subtract(1, 'week').endOf('week'));
    const {t} = useTranslation();

    const {
        detectionData
    } = useDetectionCount();

    const [types, setTypes] = useState(['hexcompare']);
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
                <DateTimeFilter />
                <CompareMapFilter
                    types={types}
                    handleTypes={handleTypes}
                />
                <ObjectClassFilter
                    prefix='wastedata'
                />
            </FilterLayout>
            <Paper sx={{
                position: 'fixed',
                top: 60,
                right: 10,
                zIndex: 1,
                padding: 1
            }}>
                <Typography variant='subtitle2'>{t('map.legend')}</Typography>
                <Box sx={{paddingTop: 1, display: 'flex', alignItems: 'center'}}>
                    <HexagonIcon color="info" /><Typography variant='caption'>{t('legend.selected')}</Typography>
                </Box>
                <Box sx={{paddingBottom: 1, display: 'flex', alignItems: 'center'}}>
                    <HexagonIcon color="disabled" /><Typography variant='caption'>{t('legend.before')}</Typography>
                </Box>
            </Paper>
            <DetectionCompareMap
                viewState={VIEW_STATE}
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