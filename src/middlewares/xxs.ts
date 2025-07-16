import xss from "xss";
import { Request, Response, NextFunction } from "express";

function sanitize(obj: any): any {
  if (typeof obj === "string") return xss(obj);
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      obj[key] = sanitize(obj[key]);
    }
  }
  return obj;
}

export function xssSanitize(req: Request, res: Response, next: NextFunction) {
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
}
