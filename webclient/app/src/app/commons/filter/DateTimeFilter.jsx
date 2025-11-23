import {
    FormControl
} from '@mui/material';

import DateRangePicker from './DateRangePicker';

function DateTimeFilter(props) {
    const {additionalLogic = () => { }} = props;
    return (
        <FormControl fullWidth size="small">
            <DateRangePicker additionalLogic={additionalLogic} />
        </FormControl>
    );
}

export default DateTimeFilter;