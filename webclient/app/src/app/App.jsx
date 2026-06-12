import React from "react";
import MainContentRouter from "./MainContentRouter";
import {CssBaseline} from "@mui/material";
import ErrorHandler from "./commons/errorHandler/ErrorHandler";
import {AuthProvider} from "./security/AuthContext";

function App() {
    return (
        <React.Fragment>
            <ErrorHandler>
                <CssBaseline />
                <AuthProvider>
                    <MainContentRouter />
                </AuthProvider>
            </ErrorHandler>
        </React.Fragment>
    );
}

export default App;
