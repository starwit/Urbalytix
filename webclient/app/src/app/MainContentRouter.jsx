import {Route, Routes} from "react-router-dom";
import Layout from "./commons/Layout";
import Vehicles from "./features/vehicle/Vehicles";
import DetectionOverview from "./features/detection/DetectionOverview";

function MainContentRouter() {
    return (
        <Routes>
            <Route path="/" element={<Layout disabled={true}><DetectionOverview /></Layout>} />
            <Route path="/status" element={<Layout disabled={true}><DetectionOverview /></Layout>} />
            <Route path="/vehicles" element={<Layout disabled={true}><Vehicles /></Layout>} />
            <Route path="/logout" component={() => {
                window.location.href = window.location.pathname + "api/user/logout";
                return null;
            }} />
        </Routes>
    );
}

export default MainContentRouter;
