import CrudRest from "./CrudRest";

class LandingPageRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/landing-page");
    }
}

export default LandingPageRest;