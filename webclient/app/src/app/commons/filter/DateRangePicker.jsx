import {styled} from '@mui/material/styles';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {PickersDay} from '@mui/x-date-pickers/PickersDay';
import dayjs, {Dayjs} from 'dayjs';
import 'dayjs/locale/de';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import {useContext, useEffect, useRef, useState} from 'react';
import {FilterContext} from '../FilterProvider';
import {DateTimeField} from '@mui/x-date-pickers/DateTimeField';
import DateRangeIcon from '@mui/icons-material/DateRange';
import {TextField, Typography, Button} from '@mui/material';

dayjs.extend(isBetweenPlugin);

function copyWithRandomTime(day) {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    return day.hour(hours).minute(minutes).second(seconds);
}

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

function ButtonDateField({startDate, endDate, onClick, ...params}) {
    const dateOptions = {"year": "numeric", "month": "2-digit", "day": "2-digit"};
    const startStr = startDate.toDate().toLocaleDateString(undefined, dateOptions);
    const endStr = endDate.toDate().toLocaleDateString(undefined, dateOptions);
    const displayValue = `${startStr} – ${endStr}`;

    return (
        <>
            {/* This button is the only element we want to be visible and to be interacted with */}
            <Button 
                onClick={onClick}
                startIcon={<DateRangeIcon />}
            >{displayValue}</Button>

            {/* This part is a hack to hide the actual input element while passing through it's params.
                The enclosing date picker needs this to function and position itself properly. */}
            <TextField
                {...params}
                slotProps={{
                    htmlInput: {
                        sx: {
                            display: "none"
                        },
                    }
                }}
            ></TextField>
        </>
    );
}

export default function DateRangePicker(props) {
    const {startDate, endDate, setStartDate, setEndDate} = useContext(FilterContext);
    const {additionalLogic = () => { }} = props;
    const [pickerStartDate, setPickerStartDate] = useState(null);
    const [pickerEndDate, setPickerEndDate] = useState(null);
    const [datePickerValue, setDatePickerValue] = useState(startDate);
    const [isSelecting, setIsSelecting] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        additionalLogic(startDate, endDate, false);
    }, []);

    function commitDates() {
        const rangeStart = pickerStartDate.startOf('day');
        const rangeEnd = pickerEndDate.endOf('day');
        setStartDate(rangeStart);
        setEndDate(rangeEnd);
        additionalLogic(rangeStart, rangeEnd, true);
        console.log('Committed', rangeStart.toDate().toISOString(), rangeEnd.toDate().toISOString());
    }

    function handleDateChange(newValue) {
        console.log('handleDateChange', newValue)
        const selectedDate = dayjs(newValue);

        if (!isSelecting) {
            // If no temp start date or starting a new range, store new range start
            setPickerStartDate(selectedDate);
            setPickerEndDate(null);
            setIsSelecting(true);
        } else {
            // We were selecting on the previous input change, so we're completing the range now
            let newStartDate = pickerStartDate;
            let newEndDate = selectedDate;
            
            if (newEndDate.isBefore(newStartDate)) {
                // If selected date is before start, swap them
                const temp = newEndDate;
                newEndDate = newStartDate;
                newStartDate = temp;
            }

            setPickerStartDate(newStartDate);
            setPickerEndDate(newEndDate);
            setDatePickerValue(copyWithRandomTime(newStartDate));
            setIsSelecting(false);
        }
    }

    function handleOpen() {
        setIsSelecting(false);
        setPickerStartDate(startDate);
        setPickerEndDate(endDate);
        setOpen(true);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='de'>
            <DatePicker
                value={datePickerValue}
                onChange={handleDateChange}
                open={open}
                onOpen={handleOpen}
                onClose={() => setOpen(false)}
                closeOnSelect={false}
                onAccept={commitDates}
                showDaysOutsideCurrentMonth
                displayWeekNumber
                enableAccessibleFieldDOMStructure={false}
                slots={{
                    day: Day,
                    textField: ButtonDateField,
                }}
                slotProps={{
                    day: {
                        startDate: pickerStartDate,
                        endDate: pickerEndDate,
                    },
                    textField: {
                        startDate,
                        endDate,
                        onClick: handleOpen,
                    },
                    inputAdornment: {
                        sx: {
                            display: "none"
                        }
                    }
                }}
            />
        </LocalizationProvider>
    );
}
