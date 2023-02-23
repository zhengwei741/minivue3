import { createAppAPI } from './apiCreateApp'
import { Text } from './vnode'
import { ShapeFlags } from '@minivue/shared'
import { ReactiveEffect } from '@minivue/reactivity'

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
      // 处理文本节点
      case Text:
        processText(n1, n2, container)
      // 处理注释节点
      // case Comment:
      // 等等
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container)
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(n1, n2, container)
        }
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

  function processElement(n1, n2, container) {
    if (n1 == null) {
      mountElement(n2, container)
    } else {
      patchElement(n1, n2, container)
    }
  }

  function mountElement(vnode, container) {
    // 创建dom
    let el = hostCreateElement(vnode.type)

    // 如果是数字 还需要循环处理

    // 插入容器
    hostInsert(el, container)
  }

  function patchElement(n1, n2, container) {
    // 源码中 dynamicChildren 只进行动态节点diff
    // optimized为false 完全diff
    // patchBlockChildren(n1, n2, container) 递归对比节点
    // if (dynamicChildren) {
    //   patchBlockChildren()
    // } else if (!optimized) {
    //   patchChildren()
    // }
    patchChildren(n1, n2)
  }

  function patchChildren(n1, n2) {
    // 元素的子节点 vnode 可能会有三种情况：纯文本、vnode 数组和空
    // 那么根据排列组合对于新旧子节点来说就有九种情况
    // 如果久节点是文本节点：
    // ---------------
    // 如果新子节点也是纯文本，那么做简单地文本替换即可；
    // 如果新子节点是空，那么删除旧子节点即可；
    // 如果新子节点是 vnode 数组，那么先把旧子节点的文本清空，再去旧子节点的父容器下添加多个新子节点。
    // --------------
    // 旧子节点是空的情况：
    // 如果新子节点是纯文本，那么在旧子节点的父容器下添加新文本节点即可；
    // 如果新子节点也是空，那么什么都不需要做；
    // 如果新子节点是 vnode 数组，那么直接去旧子节点的父容器下添加多个新子节点即可。
    // --------------
    // 旧子节点是 vnode 数组的情况
    // 如果新子节点是纯文本，那么先删除旧子节点，再去旧子节点的父容器下添加新文本节点；
    // 如果新子节点是空，那么删除旧子节点即可；
    // 如果新子节点也是 vnode 数组，那么就需要做完整的 diff 新旧子节点了，这是最复杂的情况，内部运用了核心 diff 算法。
    // patchKeyedChildren
  }

  function processComponent(n1, n2, container) {
    mountComponent(n2, container)
    // updateComponent()
  }

  function mountComponent(initialVNode, container) {
    // 创建组件实例
    // createComponentInstance
    const instance = createComponentInstance()
    // 初始化 安装组件 校验 执行 setup 函数等
    // setupComponent
    // 将响应式和视图更新结合
    setupRenderEffect(instance, container)
  }

  function createComponentInstance() {
    // 组件实例
    const instance = {
      // uid: uid++,
      // vnode,
      // type,
      // parent,
      // appContext
      // ......
      isMounted: true
    }
    return instance
  }

  function setupRenderEffect(instance, container) {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        // 渲染子节点vnode
        const subTree = (instance.subTree = renderComponentRoot(instance))
        // patch
        patch(null, subTree, container)
      } else {
        // 更新

        let { next, vnode } = instance
        // next 表示新的组件 vnode

        const nextTree = renderComponentRoot(instance)

        // 缓存旧的子树 vnode
        const prevTree = instance.subTree
        // 更新子树 vnode
        instance.subTree = nextTree

        // 组件更新核心逻辑，根据新旧子树 vnode 做 patch
        patch(prevTree, nextTree, container)
        // 缓存更新后的 DOM 节点

        // next.el = nextTree.el
      }
    }
    const effect = new ReactiveEffect(componentUpdateFn)
    effect.run()
  }

  function renderComponentRoot(instance) {
    return {}
  }

  function shouldUpdateComponent(prevVNode, nextVNode) {
    // 主要检测 props、chidren、dirs、transiton 等属性来判断是否需要更新
    return true
  }

  function updateComponent(n1, n2) {
    const instance = (n2.component = n1.component)!
    if (shouldUpdateComponent(n1, n2)) {
      // 执行componentUpdateFn 进行更新
      instance.update()
    } else {
      n2.el = n1.el
      instance.vnode = n2
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
