import React from "react";
import MainContentRouter from "./MainContentRouter";
import {CssBaseline} from "@mui/material";
import ErrorHandler from "./commons/errorHandler/ErrorHandler";
import {AbilityAssigner} from "./security/AbilityAssigner";

function App() {
    return (
        <React.Fragment>
            <ErrorHandler>
                <CssBaseline />
                <AbilityAssigner>
                    <MainContentRouter />
                </AbilityAssigner>
            </ErrorHandler>
        </React.Fragment>
    );
}

export default App;
