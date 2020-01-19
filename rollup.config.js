import path from 'path'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const resolve = (file) => path.resolve(__dirname, file)
const isProduction = process.env.NODE_ENV === 'production'
const simpleClone = obj => JSON.parse(JSON.stringify(obj))
const addMinSuffix = str => str.replace(/\.js$/, '.min.js')

const tsPlugin = ts({
  tsconfig: resolve('tsconfig.json'),
  cacheRoot: resolve('node_modules/.rts2_cache'),
  tsconfigOverride: {
    compilerOptions: {
      declaration: isProduction
    }
  }
})

const defaultOutputs = ['umd', 'esm', 'cjs']

const createOutputs = (outputs) => {
  const baseOutputs = Object.values(outputs)
  return isProduction
    ? baseOutputs.concat(simpleClone(baseOutputs).map(output => {
      output.file = addMinSuffix(output.file)
      return output
    }))
    : defaultOutputs.map(output => outputs[output])
}

const outputs = {
  'esm': {
    file: resolve('dist/angel.esm.js'),
    format: 'es'
  },
  'cjs': {
    file: resolve('dist/angel.cjs.js'),
    format: 'cjs'
  },
  'umd': {
    file: resolve('dist/angel.umd.js'),
    format: 'umd',
    name: '__ANGEL__'
  }
}

module.exports = {
  input: resolve('lib/index.ts'),
  output: createOutputs(outputs),
  plugins: [
    tsPlugin,
    replace({
      __VERSION__: `${pkg.version}`
    }),
    isProduction ? terser({
      include: /\.min\.js$/
    }) : ''
  ].filter(Boolean),
  watch: {
    exclude: 'node_modules/**'
  }
}
