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


function FilterLayout(props) {

    const {leftPosition = 10, children} = props;
    const {t} = useTranslation();
    const [showFilter, setShowFilter] = useState(true);

    return (
        <>
            <IconButton
                onClick={() => setShowFilter(!showFilter)}
                sx={{
                    position: 'fixed',
                    top: 60,
                    left: showFilter ? leftPosition + 280 : leftPosition,
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
                    left: leftPosition,
                    zIndex: 1,
                    backgroundColor: theme => theme.palette.background.paper,
                    padding: 0,
                    borderRadius: 1,
                    width: '250px',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}>
                    {children}
                </Box>)}
        </>
    );
}

export default FilterLayout;