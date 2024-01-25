import { build } from "esbuild";
import packages from './package.json' with { type: "json" };

const sharedConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: false,
  external: Object.keys(packages.dependencies)
};

// ESM bundle
await build({
  ...sharedConfig,
  platform: 'browser',
  format: 'esm',
  outfile: "lib/index.js",
});

// CJS bundle
await build({
  ...sharedConfig,
  platform: 'node',
  format: 'cjs',
  outfile: "lib/index.cjs.js",
});

