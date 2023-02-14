import { createVNode } from './vnode'

export function createAppAPI(render) {
  // app 根组件
  return function createApp(rootComponent, rootProps = null) {
    const app = {
      mount(rootContainer) {
        // mount('#app') 容器
        let vnode = createVNode(rootComponent)
        render(vnode, rootContainer)
      },
      render() {}
    }
    return app
  }
}
