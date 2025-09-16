import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {useTranslation} from "react-i18next";

function MapFilter(props) {

    const {types, handleTypes} = props;
    const {t} = useTranslation();

    return (

        <ToggleButtonGroup size="small"
            value={types}
            onChange={handleTypes}
            aria-label="text alignment"
        >
            <ToggleButton value="heatmap" aria-label="heatmap" >
                <FormatAlignLeftIcon />
            </ToggleButton>
            <ToggleButton value="scatterplot" aria-label="scatterplot">
                <FormatAlignRightIcon />
            </ToggleButton>
            <ToggleButton value="hexagon" aria-label="hexagon">
                <FormatAlignCenterIcon />
            </ToggleButton>

        </ToggleButtonGroup>
    );
}

export default MapFilter;