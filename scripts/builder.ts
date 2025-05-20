import { parseArgs } from "node:util";
import type { BuildConfig } from "bun";
import isolatedDecl from "bun-plugin-isolated-decl";

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        outdir: {
            type: "string",
            default: "./dist",
        },
        entrypoint: {
            type: "string",
            default: ["src/index.ts"],
            multiple: true,
        },
        root: {
            type: "string",
            default: "./src",
        },
        dts: {
            type: "string",
            default: "./types",
        },
    },
    strict: true,
    allowPositionals: true,
});

const option: BuildConfig = {
    entrypoints: values.entrypoint,
    outdir: values.outdir,
    target: "bun",
    format: "esm",
    sourcemap: "linked",
    naming: "[dir]/[name].[ext]",
    minify: true,
    root: values.root,
    plugins: [
        isolatedDecl({
            forceGenerate: true,
            outdir: values.dts,
        }),
    ],
};
await Bun.build(option);
