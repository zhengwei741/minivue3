import { watch } from './apiWatch'
import { reactive } from '../../reactivity/src/reactive'

const tom = reactive({ name: 'tom' })

watch(
  () => tom.name,
  (newValue, oloValue) => {
    console.log(newValue, oloValue)
  }
)

tom.name = 'tom2'
