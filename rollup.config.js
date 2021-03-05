import { terser } from 'rollup-plugin-terser';

const files = [{
    input: './scripts/main.js',
    output: './bench/dist/app.min.js',
}, {
    input: './scripts/tagger.js',
    output: './tools/tagger/tagger.min.js',
}];

export default files.map((file) => {
    const fileConfig = {
        input: file.input,
        output: {
            file: file.output,
            format: 'iife',
            sourcemap: false,
        },
        plugins: [
            terser(),
        ],
    };

    return fileConfig;
});
