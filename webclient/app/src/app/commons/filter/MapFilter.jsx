import HexagonIcon from '@mui/icons-material/Hexagon';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import RouteIcon from '@mui/icons-material/Route';
import {Box, Container, ToggleButton, ToggleButtonGroup, Tooltip, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

function MapFilter(props) {

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
                    <Tooltip title={t('map.heatmap')}>
                        <ToggleButton value="heatmap" aria-label="heatmap" >
                            <BlurOnIcon />
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip title={t('map.scatterplot')}>
                        <ToggleButton value="scatterplot" aria-label="scatterplot">
                            <ScatterPlotIcon />
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip title={t('map.hexagon')}>
                        <ToggleButton value="hexagon" aria-label="hexagon">
                            <HexagonIcon />
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip title={t('map.coverage')}>
                        <ToggleButton value="coverage" aria-label="coverage">
                            <RouteIcon />
                        </ToggleButton>
                    </Tooltip>

                </ToggleButtonGroup >
            </Box>
        </>
    );
}

export default MapFilter;