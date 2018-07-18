<template>
    <div class="addArticle">
        <Breadcrumb separator=">" class="breadCrumb">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>基础数据</BreadcrumbItem>
            <BreadcrumbItem>艺术品库</BreadcrumbItem>
            <BreadcrumbItem>新增文章</BreadcrumbItem>
        </Breadcrumb>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" :inline="true">
            <FormItem label="文章标题" prop="title" class="formItem100">
                <Input v-model="formValidate.title" placeholder=" 输入文章标题" clearable :maxlength="30" style="width:30%;" />
            </FormItem>
            <Form-item label="封面" prop="cover">
                <EyUpload @upload-ok="getLitImgUrl" @upload-error="uploadError"  @upload-exceeded-size="uploadExceededSize" imgSizeText="封面尺寸：657px X 247px"  accept="image/gif,image/jpeg,image/jpg,image/png"/>
                <p v-show="isLitUploadOk">
                    <div class="imgWrp mt20" v-show="formValidate.cover">
                        <img  :src="formValidate.cover+'?imageView2/1/w/135/h/165/q/50'"  class="img headImg">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                    </div>
                </p>
                <!-- <div style="color:#ed3f14;padding-top:6px; line-height:1;position:absolute;top:100%;left:0;" v-show="!formValidate.image">图片不能为空</div> -->
            </Form-item>
            <FormItem label="文章分类" prop="classifyValue" class="formItem45">
                <Select v-model="formValidate.classifyValue" style="width:180px" placeholder="请选择分类">
                    <Option v-for="(item,index) in articleList" :value="item.dictionaryValue" :key="index">{{ item.dictionaryValue }}</Option>
                </Select>
            </FormItem>
            <FormItem label="作者" prop="author" class="formItem45">
                <Select v-model="formValidate.author" style="width:180px" placeholder="请选择作者">
                    <Option v-for="(item,index) in authorList" :value="item.dictionaryValue" :key="index">{{ item.dictionaryValue }}</Option>
                </Select>
            </FormItem>
            <!-- <FormItem label="发布时间" prop="releaseTime" class="formItem45">
                <DatePicker type="datetime" style="width: 230px" v-model="formValidate.releaseTime"></DatePicker>
            </FormItem> -->
            <FormItem label="文章介绍" prop="content" class="formItem100">
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
                <Button type="primary" @click="save('formValidate')">保存</Button>
                <Button type="ghost" @click="goBack" style="margin-left: 8px">取消并返回</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Button, Form, FormItem, Input, Select, Option, DatePicker,Icon } from 'iview';
import EyQuill from '../Common/EyQuill/EyQuill';

// import EyEditor from '../Common/EyEditor/EyEditor'
import { getDictionaryList } from 'libs/js/api.js';
import { setArticle } from './Content.service';
import util from 'libs/js/util.js';
import EyUpload from '../Common/EyUpload/EyUpload';

export default {
    name: 'AddArticle',
    
    components: { Breadcrumb, BreadcrumbItem, Button, Form, FormItem, Input, Select, Option, DatePicker ,EyQuill,EyUpload,Icon,EyEditor:() =>import (/* webpackChunkName: "EyEditor" */'@/components/Common/EyEditor/EyEditor')},
    data() {
        return {
            isUploadOk:false,
            isLitUploadOk:false,
            articleCotent:"",
            articleList: [],
            authorList: [],
            formValidate: {
                id: 0,
                title: '',
                classifyId: '',
                classifyValue: '',
                author: '',
                releaseTime: '',
                content: '',
                cover:''
            },
            ruleValidate: {
                title: [
                    { required: true, message: '文章标题不能为空', trigger: 'blur' }
                ],
                cover: [
                    { required: true, message: '文章封面不能为空', trigger: 'blur' }
                ],
                classifyValue: [
                    { required: true, message: '文章分类不能为空', trigger: 'change' },
                ],
                author: [
                    { required: true, message: '文章作者不能为空', trigger: 'change' },
                ],
                releaseTime: [
                    { type: 'date', required: true, message: '文章发布时间不能为空', trigger: 'change' },
                ],
                content: [
                    { required: true, message: '文章介绍不能为空', trigger: 'blur' },
                ],
            },
            token: ''
        }
    },
    created() {
        // 判断是新增or编辑页面（有参数为编辑，否则为新增）
        const data = this.$route.params.data;
        console.log(data);
        if (data) {
            for (let item in data) {
                if (data.hasOwnProperty(item) && this.formValidate.hasOwnProperty(item)) {//筛选过滤赋值formValidate
                    this.formValidate[item] = data[item]
                }
            }
            if(data.content){
              this.articleCotent = data.content;
            }
            if(data.cover){
              this.isLitUploadOk = true;
            }
        };
    },
    mounted() {
        this.getDictionaryList({});
    },
    methods: {
        contentChange({ content }) {
            // 接收子组件的content赋值
            this.formValidate.content = content;
        },
        goBack() {
            this.$router.push({ name: 'Content', params: { tab: '0' } });
        },
        async getDictionaryList({ dictionaryGroup = '', dictionaryKey = '', pageNo = 1, pageSize = 10 }) {
            const { data } = await getDictionaryList({ dictionaryGroup, dictionaryKey, pageNo, pageSize });
            this.authorList = data.data.filter((item, index) => {
                return item.dictionaryGroup === 'author'
            });
            this.articleList = data.data.filter((item, index) => {
                return item.dictionaryGroup === 'article-type'
            });
        },
        save(name) {
            this.formValidate.content = this.$refs.editor1.getContent();
            console.log(this.formValidate.content);
            this.$refs[name].validate(async (valid) => {
                if (valid) {
                    this.formValidate.classifyId = await this.articleList.find((item, index) => {
                        return item.dictionaryValue === this.formValidate.classifyValue;
                    }).id;
                    //this.formValidate.releaseTime = await util.getNowFormatDate(this.formValidate.releaseTime);
                    const { code,msg } = await setArticle({
                        articleInfo: JSON.stringify(this.formValidate)
                    })
                    if (code === 10000 || code === '10000') {
                        this.$Message.success(msg);
                        setTimeout(() => {
                            this.goBack();
                        }, 1000)
                    } else {
                        this.$Message.error(msg);
                    }
                }
            })
        },
    handleReset(name) {
        this.$refs[name].resetFields();
    },
    getImageUrl(file) {
			this.isArtImgUploadOk = true;
			this.formValidate.cover = file.url;
		},
      getLitImgUrl(file) {
        this.isLitUploadOk = true;
        this.formValidate.cover = file.url;
      },
      uploadExceededSize() {
        this.$Message.error("文件超出大小限制!");
      },
      uploadError(error) {
        this.isUploadOk = false;

      },
      resetImg() {
        this.isUploadOk = false;
        this.formValidate.cover = "";
      },
      uploadOk() {
        this.isUploadOk = true;
      },
    }
}
</script>

<style lang="less">
@import "../../libs/css/constant.less";
@import "../../libs/css/common.less";
.addArticle {
  .formItem45,
  .formItem100 {
    width: 45%;
  }
  .formItem100 {
    width: 100%;
  }

  .imgWrp {
    .closeIcon {
      cursor: pointer;
      position: absolute;
      top: -8px;
      right: -8px;
      background: #fff;
    }
    border: 1px solid @GRAY-50;
    height: 200px;
    width: 200px;
    position: relative;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
