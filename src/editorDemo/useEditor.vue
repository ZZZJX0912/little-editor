<template>
  <el-dialog
    title="使用富文本"
    :visible="visiable"
    :show-close="false"
    width="550px"
  >
    <el-form ref="messageTemplateForm" :rules="rules" :model="formData" label-width="100px">

      <!-- TODO: 编辑框 -->
      <el-form-item ref="messageFormItem" label="富文本内容" prop='editorValue'>
        <editor
          class="editor"
          v-model="formData.editorValue"
          :variableList='variableList'
          @blur="handleBlur"
        />
      </el-form-item>

      <el-form-item label="其他" prop='somethingElse'>
        <el-input v-model="formData.somethingElse" placeholder="请输入其他东西" />
      </el-form-item>

    </el-form>
    <div slot="footer">
      <el-button @click="dialogBeforeClose">取 消</el-button>
      <el-button type="primary" @click="commitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Editor from './editorMain.vue';
import { v4 as uuidv4 } from 'uuid';
import { Message } from 'element-ui';
export default {
  components: {
    Editor
  },
  props: {
    visiable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表单数据
      formData: {},
      defalutForm: {
        editorValue: '',
        somethingElse: ''
      },
      // 富文本内容
      content: '',
      // 变量列表
      variableList: [],
      rules: {
        editorValue: { required: true, message: '请输入富文本内容', trigger: 'blur' },
        somethingElse: { required: true, message: '请输入其他东西', trigger: 'blur' }
      }
    };
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.defalutForm));
    this.queryVariableList();
  },
  methods: {
    async queryVariableList() {
      this.variableList = [
        {
          variableId:uuidv4(),
          variableName:'富文本'
        },
        {
          variableId:uuidv4(),
          variableName:'little-editor'
        },
      ];
    },
    // dialog 确认按钮事件
    commitForm() {
      Message('别点啦，这只是个demo');
      this.dialogBeforeClose();
    },
    // 关闭弹窗
    dialogBeforeClose() {
      this.$refs.messageTemplateForm.clearValidate();
      this.$emit('update:visiable', false);
    },
    handleBlur(e) {
      this.$refs.messageFormItem.$emit('el.form.blur', e);
    }
  }

};
</script>

<style lang='scss' scope>
.portUrlSelect{
  .el-select{
    width: 400px;
  }
}
.el-form-item__label {
  line-height: 30px;
  white-space: nowrap;
  &::before {
    content: '*' !important;
  }
}
.el-form-item.is-error{
  .el-form-item__content{
    .editor_container{
      outline-color: #f56c6c;
    }
  }
}
</style>
