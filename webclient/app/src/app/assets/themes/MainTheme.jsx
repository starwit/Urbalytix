import React from "react";
import {ThemeProvider} from "@mui/material";
import general from "./general/ComponentTheme";

function MainTheme(props) {
    return (
        <ThemeProvider theme={general}>
            {props.children}
        </ThemeProvider>
    )
}

export default MainTheme;
