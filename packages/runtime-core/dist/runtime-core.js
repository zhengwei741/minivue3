(() => {
  // packages/reactivity/src/effect.ts
  var activeEffect;
  var ReactiveEffect = class {
    constructor(fn, scheduler) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.deps = /* @__PURE__ */ new Set();
      this.active = true;
      this.fn = fn;
    }
    run() {
      activeEffect = this;
      const ret = this.fn();
      activeEffect = void 0;
      return ret;
    }
    stop() {
      if (this.active) {
        cleanupEffect(this);
        if (this.onStop) {
          this.onStop();
        }
        this.active = false;
      }
    }
  };
  function cleanupEffect(effect2) {
    effect2.deps.forEach((dep) => {
      dep.delete(effect2);
    });
    effect2.deps.length = 0;
  }

  // packages/reactivity/src/reactive.ts
  var isReactive = (value) => {
    return !!value["__v_isReactive" /* IS_REACTIVE */];
  };

  // packages/reactivity/src/ref.ts
  function isRef(value) {
    return !!(value && value.__v_isRef === true);
  }

  // packages/runtime-core/src/apiWatch.ts
  function watch(source, cb, options) {
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, options) {
    let getter;
    let deep;
    let oldValue;
    const { immediate } = options || {};
    if (isReactive(source)) {
      getter = () => source;
      deep = true;
    } else if (typeof source === "function") {
      getter = source;
    }
    if (deep && cb) {
      const baseGetter = getter;
      getter = () => traverse(baseGetter());
    }
    const effect2 = new ReactiveEffect(getter, () => {
      if (typeof cb === "function") {
        let newValue = effect2.run();
        cb(oldValue, newValue);
        oldValue = newValue;
      }
    });
    if (cb) {
      oldValue = effect2.run();
    }
    return () => {
      effect2.stop();
    };
  }
  function traverse(value, seen) {
    if (typeof value !== "object") {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Set();
    if (seen.has(value)) {
      return value;
    }
    if (isRef(value)) {
      traverse(value.value, seen);
    }
    if (Object.prototype.toString.call(value) === "[object Object]") {
      for (const key in value) {
        traverse(value[key], seen);
      }
    }
    return value;
  }

  // packages/shared/src/shapeFlags.ts
  var isFunction = (val) => typeof val === "function";
  var isString = (val) => typeof val === "string";
  var isObject = (val) => val !== null && typeof val === "object";

  // packages/runtime-core/src/vnode.ts
  function createVNode(type) {
    const shapeFlag = isString(type) ? 1 /* ELEMENT */ : isObject(type) ? 4 /* STATEFUL_COMPONENT */ : isFunction(type) ? 2 /* FUNCTIONAL_COMPONENT */ : 0;
    return createBaseVNode(type, shapeFlag);
  }
  function createBaseVNode(type, shapeFlag) {
    const vnode = {
      el: null,
      type,
      shapeFlag,
      // TODO text 类型
      children: "123"
    };
    return vnode;
  }
  var Text = Symbol("Text");

  // packages/runtime-core/src/apiCreateApp.ts
  function createAppAPI(render) {
    return function createApp(rootComponent, rootProps = null) {
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
})();
//# sourceMappingURL=runtime-core.js.map
