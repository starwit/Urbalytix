import {styled} from '@mui/material/styles';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {PickersDay} from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import {useContext, useEffect, useState} from 'react';
import {FilterContext} from '../FilterProvider';

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

export default function DateRangePicker(props) {
    const {startDate, endDate, setStartDate, setEndDate, date, setDate} = useContext(FilterContext);
    const {additionalLogic = () => { }} = props;
    const [hoveredDay, setHoveredDay] = useState(null);

    // Note: This effect runs on mount and will execute when components are re-rendered after route changes.
    useEffect(() => {
        additionalLogic(startDate, endDate, false);
    }, [additionalLogic])

    function handleDateChange(newValue) {
        if (dayjs(date).isSame(newValue, 'week')) {
            return;
        }
        const curDate = dayjs(newValue).startOf('week');
        const curEndDate = curDate.endOf('week');

        setDate(curDate);
        setStartDate(curDate);
        setEndDate(curEndDate);
        if (additionalLogic) {
            additionalLogic(curDate, curEndDate, true);
        }

    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={date}
                onChange={handleDateChange}
                showDaysOutsideCurrentMonth
                displayWeekNumber
                slots={{day: Day}}
                slotProps={{
                    day: (ownerState) => ({
                        selectedDay: date,
                        hoveredDay,
                        onPointerEnter: () => setHoveredDay(ownerState.day),
                        onPointerLeave: () => setHoveredDay(null),
                    }),
                }}
            />
        </LocalizationProvider>
    );
}
