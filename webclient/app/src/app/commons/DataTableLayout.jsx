import {Box} from "@mui/material";


function DataTableLayout(props) {
    const {children} = props;

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 60,
            left: '15%',
            zIndex: 1,
            backgroundColor: theme => theme.palette.background.paper,
            padding: 0,
            borderRadius: 1,
            width: '80%',
            maxHeight: '70vh',
            overflowY: 'auto',
            mx: "auto",
            boxShadow: theme => theme.shadows[4]
        }}>
            {children}
        </Box>
    )
}

export default DataTableLayout;