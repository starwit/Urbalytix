import TocIcon from '@mui/icons-material/Toc';
import {Box, Tooltip} from '@mui/material';
import {useTranslation} from "react-i18next";
import MapMenuLayout from '../../../commons/mapMenu/MapMenuLayout';
import NavigationMapMenu from '../../../commons/mapMenu/NavigationMapMenu';
import StyledToggleButton from '../../../commons/mapMenu/StyledToggleButton';



export default function VehicleMapMenu(props) {
    const {types, handleTypes, setViewState, showDataTable, setShowDistricts} = props;
    const {t} = useTranslation();

    return (
        <>
            <MapMenuLayout
                value={types}
                onChange={handleTypes}
            >
                <NavigationMapMenu setViewState={setViewState} setShowDistricts={setShowDistricts} />

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