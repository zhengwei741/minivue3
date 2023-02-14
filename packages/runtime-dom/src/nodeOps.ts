// 浏览器 操作dom api
export const nodeOps = {
  insert: (child, parent) => {
    parent.insertBefore(child, null)
  },
  remove: (child) => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },
  patchProp: () => {},
  createElement: (tag) => document.createElement(tag),
  createText: (text) => document.createTextNode(text),
  createComment: (text) => document.createComment(text),
  setText: (node, text) => (node.nodeValue = text),
  setElementText: (el, text) => (el.textContent = text),
  parentNode: (node) => node.parentNode as Element | null,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => document.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, '')
  },
  insertStaticContent: () => {}
}
