<template>
  <div>
    <a-button type="primary" @click="rVisible = !rVisible">右侧弹窗</a-button>
    <a-button type="primary" @click="lVisible = !lVisible">左侧弹窗</a-button>
    <a-button type="primary" @click="tVisible = !tVisible">顶部弹窗</a-button>
    <a-button type="primary" @click="bVisible = !bVisible">底部弹窗</a-button>
    <a-drawer placement="right" :visible="rVisible" @close="rVisible = false">
      <h1 v-for="(item, index) in 'abcdefghijklmnopqrstuvwxyz'" :key="index">Hello</h1>
    </a-drawer>
    <a-drawer placement="left" :visible="lVisible" @close="lVisible = false">
      <h1 v-for="(item, index) in 'abcdefghijklmnopqrstuvwxyz'" :key="index">Hello</h1>
    </a-drawer>
    <a-drawer placement="top" :visible="tVisible" @close="tVisible = false">
      <h1 v-for="(item, index) in 'abcdefghijklmnopqrstuvwxyz'" :key="index">Hello</h1>
    </a-drawer>
    <a-drawer placement="bottom" :visible="bVisible" @close="bVisible = false">
      <h1 v-for="(item, index) in 'abcdefghijklmnopqrstuvwxyz'" :key="index">Hello</h1>
    </a-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rVisible: false,
      lVisible: false,
      tVisible: false,
      bVisible: false,
      text: `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`,
    };
  },
};
</script>
