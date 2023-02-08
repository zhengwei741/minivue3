import { ReactiveEffect, trackEffect, triggerEffect } from './effect'

class ComputedImpl {
  deps = new Set()
  effect: ReactiveEffect

  _dirty: boolean
  _value: unknown

  constructor(fn) {
    this._dirty = true
    this.effect = new ReactiveEffect(fn, () => {
      // 依赖的值一旦修改会调用这里
      if (this._dirty) {
        return
      }
      // 解锁 调用 value 会获得最新的值
      this._dirty = true
      triggerEffect(this.deps)
    })
  }

  get value() {
    trackEffect(this.deps)
    // 第一次肯定为true
    // 加锁 实现缓存
    if (this._dirty) {
      this._dirty = false
      // 执行传入fn
      // 在执行run 的时候 fn 中的响应式对象会收集到 这个effect
      // 一旦修改会触发上面的scheduler回调进行解锁
      this._value = this.effect.run()
    }
    return this._value
  }
}

export function computed(fn) {
  return createComputed(fn)
}

function createComputed(fn) {
  return new ComputedImpl(fn)
}

// const ref = ref(0)

// const cmp = computed(() => ref.value + 100)

// ref.value++

// console.log(cmp.value)
