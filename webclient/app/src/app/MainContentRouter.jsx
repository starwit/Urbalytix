import {Route, Routes} from "react-router-dom";
import Layout from "./commons/Layout";
import LandingLayout from "./commons/LandingLayout";
import Vehicles from "./features/vehicle/Vehicles";
import LandingPage from "./features/landing/LandingPage";
import DetectionOverview from "./features/detection/DetectionOverview";
import DetectionComparison from "./features/detection/DetectionComparison";
import StreetCatalog from "./features/streetcatalog/StreetCatalog";

function MainContentRouter() {
    return (
        <Routes>
            <Route path="/" element={<LandingLayout disabled={true}><LandingPage /></LandingLayout>} />
            <Route path="/landing" element={<LandingLayout disabled={true}><LandingPage /></LandingLayout>} />
            <Route path="/status" element={<Layout disabled={true}><DetectionOverview /></Layout>} />
            <Route path="/diff" element={<Layout disabled={true}><DetectionComparison /></Layout>} />
            <Route path="/vehicles" element={<Layout disabled={true}><Vehicles /></Layout>} />
            <Route path="/streetcatalog" element={<Layout disabled={true}><StreetCatalog /></Layout>} />
            <Route path="/logout" component={() => {
                window.location.href = window.location.pathname + "api/user/logout";
                return null;
            }} />
        </Routes>
    );
}

export default MainContentRouter;
