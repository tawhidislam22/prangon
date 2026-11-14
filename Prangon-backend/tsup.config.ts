import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/server.ts"],
    format: ["esm"],
    target: "esnext",
    outDir: "dist",
    clean: true,
    bundle: true,
    splitting: false,
    sourcemap: true,
    dts: false,
  },
  {
    entry: {
      index: "src/app.ts",
    },
    format: ["esm"],
    target: "esnext",
    outDir: "api",
    clean: false,
    bundle: true,
    splitting: false,
    sourcemap: true,
    dts: false,
  },
]);
