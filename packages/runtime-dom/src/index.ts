import { createRenderer } from '@minivue/runtime-core'
import { nodeOps } from './nodeOps'
import { isString } from '@minivue/shared'

let renderer
// ensureRenderer延时创建render函数
// 如果只依赖依赖响应式包，会 tree - shaking掉渲染逻辑相关代码
function ensureRenderer() {
  return renderer || (renderer = createRenderer(nodeOps))
}

function normalizeContainer(
  container: Element | ShadowRoot | string
): Element | null {
  if (isString(container)) {
    const res = document.querySelector(container)
    return res
  }
  return container as any
}

export function createApp(...args) {
  const app = ensureRenderer().createApp(...args)

  const { mount } = app

  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector)
    if (!container) return
    container.innerHTML = ''

    const proxy = mount(container, false)

    return proxy
  }

  return app
}

createApp().mount('#app')
