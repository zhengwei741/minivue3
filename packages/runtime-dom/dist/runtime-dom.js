(() => {
  // packages/shared/src/shapeFlags.ts
  var isFunction = (val) => typeof val === "function";
  var isString = (val) => typeof val === "string";
  var isObject = (val) => val !== null && typeof val === "object";

  // packages/runtime-core/src/vnode.ts
  function createVNode(type, children = null) {
    const shapeFlag = isString(type) ? 1 /* ELEMENT */ : isObject(type) ? 4 /* STATEFUL_COMPONENT */ : isFunction(type) ? 2 /* FUNCTIONAL_COMPONENT */ : 0;
    return createBaseVNode(type, shapeFlag, children);
  }
  function createBaseVNode(type, shapeFlag, children = null) {
    const vnode = {
      el: null,
      // TODO
      type: Text,
      shapeFlag,
      // TODO
      children: "123"
    };
    return vnode;
  }
  var Text = Symbol("Text");

  // packages/runtime-core/src/apiCreateApp.ts
  function createAppAPI(render) {
    return function createApp2(rootComponent, rootProps = null) {
      const app = {
        mount(rootContainer) {
          let vnode = createVNode(rootComponent);
          render(vnode, rootContainer);
        },
        render() {
        }
      };
      return app;
    };
  }

  // packages/runtime-core/src/renderer.ts
  var NOOP = () => {
  };
  function createRenderer(options) {
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
    } = options;
    function patch(n1, n2, container) {
      if (n1 === n2) {
        return;
      }
      const { type, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container);
        default:
          console.log(1);
      }
    }
    function processText(n1, n2, container) {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateText(n2.children), container);
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    }
    function unmount() {
    }
    function render(vnode, container) {
      console.log("\u8C03\u7528patch");
      patch(container.vnode || null, vnode, container);
    }
    return {
      render,
      createApp: createAppAPI(render)
    };
  }

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    insert: (child, parent) => {
      parent.insertBefore(child, null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    patchProp: () => {
    },
    createElement: (tag) => document.createElement(tag),
    createText: (text) => document.createTextNode(text),
    createComment: (text) => document.createComment(text),
    setText: (node, text) => node.nodeValue = text,
    setElementText: (el, text) => el.textContent = text,
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => document.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    insertStaticContent: () => {
    }
  };

  // packages/runtime-dom/src/index.ts
  var renderer;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(nodeOps));
  }
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      return res;
    }
    return container;
  }
  function createApp(...args) {
    const app = ensureRenderer().createApp(...args);
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container)
        return;
      container.innerHTML = "";
      const proxy = mount(container, false);
      return proxy;
    };
    return app;
  }
  createApp().mount("#app");
})();
//# sourceMappingURL=runtime-dom.js.map
