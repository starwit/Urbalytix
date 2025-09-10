import {
    FormControl,
    MenuItem,
    Select
} from '@mui/material';
import {useTranslation} from 'react-i18next';

const TIME_FILTERS = [
    {value: 1000, label: 'time.range.allTime'},
    {value: 2000, label: 'time.range.last12Hours'},
    {value: 3000, label: 'time.range.last24Hours'},
    {value: 4000, label: 'time.range.last48Hours'},
    {value: 5000, label: 'time.range.last72Hours'},
];

function DateFilter({
    timeFilter = 0,
    onTimeFilterChange = () => { },
}) {

    const {t} = useTranslation();

    return (
        <FormControl fullWidth size="small">
            <Select
                key={`time-range-${timeFilter}`}
                value={timeFilter}
                onChange={(e) => {
                    onTimeFilterChange(e.target.value);
                }}
            >
                {TIME_FILTERS.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                        {t(filter.label)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default DateFilter;