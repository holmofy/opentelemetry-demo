import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/index.js',
  output: {
    dir: 'build',
    format: 'cjs'
  },
  plugins: [nodeResolve(), terser(), copy({
    targets: [
      { src: 'src/*.html', dest: 'build/' }
    ]
  })]
};