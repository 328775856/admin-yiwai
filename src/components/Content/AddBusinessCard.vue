<template>
    <div id="addBusinessCard">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
            <!-- 观点卡片start -->
            <FormItem label="卡片标题" prop="title" class="formItem45">
                <Input v-model="formValidate.title" placeholder="输入卡片标题，50个汉字以内" :autosize="{minRows: 2,maxRows: 5}" clearable :maxlength="50" type="textarea" />
            </FormItem>
            <FormItem label="商品名称" prop="goodsName" class="formItem45">
                <Input v-model="formValidate.goodsName" placeholder=" 输入商品名称，20个汉字以内" clearable :maxlength="20" />
            </FormItem>
            <FormItem label="商品图片" prop="image" class="formItem100">
                <EyUpload @upload-ok="getImageUrl" @upload-error="uploadError" @upload-exceeded-size="uploadExceededSize" imgSizeText="图片规格：高400px、宽325px" accept="image/jpeg,image/jpg,image/png"/>
                <p v-show="isUploadOk">
                    <span class="headImg">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                        <img :src="formValidate.image+'?imageView2/1/w/135/h/165/q/50'" class="img">
                    </span>
                </p>
            </FormItem>
            <FormItem label="商品价格" prop="price" class="formItem45">
                <Input v-model="formValidate.price" placeholder=" 输入商品价格" clearable :maxlength="10" number>
                <span slot="prepend">￥</span>
                </Input>
            </FormItem>
            <FormItem label="商品链接" prop="linkUrl" class="formItem45">
                <Input v-model="formValidate.linkUrl" placeholder=" 输入“意外商城”中该商品的链接" clearable :maxlength="200" />
            </FormItem>
            <FormItem class="formItem100">
                <Button type="primary" @click="save('formValidate')">保存</Button>
                <Button type="ghost" @click="goBack" style="margin-left: 8px">取消并返回</Button>
            </FormItem>
            <!-- 观点卡片end -->
        </Form>
    </div>
</template>

<script>
import { Button, Form, FormItem, Input, Icon } from 'iview';
import EyUpload from '../Common/EyUpload/EyUpload';
import { setHomePageChoiceness } from './Content.service';

export default {
    name: 'AddBusinessCard',
    components: { Button, Form, FormItem, Input, Icon, EyUpload },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        },
        editData: Object
    },
    data() {
        return {
            isUploadOk: false,
            formValidate: {
                itemType: 3,
                proQuestion: '',
                itemId: '',
                title: '',
                goodsName: '',
                image: '',
                price: '',
                linkUrl: ''
            },
            ruleValidate: {
                itemType: [
                    { type: 'number', required: true, message: '卡片类型不能为空', trigger: 'change' }
                ],
                title: [
                    { required: true, message: '卡片标题不能为空', trigger: 'blur' },
                ],
                goodsName: [
                    { required: true, message: '商品名称不能为空', trigger: 'blur' },
                ],
                image: [
                    { required: true, message: '商品图片不能为空', trigger: 'blur' },
                ],
                price: [
                    { type: 'number', required: true, message: '商品价格不能为空', trigger: 'blur' },
                ],
                linkUrl: [
                    { required: true, message: '商品链接不能为空', trigger: 'blur' },
                ],
            }
        }
    },
    mounted() {
        if (this.isEdit) {//编辑状态时
            this.formValidate = this.editData;
            this.isUploadOk = true;
        }
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
        goBack() {
            this.$router.push({ name: 'Content', params: { tab: '1' } });
        },
        save(name) {
            this.$refs[name].validate(async (valid) => {
                if (valid) {
                    const { code,msg } = await setHomePageChoiceness({
                        cardInfo: JSON.stringify(this.formValidate)
                    })
                    if (code === 10000 || code === '10000') {
                        this.$Message.success(msg);
                        setTimeout(() => {
                            this.$router.push({name:"Content",params:{tab:1}})
                        }, 1000)
                    } else {
                        this.$Message.error(msg);
                    }
                }
            })
        }
    }
}
</script>
<style lang="less">
@import "../../libs/css/common.less";
#addBusinessCard {
  .headImg {
    position: relative;
    margin-top: 20px;
    display: inline-block;
    .closeIcon {
      position: absolute;
      right: -18px;
      top: -10px;
    }
  }
}
</style>
