import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';

const config = {
  input: 'src/index.ts',
  output: {
    esModule: true,
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true,
    inlineDynamicImports: true,
  },
  plugins: [
    json(),
    typescript({
      tsconfig: false,
      compilerOptions: {
        sourceMap: true,
      },
    }),
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
  ],
};

export default config;
