import type {Request , Response , NextFunction} from 'express';

type AsyncFn = (
    req :Request,
    res :Response,
    next:NextFunction
) => Promise<any> 
// to declare the type of the function you need
// declare the values coming in 
// and the value returned

const asyncHandler = (fn:AsyncFn) => (
    req :Request,
    res :Response,
    next:NextFunction,
) => Promise.resolve(fn(req,res,next)).catch(next);

export default asyncHandler;