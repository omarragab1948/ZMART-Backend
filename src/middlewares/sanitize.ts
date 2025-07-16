import { Request, Response, NextFunction } from "express";

function sanitize(obj: any) {
  for (const key in obj) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    }
  }
}

export function mongoSanitizeFix(
  req: Request,
  res: Response,
  next: NextFunction
) {
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
}
