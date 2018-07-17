<template>
  <div>
    <Modal id="setUser" class-name="vertical-center-modal" :title="pIsAdd?'新增账号':'编辑账号'" v-model="isShowModel" width="400">
      <Form class="mt10" ref="formValidate" :model="userInfo" :rules="ruleValidate" :label-width="80">

        <FormItem label="账号" prop="userName">
          <Input v-model.trim="userInfo.userName" placeholder="" />
        </FormItem>

        <FormItem label="密码" prop="password">
          <Input v-model.trim="userInfo.password" placeholder="" />
        </FormItem>

        <FormItem label="状态" prop="userStatus">
          <Select v-model="userInfo.userStatus" placeholder="">
            <Option :value="1">启用</Option>
            <Option :value="0">禁用</Option>
          </Select>
        </FormItem>

      </Form>
      <div slot="footer">
        <Button type="text" @click="()=>this.isShowModel=false">取消</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>

import {
  setUser,
} from "./System.service";

import {
  Button,
  Select,
  Option,
  Input,
  Form,
  FormItem,
  Row,
  Col,
  Modal
} from 'iview';

export default {
  name: 'SetUser',
  components: {
    Button,
    Select,
    Option,
    Input,
    Form,
    FormItem,
    Row,
    Col,
    Modal
  },
  props: {
    pIsAdd: {
      default: true
    },
    pIsShowModel: {
      default: false,
    },
    pUserInfo: {
      default: () => { return {} },
    }
  },

  data() {
    return {
      isShowModel: this.pIsShowModel,
      userInfo: this.pUserInfo,
      ruleValidate: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
  },

  watch: {
    // 因为reset表单的原因会清空掉所有字段值，所以要在watch中监听
    pUserInfo(newValue) {
      this.userInfo = newValue;
    },
    pIsShowModel(newValue) {
      this.isShowModel = newValue;
    },
    isShowModel(newValue) {
      if (!newValue) {
        this.$refs['formValidate'].resetFields();
      }
      this.$emit('updatepIsShowModel', newValue);
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {

          const {
            id: userId,
            userName,
            password,
            userStatus
          } = this.userInfo;
          const postData = {
            userId,
            userName,
            password,
            userStatus
          };
          console.log(postData);
          setUser(postData).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success(`${this.pIsAdd ? '新增' : '修改'}账号成功!`);
              // 刷新列表页
              this.$parent.getUserList();
              this.isShowModel = false;
            } else if (code == '10001') {
              this.$Message.error('账号名重复！请重新填写！');
            } else {
              this.$Message.error(`${this.pIsAdd ? '新增' : '修改'}账号失败!`);
            }
          });
        } else {
          this.$Message.error(`${this.pIsAdd ? '新增' : '修改'}账号失败!`);
        }
      })
    },
  }
}

</script>

<style lang="less">
@import "../../libs/css/constant.less";
@import "../../libs/css/common.less";

#setUser {
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
      top: 0;
    }
  }
}
</style>
