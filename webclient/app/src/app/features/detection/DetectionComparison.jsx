import dayjs from 'dayjs';
import {useState} from "react";
import DateTimeFilter from "../../commons/filter/DateTimeFilter";
import FilterLayout from "../../commons/filter/FilterLayout";
import ObjectClassFilter from "../../commons/filter/ObjectClassFilter";
import DetectionCompareMap from '../../commons/geographicalMaps/DetectionCompareMap';
import {useDetectionCount} from "./hooks/useDetectionCount";
import {useDetectionCountDiff} from "./hooks/useDetectionCountDiff";
import {Typography, Box, Paper} from '@mui/material';
import HexagonIcon from '@mui/icons-material/Hexagon';
import {useTranslation} from 'react-i18next';
import {useVehicleRoutes} from './hooks/useVehicleRoutes';
import CompareMapFilter from '../../commons/filter/CompareMapFilter';

const VIEW_STATE = {
    longitude: 10.785000000000000,
    latitude: 52.41788232741599,
    zoom: 15,
    pitch: 50,
    bearing: 0
};


function DetectionComparison() {
    const [startDate, setStartDate] = useState(dayjs().startOf('week'));
    const [endDate, setEndDate] = useState(dayjs().endOf('week'));
    const [startCompDate, setStartCompDate] = useState(dayjs().subtract(1, 'week').startOf('week'));
    const [endCompDate, setEndCompDate] = useState(dayjs().subtract(1, 'week').endOf('week'));
    const {t} = useTranslation();

    const {
        detectionData,
        objectClasses,
        selectedObjectClasses,
        setSelectedObjectClasses
    } = useDetectionCount(startDate, endDate);

    const [types, setTypes] = useState(['hexcompare']);
    const {detectioncomparisonData} = useDetectionCountDiff(startCompDate, endCompDate, selectedObjectClasses);
    const vehicleRoutes = useVehicleRoutes(startDate.toJSON(), endDate.toJSON());

    function handleStartDateChange(date) {
        setStartDate(date);
        setStartCompDate(date.subtract(1, 'week').startOf('week'));
    }

    function handleEndDateChange(date) {
        setEndDate(date);
        setEndCompDate(date.subtract(1, 'week').endOf('week'));
    }

    function handleTypes(event, newTypes) {
        if (newTypes.length) {
            setTypes(newTypes);
        }
    }

    return (
        <>
            <FilterLayout leftPosition={10}>
                <DateTimeFilter
                    setStartDate={handleStartDateChange}
                    setEndDate={handleEndDateChange}
                />
                <CompareMapFilter
                    types={types}
                    handleTypes={handleTypes}
                />
                <ObjectClassFilter
                    objectClasses={objectClasses}
                    selectedObjectClasses={selectedObjectClasses}
                    onSelectedObjectClassesChange={setSelectedObjectClasses}
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