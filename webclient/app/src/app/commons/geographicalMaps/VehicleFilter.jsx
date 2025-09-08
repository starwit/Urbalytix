import {useState} from 'react';
import {Box, Checkbox, Divider, FormControlLabel, FormGroup, IconButton, Typography} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import {PickersDay} from '@mui/x-date-pickers/PickersDay';
import {styled} from '@mui/material/styles';

import {useTranslation} from 'react-i18next';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function VehicleFilter(props) {
    const {vehicleData,
        selectedVehicleData = [],
        onSelectedVehicleDataChange = () => { },
        selectedDate = dayjs(new Date()),
        onTimeChange = () => { }
    } = props;

    const {t} = useTranslation();
    const [showFilter, setShowFilter] = useState(true);
    const [hoveredDay, setHoveredDay] = useState(null);

    dayjs.extend(isBetweenPlugin);

    const CustomPickersDay = styled(PickersDay, {
        shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered',
    })(({theme, isSelected, isHovered, day}) => ({
        borderRadius: 0,
        ...(isSelected && {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover, &:focus': {
                backgroundColor: theme.palette.primary.main,
            },
        }),
        ...(isHovered && {
            backgroundColor: theme.palette.primary.light,
            '&:hover, &:focus': {
                backgroundColor: theme.palette.primary.light,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.primary.dark,
                '&:hover, &:focus': {
                    backgroundColor: theme.palette.primary.dark,
                },
            }),
        }),
        ...(day.day() === 0 && {
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%',
        }),
        ...(day.day() === 6 && {
            borderTopRightRadius: '50%',
            borderBottomRightRadius: '50%',
        }),
    }));

    const isInSameWeek = (dayA, dayB) => {
        if (dayB == null) {
            return false;
        }

        return dayA.isSame(dayB, 'week');
    };

    function Day(props) {
        const {day, selectedDay, hoveredDay, ...other} = props;

        return (
            <CustomPickersDay
                {...other}
                day={day}
                sx={{px: 2.5}}
                disableMargin
                selected={false}
                isSelected={isInSameWeek(day, selectedDay)}
                isHovered={isInSameWeek(day, hoveredDay)}
            />
        );
    }

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

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={selectedDate}
                            onChange={(newValue) => onTimeChange(newValue)}
                            showDaysOutsideCurrentMonth
                            displayWeekNumber
                            slots={{day: Day}}
                            slotProps={{
                                day: (ownerState) => ({
                                    selectedDay: selectedDate,
                                    hoveredDay,
                                    onPointerEnter: () => setHoveredDay(ownerState.day),
                                    onPointerLeave: () => setHoveredDay(null),
                                }),
                            }}
                        />
                    </LocalizationProvider>
                </Box>
            )}
        </>
    );
}

export default VehicleFilter;