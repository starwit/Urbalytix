import {Checkbox, Divider, FormControlLabel, FormGroup, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {PickersDay} from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import {useState} from 'react';

import {useTranslation} from 'react-i18next';

import FilterLayout from '../filter/FilterLayout';

function VehicleFilter(props) {
    const {vehicleData,
        selectedVehicleData = [],
        onSelectedVehicleDataChange = () => { },
        selectedDate = dayjs(new Date()),
        onTimeChange = () => { }
    } = props;

    const {t} = useTranslation();
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

        <FilterLayout leftPosition={250}>
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
        </FilterLayout>

    );
}

export default VehicleFilter;