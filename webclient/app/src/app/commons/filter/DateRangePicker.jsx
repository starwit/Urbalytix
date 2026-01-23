import {styled} from '@mui/material/styles';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {PickersDay} from '@mui/x-date-pickers/PickersDay';
import dayjs, {Dayjs} from 'dayjs';
import 'dayjs/locale/de';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import {useContext, useEffect, useState} from 'react';
import {FilterContext} from '../FilterProvider';
import {DateTimeField} from '@mui/x-date-pickers/DateTimeField';
import {TextField, Typography, Button} from '@mui/material';

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

function CustomDateField({startDate, endDate, onClick}) {

    const dateOptions = {"year": "numeric", "month": "2-digit", "day": "2-digit"};
    const startStr = startDate.toDate().toLocaleDateString(undefined, dateOptions);
    const endStr = endDate.toDate().toLocaleDateString(undefined, dateOptions);
    const displayValue = `${startStr} – ${endStr}`;

    return (
        <Button onClick={onClick}>{displayValue}</Button>
    );
}

export default function DateRangePicker(props) {
    const {startDate, endDate, setStartDate, setEndDate} = useContext(FilterContext);
    const {additionalLogic = () => { }} = props;
    const [displayStartDate, setDisplayStartDate] = useState(null);
    const [displayEndDate, setDisplayEndDate] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        additionalLogic(startDate, endDate, false);
    }, []);

    function commitDates() {
        console.log('Committed', displayStartDate.toISOString(), displayEndDate.toISOString());
        setStartDate(displayStartDate.startOf('day'));
        setEndDate(displayEndDate.endOf('day'));
        additionalLogic(displayStartDate, displayEndDate, true);
    }

    function handleDateChange(newValue) {
        const selectedDate = dayjs(newValue);

        if (!isSelecting) {
            // If no temp start date or starting a new range, store temp start
            setDisplayStartDate(selectedDate);
            setDisplayEndDate(null);
            setIsSelecting(true);
        } else {
            if (selectedDate.isBefore(displayStartDate)) {
                // If selected date is before start, swap them
                setDisplayStartDate(selectedDate);
                setDisplayEndDate(displayStartDate);
            } else {
                setDisplayEndDate(selectedDate);
            }
            setIsSelecting(false);
        }
    }

    function handleOpen() {
        setIsSelecting(false);
        setDisplayStartDate(startDate);
        setDisplayEndDate(endDate);
        setOpen(true);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de'>
            <DatePicker
                value={displayStartDate}
                onChange={handleDateChange}
                open={open}
                onOpen={handleOpen}
                onClose={() => setOpen(false)}
                closeOnSelect={false}
                onAccept={commitDates}
                showDaysOutsideCurrentMonth
                displayWeekNumber
                // enableAccessibleFieldDOMStructure={false}
                slots={{
                    day: Day,
                    // textField: CustomDateField
                }}
                slotProps={{
                    day: {
                        startDate: displayStartDate,
                        endDate: displayEndDate,
                    },
                    // textField: {
                    //     startDate,
                    //     endDate,
                    //     onClick: handleOpen,
                    // }
                }}
            />
        </LocalizationProvider>
    );
}
