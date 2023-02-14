import { ShapeFlags, isString, isFunction, isObject } from '@minivue/shared'

export function createVNode(type, children = null) {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT //
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT //
    : isFunction(type)
    ? ShapeFlags.FUNCTIONAL_COMPONENT //
    : 0

  return createBaseVNode(type, shapeFlag, children)
}

function createBaseVNode(type, shapeFlag, children = null) {
  const vnode = {
    el: null,
    // TODO
    type: Text,
    shapeFlag,
    // TODO
    children: '123'
  }
  return vnode
}

export const Text = Symbol('Text')

export function createTextVNode(text: string) {
  return createVNode(Text, text)
}
