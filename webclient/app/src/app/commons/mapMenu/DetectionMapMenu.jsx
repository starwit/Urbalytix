import BlurOnIcon from '@mui/icons-material/BlurOn';
import HexagonIcon from '@mui/icons-material/Hexagon';
import RouteIcon from '@mui/icons-material/Route';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import {ToggleButtonGroup} from "@mui/material";
import {useTranslation} from "react-i18next";
import NavigationMapMenu from './NavigationMapMenu';
import StyledToggleButton from './StyledToggleButton';



function DetectionMapMenu(props) {
    const {types, handleTypes, setViewState} = props;
    const {t} = useTranslation();

    return (
        <>
            <ToggleButtonGroup size="small"
                sx={{
                    position: 'absolute',
                    right: 10,
                    top: 60,
                    zIndex: 1,
                    gap: 1
                }}
                value={types}
                orientation="vertical"
                onChange={handleTypes}
                color='success'
            >
                <NavigationMapMenu setViewState={setViewState} />

                <StyledToggleButton title={t('map.heatmap')} value="heatmap" aria-label="heatmap">
                    <BlurOnIcon />
                </StyledToggleButton>
                <StyledToggleButton title={t('map.scatterplot')} value="scatterplot" aria-label="scatterplot">
                    <ScatterPlotIcon />
                </StyledToggleButton>
                <StyledToggleButton title={t('map.hexagon')} value="hexagon" aria-label="hexagon">
                    <HexagonIcon />
                </StyledToggleButton>
                <StyledToggleButton title={t('map.coverage')} value="coverage" aria-label="coverage">
                    <RouteIcon />
                </StyledToggleButton>
            </ToggleButtonGroup >
        </>
    );
}

export default DetectionMapMenu;