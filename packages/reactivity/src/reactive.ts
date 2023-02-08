import { track, trigger } from './effect'

const proxyMap = new WeakMap()
// {
//   target: proxy
// }

export function reactive(target) {
  return createReactiveObject(target)
}

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export const isReactive = (value) => {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

function createReactiveObject(target) {
  const existsProxy = proxyMap.get(target)

  if (existsProxy) {
    return existsProxy
  }

  const proxy = new Proxy(target, {
    get(target, key, reactive) {
      // 是否响应式标识__v_isReactive
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true
      }

      // Reflect 可以修正 this
      const res = Reflect.get(target, key, reactive)
      // 收集依赖
      track(target, key)

      // 深度监听
      if (typeof res === 'object' && res !== null) {
        return reactive(res)
      }

      return res
    },
    set(target, key, value, reactive) {
      Reflect.set(target, key, value, reactive)
      // 触发
      trigger(target, key, value)

      return true
    }
  })

  proxyMap.set(target, proxy)

  return proxy
}

// let value = reactive({
//   name: 'tom',
//   age: 10
// })

// effect(() => {
//   console.log(value.name)
//   console.log(value.age)
// })

// value.name = 'tom++'

// value.age = 20
