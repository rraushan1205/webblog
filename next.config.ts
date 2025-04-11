import type { NextConfig } from "next";
const { execSync } = require("child_process");

const nextConfig: NextConfig = {
  /* other config options if any */
};

export default nextConfig;

// Ensure Prisma Client is generated during the build process
if (process.env.NEXT_PUBLIC_VERCEL_ENV) {
  execSync("npx prisma generate", { stdio: "inherit" });
}
