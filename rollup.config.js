import { terser } from 'rollup-plugin-terser';

export default {
    input: './scripts.js',
    output: {
        file: './dist/app.min.js',
        format: 'iife',
        sourcemap: true,
    },
    plugins: [
        terser(),
    ],
};
