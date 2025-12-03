import BlurOnIcon from '@mui/icons-material/BlurOn';
import HexagonIcon from '@mui/icons-material/Hexagon';
import RouteIcon from '@mui/icons-material/Route';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import {useTranslation} from "react-i18next";
import MapMenuLayout from '../../commons/mapMenu/MapMenuLayout';
import NavigationMapMenu from '../../commons/mapMenu/NavigationMapMenu';
import StyledToggleButton from '../../commons/mapMenu/StyledToggleButton';
import {Box, Divider, ToggleButtonGroup, Tooltip} from '@mui/material';
import TocIcon from '@mui/icons-material/Toc';
import {useState} from 'react';



function DetectionMapMenu(props) {
    const {types, handleTypes, setViewState, showDataTable, showDistricts} = props;
    const {t} = useTranslation();

    return (
        <>
            <MapMenuLayout
                value={types}
                onChange={handleTypes}
            >
                <NavigationMapMenu setViewState={setViewState} />
                <Tooltip title={t('map.districts')}>
                    <Box size='small' sx={{paddingBottom: 5}}>
                        <StyledToggleButton value='districts' onClick={showDistricts} aria-label="districts">
                            <LocationCityIcon />
                        </StyledToggleButton>
                    </Box>
                </Tooltip>

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
            </MapMenuLayout>

            <Tooltip title={t('map.dataTable')}>
                <Box size='small'
                    sx={{
                        position: 'fixed',
                        right: 10,
                        bottom: 60,
                        zIndex: 1,
                        gap: 1
                    }}
                >
                    <StyledToggleButton title={t('map.showtable')} value="tableOn" aria-label="datatable" onClick={showDataTable}>
                        <TocIcon />
                    </StyledToggleButton>
                </Box>
            </Tooltip>
        </>
    );
}

export default DetectionMapMenu;