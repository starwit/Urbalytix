import React, {useState, useEffect} from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Divider,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Paper
} from '@mui/material';
import {useTranslation} from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Constants from DecisionHeatmap.jsx
const STATES = [
    {id: 'NEW', name: 'NEW'},
    {id: 'ACCEPTED', name: 'ACCEPTED'},
    {id: 'REJECTED', name: 'REJECTED'}
];

const TIME_FILTERS = [
    {value: -1, label: 'time.range.custom'},
    {value: 0, label: 'time.range.allTime'},
    {value: 1, label: 'time.range.lastHour'},
    {value: 3, label: 'time.range.last3Hours'},
    {value: 6, label: 'time.range.last6Hours'},
    {value: 12, label: 'time.range.last12Hours'},
    {value: 24, label: 'time.range.last24Hours'}
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
}) {

    const {t} = useTranslation();
    const [showFilter, setShowFilter] = useState(true);

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
                    <Paper elevation={3} sx={{p: 2}}>

                        <Typography variant="subtitle2" gutterBottom>
                            {t('wastedata.selection')}
                        </Typography>

                        <FormGroup row>
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
                        </FormGroup>

                        {/* Time filter section */}
                        <Divider sx={{marginY: 2}} />
                        <Box sx={{marginTop: 2}}>
                            <FormControl fullWidth size="small">
                                <InputLabel>{t('time.range')}</InputLabel>
                                <Select
                                    value={timeFilter}
                                    onChange={(e) => {
                                        onTimeFilterChange(e.target.value);
                                        // Clear date range if not custom filter
                                        if (e.target.value !== -1) {
                                            onStartDateChange('');
                                            onEndDateChange('');
                                        }
                                    }}
                                    label={t('time.range')}
                                >
                                    {TIME_FILTERS.map((filter) => (
                                        <MenuItem key={filter.value} value={filter.value}>
                                            {t(filter.label)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Custom date range inputs */}
                        {timeFilter === -1 && (
                            <Box sx={{mt: 2}}>
                                <TextField
                                    type="date"
                                    label={t('time.range.start')}
                                    value={startDate}
                                    onChange={(e) => onStartDateChange(e.target.value)}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{shrink: true}}
                                    sx={{mb: 1}}
                                />
                                <TextField
                                    type="date"
                                    label={t('time.range.end')}
                                    value={endDate}
                                    onChange={(e) => onEndDateChange(e.target.value)}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{shrink: true}}
                                    inputProps={{min: startDate}}
                                />
                            </Box>
                        )}

                        <Divider sx={{marginY: 2}} />
                        {/* Feature filter section */}
                        <Typography variant="subtitle2" gutterBottom>
                            {t('features.selection')}
                        </Typography>
                        <FormGroup row>
                            {features.map(({id, name}) => (
                                <FormControlLabel
                                    key={`state-label-${id}`}
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
                    </Paper>
                </Box>
            )}
        </>
    );
}

export default MapFilter;