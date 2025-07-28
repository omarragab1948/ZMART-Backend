import { User } from "../../models/user";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";
import { IUser } from "../../types/users";
import crypto from "crypto";
import { Email } from "../../utils/email";
import { AuthenticatedRequest, UpdatePasswordBody } from "../../types/auth";
import mongoose from "mongoose";
import { Customer } from "../../models/customer";

const signToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET as any, {
    expiresIn: process.env.JWT_EXPIRATION as any,
  });
};

function verifyToken(token: string, secret: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded as JwtPayload);
    });
  });
}

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user._id as string);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (process.env.JWT_COOKIE_EXPIRES_IN as any) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      new AppError("Email already in use. Please use a different one.", 400)
    );
  }
  const newUser = await Customer.create({ ...req.body });
  createSendToken(newUser, 201, res);
});

export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return next(
      new AppError("Please enter your email and password correctly", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");

  if (
    !user ||
    !(await user.correctPassword(password, user.password as string))
  ) {
    return next(
      new AppError("Incorrect email or password. Please try again.", 401)
    );
  }
  createSendToken(user, 200, res);
});
export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    next(new AppError("You are not logged in please log in", 401));
  }

  const decoded = await verifyToken(token, process.env.JWT_SECRET!);

  const freshUser = await User.findById(decoded.id as any);
  if (!freshUser) {
    return next(new AppError("User no longer exists", 401));
  }
  if (freshUser.changedpasswordAfter(decoded.iat as number)) {
    return next(new AppError("User recently changed password", 401));
  }
  (req.user as IUser) = freshUser;
  next();
});

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user && !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to access this route", 403)
      );
    }
    next();
  };
};
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email: userEmail } = req.body;
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return next(new AppError("No user found with that email", 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested a password reset for your account.\n\nPlease click on the following link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;
  const email = await new Email(user, resetUrl);
  try {
    email.send("Reset Password", message);
    res.status(200).json({
      status: "success",
      message: "Reset password link sent to your email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiration = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Faild to send email", 500));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  const { token } = req.params;
  const hashedPassword = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedPassword,
    passwordResetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Invalid token or token expired", 400));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiration = undefined;
  await user.save();
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(
  async (
    req: AuthenticatedRequest & { body: UpdatePasswordBody },
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(new AppError("User not authenticated", 401));
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const isCorrect = await user.correctPassword(
      req.body.passwordCurrent,
      user.password as string
    );

    if (!isCorrect) {
      return next(new AppError("Your current password is incorrect", 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
  }
);
