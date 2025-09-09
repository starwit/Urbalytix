import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    Box,
    FormControl,
    IconButton,
    MenuItem,
    Select
} from '@mui/material';
import {useState} from 'react';
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
    const [showFilter, setShowFilter] = useState(true);

    return (
        <>
            <IconButton
                onClick={() => setShowFilter(!showFilter)}
                sx={{
                    position: 'fixed',
                    top: 60,
                    left: showFilter ? 280 : 10,
                    zIndex: 1,
                    bgcolor: theme => theme.palette.background.paper
                }}
                size="small"
            >
                {showFilter ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            {showFilter && (
                <Box sx={{
                    position: 'fixed',
                    top: 60,
                    left: 10,
                    zIndex: 1,
                    backgroundColor: theme => theme.palette.background.paper,
                    padding: 0,
                    borderRadius: 1,
                    width: '250px',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}>
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
                </Box>)}
        </>
    );
}

export default DateFilter;