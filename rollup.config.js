import typescript from "rollup-plugin-typescript2";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: "lib/index.cjs.js",
        format: "cjs"
      },
      {
        file: "lib/index.js",
        format: "esm"
      }
    ],
    plugins: [
      del({ targets: "lib/*" }),
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: { module: "es2015" }
        }
      })
    ]
  },
  {
    input: "./out/src/index.d.ts",
    output: [{ file: "lib/index.d.ts", format: "es" }],
    plugins: [dts()]
  }
];
