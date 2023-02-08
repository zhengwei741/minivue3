const { context } = require('esbuild')
const path = require('path')

const target = 'runtime-core'

context({
  // 打包入口
  entryPoints: [path.resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile: path.resolve(__dirname, `../packages/${target}/dist/${target}.js`),
  bundle: true, // 把里文件中的依赖也同时打包进来
  sourcemap: true, // 生成sourcemap，可以调试
  format: 'iife', // 打包出来的是esm模块
  platform: 'browser'
}).then((ctx) => {
  // 监听文件变化，只要发生了改动，就重新打包编译结果
  ctx.watch().then(() => {
    console.log('watching~~~')
  })
})
