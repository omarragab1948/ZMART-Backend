import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { AppError } from "./utils/appError";
import { mongoSanitizeFix } from "./middlewares/sanitize";
import { xssSanitize } from "./middlewares/xxs";
import { router as authRouters } from "./routes/auth/auth";
import { router as sellersRouters } from "./routes/dashboard/seller";
import { router as customersRouters } from "./routes/dashboard/customer";
import { router as employeesRouters } from "./routes/dashboard/employee";

import { globalErrorHandler } from "./controllers/errorController";

dotenv.config({ path: "./config.env" });
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour.",
// });
// app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(cookieParser());
app.use(mongoSanitizeFix);

app.use(xssSanitize);
app.use(
  hpp({
    whitelist: ["price"],
  })
);

const mongoURI = process.env.MONGODB_URI as string;
mongoose.connect(mongoURI).then(() => {
  console.log("MongoDB connected successfully");
});

app.use("/api/v1/auth", authRouters);
app.use("/api/v1/sellers", sellersRouters);
app.use("/api/v1/customers", customersRouters);
app.use("/api/v1/employees", employeesRouters);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

export default app;
