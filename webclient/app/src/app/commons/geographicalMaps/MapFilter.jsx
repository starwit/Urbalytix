import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    MenuItem,
    Select,
    Typography
} from '@mui/material';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

const TIME_FILTERS = [
    {value: 0, label: 'time.range.allTime'},
    {value: 12, label: 'time.range.last12Hours'},
    {value: 24, label: 'time.range.last24Hours'},
    {value: 48, label: 'time.range.last48Hours'},
    {value: 72, label: 'time.range.last72Hours'},
];

const VEHICLE_FILTERS = [
    {value: 0, label: 'selection.currentPosition'}
    //{value: 0, label: 'vehicle.selection.routes'}
];

function MapFilter({
    objectClasses,
    selectedObjectClasses = [],
    onSelectedObjectClassesChange = () => { },
    availableFeatures,
    selectedFeatures = [],
    onSelectedFeatureChange = () => { },
    timeFilter = 0,
    onTimeFilterChange = () => { },
    startDate = '',
    onStartDateChange = () => { },
    endDate = '',
    onEndDateChange = () => { },
    selectedVehicleData = [],
    onSelectedVehicleData = () => { },
}) {

    const {t} = useTranslation();
    const [showFilter, setShowFilter] = useState(true);
    const [selectAllFeatures, setSelectAllFeatures] = useState(true);

    const features = availableFeatures.map((item, index) => ({
        id: index + 1,   // or you could use item itself if you prefer
        name: item
    }));

    return (
        <>
            <IconButton
                onClick={() => setShowFilter(!showFilter)}
                sx={{
                    position: 'fixed',
                    top: 60,
                    left: showFilter ? 280 : 10,
                    zIndex: 1,
                    bgcolor: theme => theme.palette.background.paper
                }}
                size="small"
            >
                {showFilter ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            {showFilter && (
                <Box sx={{
                    position: 'fixed',
                    top: 60,
                    left: 10,
                    zIndex: 1,
                    backgroundColor: theme => theme.palette.background.paper,
                    padding: 0,
                    borderRadius: 1,
                    width: '250px',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}>
                    <FormControl fullWidth size="small">
                        <Select
                            key={`time-range-${timeFilter}`}
                            value={timeFilter}
                            onChange={(e) => {
                                onTimeFilterChange(e.target.value);
                                // Clear date range if not custom filter
                                if (e.target.value !== -1) {
                                    onStartDateChange('');
                                    onEndDateChange('');
                                }
                            }}
                        >
                            {TIME_FILTERS.map((filter) => (
                                <MenuItem key={filter.value} value={filter.value}>
                                    {t(filter.label)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Accordion defaultExpanded={true} disableGutters>
                        <AccordionSummary
                            sx={{
                                backgroundColor: theme => theme.palette.secondary.main,
                            }}
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography component="span">{t('wastedata.selection')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails >
                            <FormControl>
                                {Object.keys(objectClasses).map((key, idx, arr) => (
                                    <FormControlLabel
                                        key={`object-checkbox-${objectClasses[key]}`}
                                        control={
                                            <Checkbox
                                                key={`object-label-${objectClasses[key]}`}
                                                checked={selectedObjectClasses.includes(key)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        onSelectedObjectClassesChange([...selectedObjectClasses, key]);
                                                    } else {
                                                        onSelectedObjectClassesChange(selectedObjectClasses.filter(s => s !== key));
                                                    }
                                                }}
                                                size="small"
                                            />
                                        }
                                        label={key.toLowerCase()}
                                    />
                                ))}
                            </FormControl>

                        </AccordionDetails>
                    </Accordion>
                    <Accordion defaultExpanded={true} disableGutters>
                        <AccordionSummary
                            sx={{
                                backgroundColor: theme => theme.palette.secondary.main,
                            }}
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography component="span">{t('features.selection')}</Typography>

                        </AccordionSummary>
                        <AccordionDetails >
                            <FormGroup aria-label={t('features.selection')}>
                                <FormControlLabel
                                    key={`state-label-all`}
                                    control={
                                        <Checkbox
                                            checked={selectAllFeatures}
                                            size="small"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    onSelectedFeatureChange(availableFeatures);
                                                } else {
                                                    onSelectedFeatureChange([]);
                                                }
                                                setSelectAllFeatures(!selectAllFeatures);
                                            }}
                                        />}
                                    label={t('features.selection.all')}

                                />
                                <Divider />
                                {features.map(({id, name}) => (
                                    <FormControlLabel
                                        key={`feature-label-${id}`}
                                        control={
                                            <Checkbox
                                                key={`state-checkbox-${id}`}
                                                checked={selectedFeatures.includes(name)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        onSelectedFeatureChange([...selectedFeatures, name]);
                                                    } else {
                                                        onSelectedFeatureChange(selectedFeatures.filter(s => s !== name));
                                                    }
                                                }}
                                                size="small"
                                            />
                                        }
                                        label={t(`feature.${name.toLowerCase()}`)}
                                    />
                                ))}
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion defaultExpanded={true} disableGutters>
                        <AccordionSummary
                            sx={{
                                backgroundColor: theme => theme.palette.secondary.main,
                            }}
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography component="span">{t('vehicle.selection')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails >
                            <FormGroup title={t('features.selection')}>
                                {VEHICLE_FILTERS.map(({value, label}) => (
                                    <FormControlLabel
                                        key={`vehicledata-label-${value}`}
                                        control={
                                            <Checkbox
                                                key={`state-checkbox-${value}`}
                                                checked={selectedVehicleData.includes(label)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        onSelectedVehicleData([...selectedVehicleData, label]);
                                                    } else {
                                                        onSelectedVehicleData(selectedVehicleData.filter(s => s !== label));
                                                    }
                                                }}
                                                size="small"
                                            />
                                        }
                                        label={t(`vehicle.${label.toLowerCase()}`)}
                                    />
                                ))}
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                </Box>)}
        </>
    );
}

export default MapFilter;