import {
    FormControl
} from '@mui/material';

import DateRangePicker from './DateRangePicker';

function DateTimeFilter() {
    return (
        <FormControl fullWidth size="small">
            <DateRangePicker />
        </FormControl>
    );
}

export default DateTimeFilter;