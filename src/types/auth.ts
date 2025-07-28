import { IUser } from "./users";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export interface UpdatePasswordBody {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}