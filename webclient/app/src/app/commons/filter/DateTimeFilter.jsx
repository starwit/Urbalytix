import {
    FormControl
} from '@mui/material';

import DateRangePicker from './DateRangePicker';

function DateTimeFilter(props) {
    return (
        <FormControl fullWidth size="small">
            <DateRangePicker {...props} />
        </FormControl>
    );
}

export default DateTimeFilter;