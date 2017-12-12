<template>
  <div>
    <group>
      <cell title="title" value="value"></cell>
    </group>
    <alert v-model="show" content="哈哈哈哈哈哈" :hide-on-blur="true"></alert>
  </div>
</template>

<script>
import { Group, Cell ,Alert} from 'vux'

export default {
  components: {
    Group,
    Cell,
    Alert
  },
  data () {
    return {
      show: true,
    }
  },
}
</script>