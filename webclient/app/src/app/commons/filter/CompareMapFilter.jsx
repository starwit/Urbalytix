import HexagonIcon from '@mui/icons-material/Hexagon';
import RouteIcon from '@mui/icons-material/Route';
import {Box, ToggleButton, ToggleButtonGroup, Tooltip, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

function CompareMapFilter(props) {

    const {types, handleTypes} = props;
    const {t} = useTranslation();

    return (
        <>

            <Box display="flex" justifyContent="space-between" sx={{alignItems: 'center'}}>
                <Typography sx={{mr: 1, ml: 1}} >{t('map.layers')}:</Typography>
                <ToggleButtonGroup size="small"
                    value={types}
                    onChange={handleTypes}
                    color='success'
                >
                    <Tooltip title={t('map.hexcompare')}>
                        <ToggleButton value="hexcompare" aria-label="hexcompare">
                            <HexagonIcon />
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip title={t('map.coverageweek')}>
                        <ToggleButton value="coverage" aria-label="coverage">
                            <RouteIcon />
                        </ToggleButton>
                    </Tooltip>

                </ToggleButtonGroup >
            </Box>
        </>
    );
}

export default CompareMapFilter;