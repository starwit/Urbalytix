import {
    FormControl
} from '@mui/material';

import DateRangePicker from './DateRangePicker';

function DateTimeFilter({
    setStartDate = () => { },
    setEndDate = () => { },
    setDate = () => { }
}) {
    return (
        <FormControl fullWidth size="small">
            <DateRangePicker setEndDate={setEndDate} setStartDate={setStartDate} setDate={setDate} />
        </FormControl>
    );
}

export default DateTimeFilter;