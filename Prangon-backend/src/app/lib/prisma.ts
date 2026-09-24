import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../../generated/prisma/client";
import { envVars } from "../config/env";

let connectionString = `${envVars.DATABASE_URL}`;
if (connectionString.includes("sslmode=require") && !connectionString.includes("uselibpqcompat=")) {
    connectionString += connectionString.includes("?") ? "&uselibpqcompat=true" : "?uselibpqcompat=true";
}

const pool = new pg.Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.on("error", (err) => {
    console.warn("[PG Pool] Handled idle client error:", err.message);
});

const adapter = new PrismaPg(pool, {
    onPoolError: (err) => {
        console.warn("[PrismaPg] Handled pool error:", err.message);
    },
    onConnectionError: (err) => {
        console.warn("[PrismaPg] Handled connection error:", err.message);
    },
});

const basePrisma = new PrismaClient({
    adapter,
    log: [{ emit: "event", level: "query" }],
});

basePrisma.$on("query" as never, (e: any) => {
    if (e.duration > 2000) console.warn(`SLOW QUERY (${e.duration}ms): ${e.query}`);
});

const isTransientError = (err: any) => {
    const msg = String(err?.message || "").toLowerCase();
    const causeMsg = String(err?.cause?.message || "").toLowerCase();
    const full = `${msg} ${causeMsg}`;
    return (
        full.includes("connection terminated") ||
        full.includes("connection timeout") ||
        full.includes("timeout exceeded") ||
        full.includes("timed out") ||
        full.includes("connection closed") ||
        full.includes("closed connection") ||
        full.includes("connection reset") ||
        full.includes("broken pipe") ||
        full.includes("econnreset") ||
        full.includes("epipe") ||
        full.includes("etimedout") ||
        full.includes("p1001") ||
        full.includes("p2024")
    );
};

export const prisma = basePrisma.$extends({
    query: {
        $allModels: {
            async $allOperations({ model, operation, args, query }) {
                const maxRetries = 2;
                let lastError: any;
                for (let attempt = 0; attempt <= maxRetries; attempt++) {
                    try {
                        return await query(args);
                    } catch (error: any) {
                        lastError = error;
                        if (attempt < maxRetries && isTransientError(error)) {
                            const delay = (attempt + 1) * 350;
                            console.warn(
                                `[Prisma] Transient connection error on ${model}.${operation} (${error.message}). Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`
                            );
                            await new Promise((resolve) => setTimeout(resolve, delay));
                            continue;
                        }
                        throw error;
                    }
                }
                throw lastError;
            },
        },
    },
});