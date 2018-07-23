<template>
    <!-- 新增页start -->
    <div class="form">
        <Breadcrumb separator=">" class="breadCrumb">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>基础数据</BreadcrumbItem>
            <BreadcrumbItem>机构</BreadcrumbItem>
            <BreadcrumbItem>新增机构</BreadcrumbItem>
        </Breadcrumb>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" :inline="true">
            <FormItem label="机构名称" prop="name" class="formItem45">
                <Input v-model="formValidate.name" placeholder="" clearable :maxlength="30" />
            </FormItem>
            <FormItem label="机构logo" prop="avatar" class="formItem100">
                <EyUpload @upload-ok="getImgUrl" @upload-error="uploadError" @upload-exceeded-size="uploadExceededSize"  accept="image/jpeg,image/jpg,image/png"  imgSizeText="图片规格：高100px,宽100px" />
                <p v-show="isUploadOk">
                    <span class="headImg">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                        <img :src="formValidate.avatar" class="img">
                    </span>
                </p>
            </FormItem>
            <FormItem label="机构签名" class="formItem45" prop='signature'>
                <Input v-model="formValidate.signature" placeholder="" clearable :maxlength="30" />
            </FormItem>
            <FormItem label="机构简介" prop="briefIntroduction" class="formItem100">
                    <EyEditor id="editor1" ref="editor1" :content="organContent" :insertButton="['img','video']" :toolbars=" [[
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
                <Button type="ghost" @click="goBack('2')" style="margin-left: 8px">取消并返回</Button>
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
  Icon,
  Input,
  Option
} from 'iview'
import EyUpload from '../Common/EyUpload/EyUpload'
import { setOrgan } from './Base.service.js'

export default {
  name: 'AddArt',
  components: {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Form,
    FormItem,
    Input,
    Icon,
    EyUpload,
    EyEditor: () =>
      import(/* webpackChunkName: "EyEditor" */ '@/components/Common/EyEditor/EyEditor')
  },
  data() {
    return {
      isUploadOk: false,
      organContent: '',
      formValidate: {
        id: 0,
        name: '',
        avatar: '',
        signature: '',
        managerId: 0,
        briefIntroduction: '',
        backgroundImage: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '机构名称不能为空', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '机构logo不能为空', trigger: 'blur' }
        ],
        signature: [
          { required: true, message: '机构签名不能为空', trigger: 'blur' }
        ],
        briefIntroduction: [
          { required: true, message: '机构简介不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 判断是新增or编辑页面（有参数为编辑，否则为新增）
    if (this.$route.params.data) {
      const data = this.$route.params.data
      console.log(data)
      if (data) {
        for (let item in data) {
          if (
            data.hasOwnProperty(item) &&
            this.formValidate.hasOwnProperty(item)
          ) {
            //筛选过滤赋值formValidate
            this.formValidate[item] = data[item]
          }
        }
        if (data.avatar) {
          this.isUploadOk = true
        }
        if (data.briefIntroduction) {
          this.organContent = data.briefIntroduction
        }
      }
    }
  },
  mounted() {},
  methods: {
    getImgUrl(file) {
      this.isUploadOk = true
      this.formValidate.avatar = file.url
    },
    uploadError(error) {
      this.isUploadOk = false
      console.log(error)
    },
    uploadExceededSize() {
      this.$Message.error('文件超出大小限制!')
    },
    resetImg() {
      this.isUploadOk = false
      this.formValidate.avatar = ''
    },
    uploadOk() {
      this.isUploadOk = true
    },
    goBack(tab) {
      this.$router.push({ name: 'Base', params: { tab } })
    },
    save(name) {
      this.formValidate.briefIntroduction = this.$refs.editor1.getContent()
      this.$refs[name].validate(async valid => {
        if (valid) {
          const { code, data, msg } = await setOrgan({
            OrganInfo: JSON.stringify(this.formValidate)
          })
          if (+code === 10000) {
            // this.handleReset('formValidate');
            this.$Message.success(msg)
            setTimeout(() => {
              this.goBack('2')
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
