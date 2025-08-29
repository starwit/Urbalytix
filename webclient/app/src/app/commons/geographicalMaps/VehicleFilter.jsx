import {useState, useEffect} from 'react';
import {Box, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, IconButton, MenuItem, Select, Typography} from '@mui/material';
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

function VehicleFilter(props) {
    const {vehicleData,
        selectedVehicleData = [],
        onSelectedVehicleDataChange = () => { },
        timeFilter = 0,
        onTimeFilterChange = () => { },
        startDate = '',
        onStartDateChange = () => { },
        endDate = '',
        onEndDateChange = () => { },
    } = props;

    const {t} = useTranslation();
    const [showFilter, setShowFilter] = useState(true);

    return (
        <>
            <IconButton
                onClick={() => setShowFilter(!showFilter)}
                sx={{
                    position: 'fixed',
                    top: 60,
                    left: showFilter ? 510 : 250,
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
                    left: 250,
                    zIndex: 1,
                    backgroundColor: theme => theme.palette.background.paper,
                    padding: 2,
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
                    <Typography component="span">{t('vehicledata.selectvehicle')}</Typography>
                    <FormGroup aria-label={t('vehicledata.selection')}>
                        <Divider />
                        {vehicleData.map(({id, name, streamKey}) => (
                            <FormControlLabel
                                key={`vehicle-label-${streamKey}`}
                                control={
                                    <Checkbox
                                        key={`vehicle-checkbox-${streamKey}`}
                                        checked={selectedVehicleData.includes(streamKey)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                onSelectedVehicleDataChange([...selectedVehicleData, streamKey]);
                                            } else {
                                                onSelectedVehicleDataChange(selectedVehicleData.filter(s => s !== streamKey));
                                            }
                                        }}
                                        size="small"
                                    />
                                }
                                label={t(`vehicledata.${name.toLowerCase()}`)}
                            />
                        ))}
                    </FormGroup>
                </Box>
            )}
        </>
    );
}

export default VehicleFilter;