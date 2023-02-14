import { createAppAPI } from './apiCreateApp'
import { Text } from './vnode'

const NOOP = () => {}

export function createRenderer(options) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options

  function patch(n1, n2, container) {
    if (n1 === n2) {
      return
    }

    const { type, shapeFlag } = n2
    switch (type) {
      case Text:
        processText(n1, n2, container)
      default:
        console.log(1)
    }
  }

  function processText(n1, n2, container) {
    if (n1 == null) {
      hostInsert((n2.el = hostCreateText(n2.children as string)), container)
    } else {
      const el = (n2.el = n1.el!)
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children as string)
      }
    }
  }

  function unmount() {}

  function render(vnode, container) {
    console.log('调用patch')
    patch(container.vnode || null, vnode, container)
  }

  return {
    render,
    createApp: createAppAPI(render)
  }
}
