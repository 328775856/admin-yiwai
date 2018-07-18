<template>
  <div id="addCultureDetail">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem >家乡博物馆</BreadcrumbItem>
      <BreadcrumbItem>家乡文物管理</BreadcrumbItem>
      <BreadcrumbItem>补充详情</BreadcrumbItem>
    </Breadcrumb>
        <Form class="mt10" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="头图" prop="headImageArray">
                    <Upload
              ref="upload"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :accept="'image/gif,image/jpeg,image/jpg,image/png'"
              :format="['jpg','jpeg','png']"
              :data="data"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              action="https://up-z2.qbox.me"
              >
            <Button type="ghost" icon="plus">{{text}}</Button>
          </Upload>
             <p>最多不超过4张,图片规格:宽750px 高563px</p>
              <div class="upload-list" v-for="item in uploadList" :key="item.value">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                </template>
            </div>
          </FormItem>
          <FormItem label="详细介绍" prop="detail">
                 <EyEditor id="editor1" ref="editor1" :content="articleCotent" :insertButton="['img','video']" :toolbars=" [[
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
                <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                <Button type="ghost" @click="goBack" style="margin-left: 8px">取消并返回</Button>
          </FormItem>
      </Form>
    <Modal title="View Image" v-model="visible">
        <img :src="imgSrc" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
// import EyEditor from '../../Common/EyEditor/EyEditor';
import config from '../../../libs/js/config.js';
import util from '../../../libs/js/util.js';

import {
  setHometownAntique
} from "./Culture.service";

import {
  Button,
  Input,
  Form,
  FormItem,
  RadioGroup,
  Radio,
  Icon,
  Modal,
  Breadcrumb,
  BreadcrumbItem,
  Upload
} from 'iview';
export default {
  name: "addCultureDetail",
  components: {
    Button,
    Input,
    Form,
    FormItem,
    RadioGroup,
    Radio,
    Icon,
    Modal,
    Breadcrumb,
    BreadcrumbItem,
    EyEditor:() =>import (/* webpackChunkName: "EyEditor" */'@/components/Common/EyEditor/EyEditor'),
    Upload
  },
  data() {
    return {
      articleCotent:'',
      imageList:[],
      formValidate: {
        id:0,
        customerId:'',
        imageArray: '',
        province:'',
        city:'',
        name: '',
        content:'',
        detail:'',
        headImageArray:''
      },
      visible:false,
      imgSrc:'',
      uploadList:[],
      ruleValidate: {
        headImageArray: [
          { required: false, message: '头图不能为空', trigger: 'blur' }
        ],
        detail: [
          { required: false, message: '详细内容不能为空', trigger: 'blur' }
        ]
      },

            //upload
      token:'',
      text:'上传图片',
      defaultList:[
        ],
      data:{
        file:'file',
        token:'',
        key:''
      },
      prdfix:'eyadmin',
      imgHost:config.imgHost
    };
  },
  mounted(){
      if(this.$route.params.data!==undefined && this.$route.params.data){
          let data = this.$route.params.data;
          for (let item in data) {
              if (data.hasOwnProperty(item) && this.formValidate.hasOwnProperty(item)) {//筛选过滤赋值formValidate
                  this.formValidate[item] = data[item]
              }
          }

          if(data.imageList && data.imageList.length>0){
            for(let i=0;i<data.imageList.length;i++){
              this.imageList.push(data.imageList[i].imageUrl);
            }
          }
          if(data.headImageList && data.headImageList.length>0){
            for(let j=0;j<data.headImageList.length;j++){
              this.$refs.upload.fileList.push({url:data.headImageList[j].imageUrl,status:'finished'});
            }
          }
          if(data.detail){
            this.articleCotent = data.detail;
          }
        }

      this.getQNToken();
      this.uploadList = this.$refs.upload.fileList;
  },
  created(){

  },
  methods: {
        async getQNToken(){
          this.data.token = await util.getQNToken();
        },
         handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file,fileList) {
                file.url = `${config.imgHost}${res.key}`;
            },
            handleFormatError (file) {
                this.$Message.warning("文件格式不正确");
            },
            handleMaxSize (file) {
                this.$Message.warning("文件超出大小限制");
            },
            handleBeforeUpload (file) {
                if (file) {
                  this.data.key = `${this.prdfix}/${util._guid()}${file.name.slice(file.name.lastIndexOf('.'))}`;
               }
              // this.data.key = `${this.prdfix}/${util._guid()}${file.name.slice(file.name.lastIndexOf('.'))}`;
                const check = this.uploadList.length < 4;
                if (!check) {
                    this.$Message.warning('最多上传4张');
                }
                return check;
            },
       async editItem(){
          const {code,msg} = await setHometownAntique({
            antiqueInfo:JSON.stringify(this.formValidate)
          })
          if(code ===10000 || code==='10000'){
            this.$Message.success(msg);
            setTimeout(()=>{
               this.$router.push({path:"/Culture"})
            },1000)
          }
        },
      handleSubmit(name) {
         this.formValidate.detail = this.$refs.editor1.getContent();
         this.formValidate.imageArray = this.imageList.toString();
        let imageArray = [];
          for(let i=0,len=this.uploadList.length;i<len;i++){
            imageArray.push(this.uploadList[i].url);
          }
        this.formValidate.headImageArray = imageArray.toString();
         console.log(this.formValidate);
        this.$refs[name].validate( async (valid) => {
          if (valid) {
              this.editItem();
          }
        })
    },
    goBack() {
        this.$router.push({ name: 'Culture' });
    },
  }
};
</script>

<style lang="less">
  .upload-list{
        margin-top:10px;
        display: inline-block;
        width: 80px;
        height: 80px;
        text-align: center;
        line-height: 80px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .upload-list img{
        width: 100%;
        height: 100%;
    }
    .upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .upload-list:hover .upload-list-cover{
        display: block;
    }
    .upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
