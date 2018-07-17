<template>
    <div class="addArtShow">
        <Breadcrumb separator=">" class="breadCrumb">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>基础数据</BreadcrumbItem>
            <BreadcrumbItem>艺术品库</BreadcrumbItem>
            <BreadcrumbItem>新增展览</BreadcrumbItem>
        </Breadcrumb>
        <!-- <DatePicker  format="yyyy-MM-dd" type="daterange" placement="bottom-start" placeholder="Select date" style="width: 230px" ref="data"></DatePicker> -->
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
            <FormItem label="展览名称" prop="exhibitionName" class="formItem45">
                <Input v-model="formValidate.exhibitionName" placeholder="输入展览名称，50个汉字以内" clearable :maxlength="50" />
            </FormItem>
            <FormItem label="展览介绍" prop="description" class="formItem60">
                <Input v-model="formValidate.description" placeholder="输入卡片标题，100个汉字以内" :autosize="{minRows: 2,maxRows: 5}" clearable :maxlength="100" type="textarea" />
            </FormItem>
            <FormItem label="展期" prop="date" class="formItem45">
                <DatePicker :value="formValidate.date" format="yyyy/MM/dd" type="daterange" placeholder="选择展期" style="width: 230px" ref="data" @on-change="onChange"></DatePicker>
            </FormItem>
            <FormItem label="策展人" prop="curator" class="formItem45">
                <Input v-model="formValidate.curator" placeholder="输入策展人名称" clearable :maxlength="30" />
            </FormItem>
            <FormItem label="展览图片" prop="image" class="formItem45">
                <EyUpload @upload-ok="getImageUrl" @upload-error="uploadError" @upload-exceeded-size="uploadExceededSize" imgSizeText="图片规格：高400px、宽325px，不超过100K" :maxSize="100" accept="image/jpeg,image/jpg,image/png"/>
                <p v-show="isUploadOk">
                    <span class="headImg">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                        <img :src="formValidate.image+'?imageView2/1/w/135/h/165/q/50'" class="img">
                    </span>
                </p>
            </FormItem>
            <FormItem class="formItem100 btn">
                <Button type="primary" @click="save('formValidate')">保存</Button>
                <Button type="ghost" @click="goBack" style="margin-left: 8px">取消并返回</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Button, Form, FormItem, Input, Select, Option, DatePicker, Icon } from 'iview';
import EyUpload from '../Common/EyUpload/EyUpload';
import util from 'libs/js/util.js';
import { setExhibition } from './Content.service';



export default {
    name: 'AddArtShow',
    components: { Breadcrumb, BreadcrumbItem, Button, Form, FormItem, Input, Select, Option, DatePicker, Icon,EyUpload },
    data() {
        return {
            editorOption: {
                placeholder: "输入艺术品介绍，不超过10000个字符",
            },
            isUploadOk: false,
            articleList: [],
            authorList: [],
            formValidate: {
                id: 0,
                exhibitionName: '',
                description: '',
                date: [],
                exhibitionStartTime: '',
                exhibitionEndTime: '',
                curator: '',
                image: ''
            },
            ruleValidate: {
                exhibitionName: [
                    { required: true, message: '展览名称不能为空', trigger: 'blur' }
                ],
                date: [
                    { type: 'array', required: true, message: '展期不能为空', trigger: 'change' }
                ],
                description: [
                    { required: true, message: '展览介绍不能为空', trigger: 'blur' },
                ],
                curator: [
                    { required: true, message: '策展人不能为空', trigger: 'blur' },
                ],
                image: [
                    { required: true, message: '展览图片不能为空', trigger: 'blur' },
                ],
            },
        }
    },
    created() {
        // 判断是新增or编辑页面（有参数为编辑，否则为新增）
        const data = this.$route.params.data;
        if (data) {
            for (let item in data) {
                if (data.hasOwnProperty(item) && this.formValidate.hasOwnProperty(item)) {//筛选过滤赋值formValidate
                    this.formValidate[item] = data[item]
                }
            }
            if (data.image) {
                this.isUploadOk = true;
            }
            this.formValidate.date = [data.exhibitionStartTime, data.exhibitionEndTime];
            this.formValidate.exhibitionStartTime = `${data.exhibitionStartTime} 00:00:00`;
            this.formValidate.exhibitionEndTime = `${data.exhibitionEndTime} 00:00:00`;
        };
    },
    mounted() {
    },
    methods: {
        getImageUrl(file) {
            this.isUploadOk = true;
            this.formValidate.image = file.url;
        },
        uploadError(error) {
            this.isUploadOk = false;
            console.log(error)
        },
        uploadExceededSize() {
            this.$Message.error('文件超出大小限制!');
        },
        resetImg() {
            this.isUploadOk = false;
            this.formValidate.image = '';
        },
        onChange() {
            this.formValidate.date = this.$refs.data.internalValue;//时间控件选择时触发赋值给this.formValidate.date,消除表单验证
            this.formValidate.exhibitionStartTime = util.getNowFormatDate(this.$refs.data.internalValue[0]);//开始时间
            this.formValidate.exhibitionEndTime = util.getNowFormatDate(this.$refs.data.internalValue[1]);//截至时间
        },
        goBack() {
            this.$router.push({ name: 'Content', params: { tab: '2' } });
        },
        save(name) {
            this.$refs[name].validate(async (valid) => {
                if (valid) {
                    const data = this.formValidate;
                    delete data.date;//删除date属性json
                    const { code, msg } = await setExhibition({
                        exhibitionInfo: JSON.stringify(data)
                    })
                    if (code === 10000 || code === '10000') {
                        this.$Message.success(msg);
                        setTimeout(() => {
                            this.goBack();
                        }, 1500)
                    } else {
                        this.$Message.error(msg);
                    }
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        }
    }
}
</script>

<style lang="less">
@import "../../libs/css/constant.less";
@import "../../libs/css/common.less";
.addArtShow {
  .formItem45,
  .formItem100 {
    width: 45%;
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
        width: 135px;
        height: 165px;
      }
    }
  }
  .formItem100 {
    width: 100%;
  }
}
</style>
