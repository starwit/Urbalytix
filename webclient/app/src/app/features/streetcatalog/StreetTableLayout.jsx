import {Box} from "@mui/material";


function StreetTableLayout(props) {
    const {children} = props;

    return (
        <Box sx={{
            position: 'fixed',
            bottom: '5%',
            left: '15%',
            zIndex: 1,
            backgroundColor: theme => theme.palette.background.paper,
            padding: 0,
            borderRadius: 1,
            width: '80%',
            maxHeight: '70vh',
            overflowY: 'auto',
            mx: "auto"
        }}>
            {children}
        </Box>
    )
}

export default StreetTableLayout;