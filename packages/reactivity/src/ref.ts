import { trackEffect, triggerEffect } from './effect'
import { reactive } from './reactive'

class RefImp {
  public rawValue
  public _value
  public deps = new Set()
  __v_isRef = true
  constructor(target) {
    this.rawValue = target
    this._value = target
  }

  get value() {
    trackEffect(this.deps)
    return this._value
  }

  set value(newValue) {
    if (!Object.is(this.rawValue, newValue)) {
      this._value = typeof newValue === 'object' ? reactive(newValue) : newValue
      this.rawValue = newValue
      triggerEffect(this.deps)
    }
  }
}

function createRef(target) {
  const ref = new RefImp(target)

  return ref
}

export function isRef(value) {
  return !!(value && value.__v_isRef === true)
}

export function ref(target) {
  return createRef(target)
}
