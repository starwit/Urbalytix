import {Route, Routes} from "react-router-dom";
import Layout from "./commons/Layout";
import LandingLayout from "./commons/LandingLayout";
import Vehicles from "./features/adminarea/vehicle/Vehicles";
import LandingPage from "./features/landing/LandingPage";
import DetectionOverview from "./features/detection/DetectionOverview";
import StreetCatalog from "./features/adminarea/streetcatalog/StreetCatalog";
import DetectionComparison from "./features/comparision/DetectionComparison";
import Configuration from "./features/adminarea/config/Configuration";

function MainContentRouter() {
    return (
        <Routes>
            <Route path="/" element={<LandingLayout><LandingPage /></LandingLayout>} />
            <Route path="/landing" element={<LandingLayout><LandingPage /></LandingLayout>} />
            <Route path="/status" element={<Layout><DetectionOverview /></Layout>} />
            <Route path="/diff" element={<Layout><DetectionComparison /></Layout>} />
            <Route path="/vehicles" element={<Layout><Vehicles /></Layout>} />
            <Route path="/streetcatalog" element={<Layout><StreetCatalog /></Layout>} />
            <Route path="/configuration" element={<Layout><Configuration /></Layout>} />
            <Route path="/logout" component={() => {
                window.location.href = window.location.pathname + "api/user/logout";
                return null;
            }} />
        </Routes>
    );
}

export default MainContentRouter;
