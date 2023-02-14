export { reactive, isReactive } from './reactive'
export { ref, isRef } from './ref'
export { effect, ReactiveEffect } from './effect'
export { computed } from './computed'

// import { reactive } from './reactive'
// import { ref } from './ref'
// import { effect } from './effect'
// import { computed } from './computed'

// const num = ref(0)

// const man = reactive({ name: 'tom', age: 18 })

// effect(() => {
//   console.log(num.value)
//   // console.log(man.name)
//   console.log('effect')
// })

// num.value++
// man.name = 'jack'

// const com = computed(() => {
//   return num.value + 100
// })

// num.value++

// console.log(com.value)
