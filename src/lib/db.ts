import { PrismaClient } from "@prisma/client";

// gunakan metode ini untuk menghindari memuat lebih dari satu instance PrismaClient di pengujian/pengembangan
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// export const db = new PrismaClient();
