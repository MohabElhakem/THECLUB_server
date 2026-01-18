import {generateToken , decodeToken} from "./tokenService.js";
import { authenticateMiddleware } from "./tokenMiddle.js";
import { setTokenToCookies } from "./cookiesService.js";

const index = {
    generateToken,
    decodeToken,
    authenticateMiddleware,
    setTokenToCookies
}
export default index;