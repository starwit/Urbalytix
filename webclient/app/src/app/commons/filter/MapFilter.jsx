import HexagonIcon from '@mui/icons-material/Hexagon';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import {Box, Container, ToggleButton, ToggleButtonGroup, Tooltip, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

function MapFilter(props) {

    const {types, handleTypes} = props;
    const {t} = useTranslation();

    return (
        <>

            <Box display="flex" justifyContent="flex-end" sx={{alignItems: 'center'}}>
                <Container>
                    <Typography >{t('map.layers')}:</Typography>
                </Container>
                <ToggleButtonGroup size="small"
                    value={types}
                    onChange={handleTypes}
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

                </ToggleButtonGroup >
            </Box>
        </>
    );
}

export default MapFilter;