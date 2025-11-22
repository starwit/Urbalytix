import {Container} from "@mui/material";
import CustomAppBar from "./CustomAppBar";
import CustomFooter from "./CustomFooter";
import {FilterProvider} from "./FilterProvider";

function Layout({children}) {

    return (
        <>
            <CustomAppBar />
            <Container sx={{paddingTop: "5em", paddingBottom: "4em"}}>
                <FilterProvider>
                    {children}
                </FilterProvider>
            </Container >
            <CustomFooter />
        </>
    );
};

export default Layout;