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
  function createReactiveObject(target) {
    const existsProxy = proxyMap.get(target);
    if (existsProxy) {
      return existsProxy;
    }
    const proxy = new Proxy(target, {
      get(target2, key, reactive2) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
          return true;
        }
        const res = Reflect.get(target2, key, reactive2);
        track(target2, key);
        return res;
      },
      set(target2, key, value, reactive2) {
        Reflect.set(target2, key, value, reactive2);
        trigger(target2, key, value);
        return true;
      }
    });
    proxyMap.set(target, proxy);
    return proxy;
  }

  // packages/reactivity/src/ref.ts
  var RefImp = class {
    constructor(target) {
      this.deps = /* @__PURE__ */ new Set();
      this.__v_isRef = true;
      this.rawValue = target;
      this._value = target;
    }
    get value() {
      trackEffect(this.deps);
      return this._value;
    }
    set value(newValue) {
      if (!Object.is(this.rawValue, newValue)) {
        this._value = typeof newValue === "object" ? reactive(newValue) : newValue;
        this.rawValue = newValue;
        triggerEffect(this.deps);
      }
    }
  };
  function createRef(target) {
    const ref2 = new RefImp(target);
    return ref2;
  }
  function ref(target) {
    return createRef(target);
  }

  // packages/reactivity/src/computed.ts
  var ComputedImpl = class {
    constructor(fn) {
      this.deps = /* @__PURE__ */ new Set();
      this._dirty = true;
      this.effect = new ReactiveEffect(fn, () => {
        if (this._dirty) {
          return;
        }
        this._dirty = true;
        triggerEffect(this.deps);
      });
    }
    get value() {
      trackEffect(this.deps);
      if (this._dirty) {
        this._dirty = false;
        this._value = this.effect.run();
      }
      return this._value;
    }
  };
  function computed(fn) {
    return createComputed(fn);
  }
  function createComputed(fn) {
    return new ComputedImpl(fn);
  }

  // packages/reactivity/src/index.ts
  var num = ref(0);
  var com = computed(() => {
    return num.value + 100;
  });
  num.value++;
  console.log(com.value);
})();
//# sourceMappingURL=reactivity.js.map
