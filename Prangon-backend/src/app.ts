/* eslint-disable @typescript-eslint/no-explicit-any */
import { fileURLToPath } from "url";
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import path from "path";
import qs from "qs";
import { envVars } from "./app/config/env";
import { auth } from "./app/lib/auth";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { IndexRoutes } from "./app/routes";
import { PaymentController } from "./app/module/payment/payment.controller";

const app: Application = express();
app.set("query parser", (str: string) => qs.parse(str));

app.set("view engine", "ejs");
// Resolve EJS templates path relative to this file so it works both
// locally (src/app.ts) and on Vercel serverless (compiled dist/app.js).
const __filename_app = fileURLToPath(import.meta.url);
const __dirname_app = path.dirname(__filename_app);
app.set("views", path.resolve(__dirname_app, "app/templates"));

// Stripe webhook — must be registered before express.json() to get raw body
app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);

const allowedOrigins = [
    envVars.FRONTEND_URL,
    envVars.BETTER_AUTH_URL,
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.all(["/api/auth", "/api/auth/*path"], toNodeHandler(auth));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", IndexRoutes);

// Health check
app.get("/", async (req: Request, res: Response) => {
    res.status(201).json({
        success: true,
        message: "API is working",
    });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
