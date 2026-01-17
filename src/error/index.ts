import AppError from "./AppError.js";
import BadRequest from "./BadRequest.js";
import Conflict from "./Conflict.js";
import Forbidden from "./Forbidden.js";
import Unauthorized from "./Unauthorized.js";
import NotFound from "./NotFound.js";
import InternalError from "./InternalError.js";

const Err = {
    AppError,
    BadRequest,
    Conflict,
    Forbidden,
    Unauthorized,
    NotFound,
    InternalError
}

export default Err