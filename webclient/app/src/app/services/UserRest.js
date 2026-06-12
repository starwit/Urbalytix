import axios from "axios";

class UserRest {
    url = window.location.pathname + "api/user";

    getCurrentUserInfo() {
        return axios.get(this.url + "/current");
    }
}

export default UserRest;