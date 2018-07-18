<template>
  <div id="addCulture">
      <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem >家乡博物馆</BreadcrumbItem>
      <BreadcrumbItem>家乡文物管理</BreadcrumbItem>
      <BreadcrumbItem>添加内容</BreadcrumbItem>
    </Breadcrumb>
        <Form class="mt10" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="图片" prop="imageArray">
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
             <!-- <EyUpload  @upload-ok="getImageUrl" @upload-error="uploadError" @before-upload="beforeUpload" @upload-exceeded-size="uploadExceededSize" imgSizeText=""  accept="image/jpeg,image/jpg,image/png"/> -->
             <p>最多不超过9张</p>
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
          <FormItem label="国宝名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入国宝名称" :maxlength="15" style="width:50%;" />
          </FormItem>
          <FormItem label="内容" prop="content">
            <Input v-model="formValidate.content" style="width:50%;" type="textarea" :rows="6" :maxlength="1000" placeholder="请输入内容"  />
          </FormItem>
          <FormItem label="国宝在哪" prop="city">
                <EyAddress ref="eyAddress1" :value="addressValue" :isSearch="false"></EyAddress>
          </FormItem>
          <FormItem label="虚拟用户" prop="customerId">
              <EySelectsearch :pShowValue="userName" placeHolder="搜索并添加作者" url="/getCustomerStatisticsList/v1" name="nickName" resultList="customerList" :postData="{searchInfo: {isVirtual: 1, nickName: ''},sort:'',sortField:'',pageNo: 0,pageSize: 10}" :kv="['customerId','customerDto.nickName']" @getItem="getItem"></EySelectsearch>
              <span>添加虚拟用户，请到用户管理 - 虚拟用户列表 添加。
                    <router-link to="/Customer?tab=1">新增虚拟用户</router-link>
               </span>
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
import EySelectsearch from '../../Common/EySelectsearch';
import EyAddress from '../../Common/EyAddress/EyAddress';
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
  name: "addCulture",
  components: {
    Button,
    Input,
    Form,
    FormItem,
    RadioGroup,
    Radio,
    Icon,
    Modal,
    EySelectsearch,
    Breadcrumb,
    EyAddress,
    BreadcrumbItem,
    Upload
  },
  data() {
    return {
      userName:'',
      addressValue:[],
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
      islimitLoad:true,
      uploadList:[],
      ruleValidate: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        customerId: [
          { required: true, message: '用户不能为空', trigger: 'blur' }
        ],
        city:[
           { required: true, message: '地区不能为空', trigger: 'blur' }
        ],
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
          if(this.$route.params.data){
          const data = this.$route.params.data;
          console.log(data);
          this.addressValue = [];
          if (data) {
              for (let item in data) {
                  if (data.hasOwnProperty(item) && this.formValidate.hasOwnProperty(item)) {//筛选过滤赋值formValidate
                      this.formValidate[item] = data[item];
                  }
              }
              if(data.imageList && data.imageList.length>0){
                for(let i=0;i<data.imageList.length;i++){
                  this.$refs.upload.fileList.push({url:data.imageList[i].imageUrl,status:'finished'});
                }
              }
              console.log(this.uploadList);
              if (data.customerName) {
                  this.userName = data.customerName;
              }
              if(data.customerId){
                this.formValidate.customerId= data.customerId.toString();
                console.log(this.formValidate.customerId)
              }
              if(data.province) {
                this.addressValue.push(data.province);
              }
              if(data.city){
                this.addressValue.push(data.city);
              }
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
                const check = this.uploadList.length < 9;
                if (!check) {
                    this.$Message.warning('最多上传9张');
                }
                return check;
            },
        getItem(e) {
            this.formValidate.customerId = e.key.toString();
            this.userName = e.value;
        },


       async addCulture(){
          this.formValidate.customerId = Number(this.formValidate.customerId)
          const {code, msg,data} = await  setHometownAntique({
            antiqueInfo:JSON.stringify(this.formValidate)
          })

          if(code===10000 || code==='10000'){
              this.$Message.success(msg);
              setTimeout(()=>{
                this.$router.push({path:"/Culture"})
              },1000)
          }else{
            // this.$Message.error(msg);
          }

        },
        handleSubmit(name) {
          let imageArray = [];
          for(let i=0,len=this.uploadList.length;i<len;i++){
            imageArray.push(this.uploadList[i].url);
          }
          console.log(this.formValidate.customerId);
          this.formValidate.imageArray = imageArray.toString();
          const {province,city}= this.$refs.eyAddress1.getInfo();
          this.formValidate.city= city;
          this.formValidate.province = province;
          this.$refs[name].validate( async (valid) => {
            if (valid) {
                this.addCulture();
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
