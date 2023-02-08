const targetMap = new WeakMap()
// {
//   depsMap: {
//     key: [dep, dep]
//   }
// }

// 当前执行的effect
let activeEffect

export class ReactiveEffect {
  deps = new Set()

  public onStop?

  public active = true

  constructor(public fn, public scheduler?) {
    this.fn = fn
  }

  run() {
    // 设置当前effect
    activeEffect = this

    // 执行fn
    // 会触发fn中的get get中收集当前activeEffect
    // 在set中触发搜集的effect
    const ret = this.fn()

    activeEffect = undefined

    return ret
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}

export function track(target, key) {
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }

  if (activeEffect) {
    trackEffect(deps)
  }
}

export function trackEffect(deps) {
  if (activeEffect && !deps.has(activeEffect)) {
    deps.add(activeEffect)
    // activeEffect.push(deps)
  }
}

export function trigger(target, key, value) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }

  let deps = depsMap.get(key) || []

  triggerEffect(deps)
}

export function triggerEffect(deps) {
  deps.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
  // for (const effect of deps) {
  //   if (effect.scheduler) {
  //     effect.scheduler()
  //   } else {
  //     effect.run()
  //   }
  // }
}
