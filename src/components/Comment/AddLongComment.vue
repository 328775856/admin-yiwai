<template>
    <!-- 新增页start -->
    <div class="form">
        <Breadcrumb separator=">" class="breadCrumb">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>评论管理</BreadcrumbItem>
            <BreadcrumbItem>新增长评</BreadcrumbItem>
        </Breadcrumb>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" :inline="true">
            <FormItem label="评论标题" prop="title" class="formItem45">
                <Input v-model="formValidate.title" placeholder="" clearable :maxlength="30" />
            </FormItem>
            <FormItem label="评论者" prop="customerId">
                <Select v-model="formValidate.customerId" placeholder="请选择评论者" style="width:200px">
                  <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.nickName }}</Option>
                </Select>
            </FormItem>
            <FormItem label="评论内容" prop="content" class="formItem100">
                    <EyEditor id="editor1" ref="editor1" :content="commentContent" :insertButton="['img']" :toolbars=" [[
                      'fullscreen',
                      'undo', 'redo', '|',
                      'paragraph', 'fontsize', '|',
                      'indent', '|',
                      'bold', 'italic', 'underline', '|',
                      'forecolor', 'backcolor', '|',
                      'justifyleft', 'justifycenter', 'justifyright', '|',
                      '|', 'removeformat'
                    ]]"></EyEditor>
              </FormItem>
            <FormItem class="formItem100 btn">
                <Button type="primary" @click="save('formValidate')">保存</Button>
                <Button type="ghost" @click="goBack('0')" style="margin-left: 8px">取消并返回</Button>
            </FormItem>
        </Form>
    </div>
    <!-- 新增页end -->
</template>

<script>
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormItem,
  Select,
  Icon,
  Input,
  Option
} from 'iview'

import { addComment, getCustomerList } from './Comment.service.js'

export default {
  name: 'AddArt',
  components: {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Form,
    FormItem,
    Input,
    Select,
    Option,
    Icon,
    EyEditor: () =>
      import(/* webpackChunkName: "EyEditor" */ '@/components/Common/EyEditor/EyEditor')
  },
  data() {
    return {
      commentContent: '',
      pageNo: 1,
      pageSize: 10,
      isOfficial: 1,
      customerName: '',
      formValidate: {
        title: '',
        content: '',
        customerId: '',
        productId: ''
      },

      customerList: [],
      ruleValidate: {
        title: [
          { required: true, message: '评论标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '评论内容不能为空', trigger: 'blur' }
        ],
        customerId: [
          { required: true, message: '评论者不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getDataList()
    console.log(this.$route.query)
    this.formValidate.productId = this.$route.query.productId
  },
  mounted() {},
  methods: {
    //获取官方用户列表
    async getDataList() {
      const { pageNo, pageSize, customerName, isOfficial } = this
      let postData = {
        pageNo,
        pageSize,
        customerName,
        isOfficial
      }

      const { code, data, msg } = await getCustomerList(postData)
      if (+code === 10000) {
        this.customerList = this.operateList(data.customerList)
      } else {
        this.$Message.error(msg)
      }
    },

    operateList(list) {
      list.map(item => {
        item.id = item.id.toString()
      })
      return list
    },

    goBack(tab) {
      this.$router.push({
        name: 'Comment',
        query: { tab, productId: this.$route.query.productId }
      })
    },
    save(name) {
      console.log(this.formValidate)
      this.formValidate.content = this.$refs.editor1.getContent()
      this.$refs[name].validate(async valid => {
        if (valid) {
          let postData = this.formValidate
          const { code, data, msg } = await addComment(postData)
          if (+code === 10000) {
            // this.handleReset('formValidate');
            this.$Message.success(msg)
            setTimeout(() => {
              this.goBack('0')
            }, 1500)
          } else {
            this.$Message.error(msg)
          }
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>


<style lang="less">
@import '../../libs/css/constant.less';
@import '../../libs/css/common.less';

.ivu-select-dropdown {
  z-index: 1000;
}
.form {
  .formItem45 {
    width: 45%;
  }
  .formItem100 {
    width: 100%;
    .headImg {
      position: relative;
      margin-top: 20px;
      display: inline-block;
      .closeIcon {
        position: absolute;
        right: -18px;
        top: -10px;
      }
      .img {
        width: 100px;
        height: 100px;
      }
    }
  }
  .btn {
    margin-top: 100px;
  }
}
</style>
