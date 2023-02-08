(() => {
  // packages/reactivity/src/effect.ts
  var targetMap = /* @__PURE__ */ new WeakMap();
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
  function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
      dep.delete(effect);
    });
    effect.deps.length = 0;
  }
  function track(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, deps = /* @__PURE__ */ new Set());
    }
    if (activeEffect) {
      trackEffect(deps);
    }
  }
  function trackEffect(deps) {
    if (activeEffect && !deps.has(activeEffect)) {
      deps.add(activeEffect);
    }
  }
  function trigger(target, key, value) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    let deps = depsMap.get(key) || [];
    triggerEffect(deps);
  }
  function triggerEffect(deps) {
    for (const effect of deps) {
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    }
  }

  // packages/reactivity/src/reactive.ts
  var proxyMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    return createReactiveObject(target);
  }
  var isReactive = (value) => {
    return !!value["__v_isReactive" /* IS_REACTIVE */];
  };
  function createReactiveObject(target) {
    const existsProxy = proxyMap.get(target);
    if (existsProxy) {
      return existsProxy;
    }
    const proxy = new Proxy(target, {
      get(target2, key, reactive3) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
          return true;
        }
        const res = Reflect.get(target2, key, reactive3);
        track(target2, key);
        return res;
      },
      set(target2, key, value, reactive3) {
        Reflect.set(target2, key, value, reactive3);
        trigger(target2, key, value);
        return true;
      }
    });
    proxyMap.set(target, proxy);
    return proxy;
  }

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
    const { immediate } = options || {};
    if (isReactive(source)) {
      getter = () => source;
      deep = true;
    }
    if (deep && cb) {
      const baseGetter = getter;
      getter = () => traverse(baseGetter());
    }
    const effect = new ReactiveEffect(getter, () => {
      if (typeof cb === "function") {
        cb(123);
      }
    });
    if (immediate) {
      effect.run();
    }
    return () => {
      effect.stop();
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
  }

  // packages/runtime-core/src/index.ts
  var tom = reactive({ name: "tom" });
  watch(tom, (value) => {
    console.log(value);
  });
  tom.name = "tom2";
})();
//# sourceMappingURL=runtime-core.js.map
