import { build } from "esbuild";
import { copyFileSync, mkdirSync } from "fs";
import { join } from "path";

console.log("Building server...");
async function buildServer() {
  try {
    // Ensure dist directory exists
    mkdirSync("dist", { recursive: true });
    mkdirSync("dist/server", { recursive: true });

    // Build server with esbuild
    await build({
      entryPoints: ["server/index.ts"],
      bundle: true,
      platform: "node",
      target: "node18",
      outfile: "dist/server/index.js",
      packages: "external",
      format: "esm",
    });

    console.log("Server build completed successfully");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildServer();
