import { isReactive, ReactiveEffect, isRef } from '@minivue/reactivity'

export function watch(source, cb, options?) {
  return doWatch(source, cb, options)
}

function doWatch(source, cb, options) {
  let getter: () => any
  let deep
  let oldValue
  const { immediate } = options || {}

  if (isReactive(source)) {
    getter = () => source
    deep = true
  } else if (typeof source === 'function') {
    getter = source
  }

  if (deep && cb) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  const effect = new ReactiveEffect(getter, () => {
    if (typeof cb === 'function') {
      let newValue = effect.run()
      cb(oldValue, newValue)
      oldValue = newValue
    }
  })

  // if (immediate) {
  //   effect.run()
  // }
  if (cb) {
    oldValue = effect.run()
  }

  return () => {
    effect.stop()
  }
}

// 递归调用
function traverse(value, seen?) {
  if (typeof value !== 'object') {
    return value
  }
  seen = seen || new Set()

  if (seen.has(value)) {
    return value
  }
  if (isRef(value)) {
    traverse(value.value, seen)
  }
  // 还有数组 map 等情况
  if (Object.prototype.toString.call(value) === '[object Object]') {
    for (const key in value) {
      traverse(value[key], seen)
    }
  }
  return value
}

// const tom = reactive({ name: 'tom' })

// watch(tom, (newValue, oldValue) => {}, {})
