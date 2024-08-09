import { Response, Request } from "express";

export const login = (req: Request, res: Response) => {
    res.json({
        ok: true,
        msg: "Login"
    });
}