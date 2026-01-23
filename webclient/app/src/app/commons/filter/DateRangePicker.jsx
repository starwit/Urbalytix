import {styled} from '@mui/material/styles';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {PickersDay} from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import {useContext, useEffect, useState} from 'react';
import {FilterContext} from '../FilterProvider';

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
        prop !== 'isSelected' &&
        prop !== 'isInRange' &&
        prop !== 'isRangeStart' &&
        prop !== 'isRangeEnd',
})(({theme, isSelected, isInRange, isRangeStart, isRangeEnd}) => ({
    borderRadius: 0,
    ...(isInRange && {
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
    ...((isSelected || isRangeStart || isRangeEnd) && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.primary.main,
        },
    }),
    ...(isRangeStart && {
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
    }),
    ...(isRangeEnd && {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
    }),
}));

function Day(props) {
    const {day, startDate, endDate, ...other} = props;

    const isInRange = startDate && endDate && day.isBetween(startDate, endDate, 'day', '[]');
    const isRangeStart = startDate && day.isSame(startDate, 'day');
    const isRangeEnd = endDate && day.isSame(endDate, 'day');

    return (
        <CustomPickersDay
            {...other}
            day={day}
            sx={{px: 2.5}}
            disableMargin
            selected={false}
            isSelected={isRangeStart || isRangeEnd}
            isInRange={isInRange}
            isRangeStart={isRangeStart}
            isRangeEnd={isRangeEnd}
        />
    );
}

export default function DateRangePicker(props) {
    const {startDate, endDate, setStartDate, setEndDate} = useContext(FilterContext);
    const {additionalLogic = () => { }} = props;
    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempEndDate, setTempEndDate] = useState(null);
    const [displayStartDate, setDisplayStartDate] = useState(null);
    const [displayEndDate, setDisplayEndDate] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        additionalLogic(startDate, endDate, false);
    }, []);

    function commitDates() {
        console.log('Committed', tempStartDate.toISOString(), tempEndDate.toISOString());
        setStartDate(tempStartDate.startOf('day'));
        setEndDate(tempEndDate.endOf('day'));
        additionalLogic(tempStartDate, tempEndDate, true);

        // Cleanup
        setTempStartDate(null);
        setTempEndDate(null);
    }

    function handleDateChange(newValue) {
        const selectedDate = dayjs(newValue);

        if (!tempStartDate) {
            // If no temp start date or starting a new range, store temp start
            setTempStartDate(selectedDate);
            setDisplayStartDate(selectedDate);
            setDisplayEndDate(null);
        } else {
            if (selectedDate.isBefore(tempStartDate)) {
                // If selected date is before start, swap them
                setTempStartDate(selectedDate);
                setDisplayStartDate(selectedDate);
                setTempEndDate(tempStartDate);
                setDisplayEndDate(tempStartDate);
            } else {
                setTempEndDate(selectedDate);
                setDisplayEndDate(selectedDate);
            }

        }
    }

    function handleOpen() {
        setDisplayStartDate(startDate);
        setDisplayEndDate(endDate);
        setOpen(true);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de'>
            <DatePicker
                value={tempStartDate || startDate || null}
                onChange={handleDateChange}
                open={open}
                onOpen={handleOpen}
                onClose={() => setOpen(false)}
                closeOnSelect={false}
                onAccept={commitDates}
                showDaysOutsideCurrentMonth
                displayWeekNumber
                slots={{day: Day}}
                slotProps={{
                    day: (ownerState) => {
                        // console.log(ownerState)
                        return {
                            startDate: displayStartDate,
                            endDate: displayEndDate,
                    }},
                }}
            />
        </LocalizationProvider>
    );
}
