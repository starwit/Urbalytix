import React, {useState, useEffect} from 'react';
import Accordion from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
    Paper,
    AccordionSummary
} from '@mui/material';
import {useTranslation} from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const TIME_FILTERS = [
    {value: 0, label: 'time.range.allTime'},
    {value: 12, label: 'time.range.last12Hours'},
    {value: 24, label: 'time.range.last24Hours'},
    {value: 48, label: 'time.range.last48Hours'},
    {value: 72, label: 'time.range.last72Hours'},
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
                        <Divider sx={{marginY: 2}} />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Typography variant="subtitle2" gutterBottom>
                                    {t('features.selection')}
                                </Typography>
                            </AccordionSummary>
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
                        </Accordion>
                    </Paper>
                </Box>
            )}
        </>
    );
}

export default MapFilter;