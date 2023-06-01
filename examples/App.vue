<template>
  <div>
    <a-button type="primary" @click="rVisible = !rVisible">右侧弹窗</a-button>
    <a-button type="primary" @click="lVisible = !lVisible">左侧弹窗</a-button>
    <a-button type="primary" @click="tVisible = !tVisible">顶部弹窗</a-button>
    <a-button type="primary" @click="bVisible = !bVisible">底部弹窗</a-button>
    <a-drawer placement="right" :visible="rVisible" @close="rVisible = false" title="测试">
      <div slot="extra">
        <a-button>取消</a-button>
        <a-button type="primary">确定</a-button>
      </div>
      <h1 v-for="(item, index) in 'abcdefghijklmnopqrstuvwxyz'" :key="index">Hello</h1>
    </a-drawer>
    <a-drawer placement="left" :visible="lVisible" @close="lVisible = false">
      <h1 v-for="(item, index) in 'abcdefghijklmnopqrstuvwxyz'" :key="index">Hello</h1>
    </a-drawer>
    <a-drawer
      placement="top"
      :visible="tVisible"
      @close="tVisible = false"
      title="test"
      :closable="false"
    >
      <h1 v-for="(item, index) in 'abcdefghijklmnopqrstuvwxyz'" :key="index">Hello</h1>
    </a-drawer>
    <a-drawer placement="bottom" :visible="bVisible" @close="bVisible = false" title="test">
      <h1 v-for="(item, index) in 'abcdefghijklmnopqrstuvwxyz'" :key="index">Hello</h1>
    </a-drawer>
    <a-button type="primary" @click="openModel">Confirm</a-button>
    <a-button type="primary" @click="modalVisible = true"> Modal </a-button>
    <a-modal v-model="modalVisible" title="Modal" ok-text="确认" cancel-text="取消">
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
    </a-modal>
    <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" cancel-text="No">
      <a href="#">Delete</a>
    </a-popconfirm>
  </div>
</template>
<script>
import { Modal } from 'ant-design-vue';
export default {
  data() {
    return {
      modalVisible: false,
      rVisible: false,
      lVisible: false,
      tVisible: false,
      bVisible: false,
      text: `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`,
    };
  },
  methods: {
    openModel() {
      console.log(Modal);
      this.$confirm({
        title: 'Do you Want to delete these items?',
        content: h => <div style="color:red;">Some descriptions</div>,
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
        class: 'test',
      });
    },
  },
};
</script>
