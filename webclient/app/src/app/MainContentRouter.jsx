import React from "react";
import {Route, Routes} from "react-router-dom";
{/* 
import Layout from "./commons/Layout";
import ActionTypeOverview from "./features/config/ActionTypeOverview";
import DecisionTypeOverview from "./features/config/DecisionTypeOverview";
import DecisionHeatmapView from "./features/decision/DecisionHeatmapView";
import DecisionOverview from "./features/decision/DecisionOverview";
import DecisionOverviewMap from "./features/decision/DecisionOverviewMap";
import ModuleOverview from "./features/module/ModuleOverview";
import InfoModuleOverview from "./features/info/InfoModuleOverview";
*/
}
import Layout from "./commons/Layout";
import Home from "./features/home/Home";

function MainContentRouter() {
    return (
        <Routes>
            <Route path="/" element={<Layout disabled={true}><Home /></Layout>} />
            {/* <Route path="/decision/:moduleId?" element={<Layout><DecisionOverview /></Layout>} />
            <Route path="/decision-map-view/:moduleId?" element={<LayoutSimple><DecisionOverviewMap /></LayoutSimple>} />
            <Route path="/decision-heatmap-view/:moduleId?" element={<LayoutSimple><DecisionHeatmapView /></LayoutSimple>} />
            <Route path="/action-type/:moduleId?" element={<Layout><ActionTypeOverview /></Layout>} />
            <Route path="/decision-type/:moduleId?" element={<Layout><DecisionTypeOverview /></Layout>} />
            <Route path="/info/component-breakdown" element={<LayoutSimple disabled={true}><InfoModuleOverview /></LayoutSimple>} /> */}
            <Route path="/logout" component={() => {
                window.location.href = window.location.pathname + "api/user/logout";
                return null;
            }} />
        </Routes>
    );
}

export default MainContentRouter;
