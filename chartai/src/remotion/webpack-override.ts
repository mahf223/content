import path from "node:path";
import type { WebpackOverrideFn } from "@remotion/bundler";

/**
 * Wires the Next.js-style `@/*` path alias and `tsx/ts` resolution into
 * the Remotion webpack bundle, so server-side renders import the same
 * components the dashboard uses.
 */
export const webpackOverride: WebpackOverrideFn = (config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        "@": path.resolve(process.cwd(), "src"),
      },
      extensions: Array.from(
        new Set([
          ...(config.resolve?.extensions ?? []),
          ".ts",
          ".tsx",
          ".js",
          ".jsx",
          ".mjs",
        ])
      ),
    },
  };
};
