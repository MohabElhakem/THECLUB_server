import type { Request, Response } from "express";
import { Router } from "express";
import service from "./index.js";

const router = Router();

router.get("/me", (req: Request, res: Response) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ stay:false , message: "No token provided" });
    }

    try {
        const payload = service.decodeToken(token); // decode your JWT
        return res.json({ stay:true,role: payload.role, id: payload.id, number: payload.number });
    } catch (err) {
        return res.status(401).json({ stay:false, message: "Invalid or expired token", role: "VENDOR" });
    }
});

export default router;