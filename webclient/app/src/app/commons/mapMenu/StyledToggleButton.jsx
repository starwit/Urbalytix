import {styled, ToggleButton, Tooltip} from "@mui/material";

function StyledToggleButton(props) {

    const {children, value, "aria-label": ariaLabel, title, onClick} = props;

    const StyledToggleButton = styled(ToggleButton)(({theme}) => ({
        "&.Mui-selected:hover, :hover": {
            backgroundColor: theme.palette.background.grey
        },
        "&.Mui-selected": {
            backgroundColor: theme.palette.background.green
        },
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
        border: "none",
        color: theme.palette.text.primary
    }));

    return (
        <Tooltip title={title}>
            <StyledToggleButton value={value} aria-label={ariaLabel} onClick={onClick}>
                {children}
            </StyledToggleButton>
        </Tooltip>
    );
}

export default StyledToggleButton;