import {useState, useEffect} from 'react';
import {Box, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, IconButton, MenuItem, Select, Stack, Typography} from '@mui/material';
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

const YEAR_FILTER = [
    {value: 2025, label: '2025'}
];

const WEEK_FILTER = Array.from({length: 52}, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`
}));

function VehicleFilter(props) {
    const {vehicleData,
        selectedVehicleData = [],
        onSelectedVehicleDataChange = () => { },
        year = 2025,
        onYearChange = () => { },
        week = 31,
        onWeekChange = () => { },
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
                    <Divider />
                    <Typography component="span">{t('vehicledata.selectweek')}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                        <FormControl fullWidth size="small">
                            <Select
                                key={`year-${year}`}
                                value={year}
                                onChange={(e) => {
                                    onYearChange(e.target.value);
                                }}
                            >
                                {YEAR_FILTER.map((filter) => (
                                    <MenuItem key={filter.value} value={filter.value}>
                                        {t(filter.label)}
                                    </MenuItem>
                                ))}
                            </Select>

                        </FormControl>
                        <FormControl fullWidth size="small" sx={{mt: 2}}>
                            <Select
                                key={`week-${week}`}
                                value={week}
                                onChange={(e) => {
                                    onWeekChange(e.target.value);
                                }}
                            >
                                {WEEK_FILTER.map((filter) => (
                                    <MenuItem key={filter.value} value={filter.value}>
                                        {t(filter.label)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Box>
            )}
        </>
    );
}

export default VehicleFilter;