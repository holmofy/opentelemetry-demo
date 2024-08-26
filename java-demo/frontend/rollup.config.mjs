import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/index.js',
  output: {
    dir: 'build',
    format: 'cjs'
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    terser(),
    copy({
      targets: [
        { src: 'src/*.html', dest: 'build/' }
      ]
    })
  ]
};