import { AccessControl } from "accesscontrol"
const ac = new AccessControl

const roles = (function () {
    ac.grant("user")
        .readOwn("profile")
        .createOwn("profile")
        .updateOwn("profile")
        .createOwn("submit", "user")

    ac.grant("participant")
        .extend("user")

    ac.grant("comittee")
        .extend("user")
        .create("rules")
        .updateOwn("assignpart")

    ac.grant("headchief")
        .extend("user")
        .updateOwn("assigncom")

    ac.grant("admin")
        .extend("user")
        .updateAny("assign")

    return ac;
})();

export default roles