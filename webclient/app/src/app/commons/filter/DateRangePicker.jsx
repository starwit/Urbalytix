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
        prop !== 'isHovered' &&
        prop !== 'isInRange' &&
        prop !== 'isRangeStart' &&
        prop !== 'isRangeEnd',
})(({theme, isSelected, isHovered, isInRange, isRangeStart, isRangeEnd}) => ({
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
    ...(isHovered && {
        backgroundColor: theme.palette.primary.light,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.primary.light,
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
    const {day, startDate, endDate, hoveredDay, ...other} = props;

    const isInRange = startDate && endDate && day.isBetween(startDate, endDate, 'day', '[]');
    const isRangeStart = startDate && day.isSame(startDate, 'day');
    const isRangeEnd = endDate && day.isSame(endDate, 'day');

    // Hover preview for range selection when only start date is selected
    const isHoveredInRange = startDate && !endDate && hoveredDay &&
        day.isBetween(startDate, hoveredDay, 'day', '[]');

    return (
        <CustomPickersDay
            {...other}
            day={day}
            sx={{px: 2.5}}
            disableMargin
            selected={false}
            isSelected={isRangeStart || isRangeEnd}
            isInRange={isInRange || isHoveredInRange}
            isRangeStart={isRangeStart}
            isRangeEnd={isRangeEnd}
            isHovered={isHoveredInRange && !isInRange}
        />
    );
}

export default function DateRangePicker(props) {
    const {startDate, endDate, setStartDate, setEndDate} = useContext(FilterContext);
    const {additionalLogic = () => { }} = props;
    const [hoveredDay, setHoveredDay] = useState(null);
    const [tempStartDate, setTempStartDate] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        additionalLogic(startDate, endDate, false);
    }, []);

    function commitDates(startDate, endDate) {
        setStartDate(startDate);
        setEndDate(endDate);
    }

    function handleDateChange(newValue) {
        const selectedDate = dayjs(newValue);

        if (!tempStartDate) {
            // If no temp start date or starting a new range, store temp start
            setTempStartDate(selectedDate.startOf('day'));
            setIsSelecting(true);
        } else {
            // If temp start exists, complete the range
            let finalStartDate, finalEndDate;

            if (selectedDate.isBefore(tempStartDate)) {
                // If selected date is before start, swap them
                finalStartDate = selectedDate.startOf('day');
                finalEndDate = tempStartDate.endOf('day');
            } else {
                finalStartDate = tempStartDate;
                finalEndDate = selectedDate.endOf('day');
            }

            commitDates(finalStartDate, finalEndDate);
            additionalLogic(finalStartDate, finalEndDate, true);

            // Close picker after range is complete
            setOpen(false);

            // Cleanup
            setTempStartDate(null);
            setIsSelecting(false);
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de'>
            <DatePicker
                value={tempStartDate || startDate || null}
                onChange={handleDateChange}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                closeOnSelect={false}
                showDaysOutsideCurrentMonth
                displayWeekNumber
                slots={{day: Day}}
                slotProps={{
                    day: (ownerState) => ({
                        startDate: tempStartDate || startDate,
                        endDate,
                        hoveredDay,
                        onPointerEnter: () => setHoveredDay(ownerState.day),
                        onPointerLeave: () => setHoveredDay(null),
                    }),
                }}
            />
        </LocalizationProvider>
    );
}
