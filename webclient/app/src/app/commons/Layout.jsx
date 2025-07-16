import {Container} from "@mui/material";
import CustomAppBar from "./CustomAppBar";
import CustomFooter from "./CustomFooter";

function Layout({children}) {

    return (
        <>
            <CustomAppBar />
            <Container sx={{paddingTop: "5em", paddingBottom: "4em"}}>
                {children}
            </Container >
            <CustomFooter />
        </>
    );
};

export default Layout;