import {Route, Routes} from "react-router-dom";
import Layout from "./commons/Layout";
import Home from "./features/home/Home";

function MainContentRouter() {
    return (
        <Routes>
            <Route path="/" element={<Layout disabled={true}><Home /></Layout>} />
            <Route path="/logout" component={() => {
                window.location.href = window.location.pathname + "api/user/logout";
                return null;
            }} />
        </Routes>
    );
}

export default MainContentRouter;
