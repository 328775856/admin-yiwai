<template>
    <!-- 新增页start -->
    <div class="addContent">
        <Breadcrumb separator=">" class="breadCrumb">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>基础数据</BreadcrumbItem>
            <BreadcrumbItem>艺术家库</BreadcrumbItem>
            <BreadcrumbItem>{{cardList[index-1].name}}</BreadcrumbItem>
        </Breadcrumb>
        <Form :label-width="150">
            <FormItem label="卡片类型" prop="itemType" class="formItem100" :rules="{required: true, message: '卡片类型不能为空', trigger: 'blur'}">
                <RadioGroup v-model="index" v-for="(item,idx) in cardList" :key="idx" @on-change="onChange">
                    <Radio :label="item.value">{{item.name}}</Radio>
                </RadioGroup>
            </FormItem>
        </Form>
        <AddWorksCard v-if="type==='workCard'" :getArtName="getArtName" :editData="formValidate1" :isEdit="isEdit1" />

        <AddPointCard v-if="type==='pointCard'" :editData="formValidate2" :isEdit="isEdit2" />

        <AddBusinessCard v-if="type==='businessCard'" :editData="formValidate3" :isEdit="isEdit3" />
    </div>
    <!-- 新增页end -->
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Button, Form, FormItem, RadioGroup, Radio, } from 'iview';
import AddWorksCard from './AddWorksCard.vue';
import AddPointCard from "./AddPointCard.vue";
import AddBusinessCard from "./AddBusinessCard.vue";


export default {
    name: 'AddContent',
    components: { Breadcrumb, BreadcrumbItem, Button, Form, FormItem, RadioGroup, Radio, AddWorksCard, AddPointCard, AddBusinessCard },
    data() {
        return {
            type: 'workCard',
            index: 1,
            getArtName: '',
            isEdit1: false,
            isEdit2: false,
            isEdit3: false,
            cardList: [{ value: 1, name: '作品卡片' }, { value: 2, name: '观点卡片' }, { value: 3, name: '商品卡片' }],
            formValidate1: {
                itemType: 1,
                proQuestion: '',
                itemId: '',
                id:'',
                title: '',
                goodsName: '',
                image: '',
                price: '',
                linkUrl: ''
            },
            formValidate2: {
                itemType: 2,
                proQuestion: '',
                itemId: '',
                id:'',
                title: '',
                goodsName: '',
                image: '',
                price: '',
                linkUrl: ''
            },
            formValidate3: {
                itemType: 3,
                id:'',
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
            }
        }
    },
    created() {
        // 判断是新增or编辑页面（有参数为编辑，否则为新增）
        const data = this.$route.params.data;
        console.log(data);
        if (data) {
            this.index = data.itemType;
            if (data.itemType === 1) {
                this.type = 'workCard';
                this.isEdit1 = true;
                this.getArtName = data.productDto.name;
                for (let item in data) {
                    if (data.hasOwnProperty(item) && this.formValidate1.hasOwnProperty(item)) {//筛选过滤赋值formValidate
                        this.formValidate1[item] = data[item];
                    }
                }
            } else if (data.itemType === 2) {
                this.type = 'pointCard';
                this.isEdit2 = true;
                for (let item in data) {
                    if (data.hasOwnProperty(item) && this.formValidate2.hasOwnProperty(item)) {//筛选过滤赋值formValidate
                        this.formValidate2[item] = data[item];
                    }
                }

            } else if (data.itemType === 3) {
                this.type = 'businessCard';
                this.isEdit3 = true;
                for (let item in data) {
                    if (data.hasOwnProperty(item) && this.formValidate3.hasOwnProperty(item)) {//筛选过滤赋值formValidate
                        this.formValidate3[item] = data[item];
                        console.log(this.formValidate3);
                    }
                }
            }
        }
    },
    mounted() {
    },
    methods: {
        onChange(e) {
            if (e === 1) {
                this.type = 'workCard';
            } else if (e === 2) {
                this.type = 'pointCard';
            } else {
                this.type = 'businessCard';
            }
        },
    }
}
</script>

<style lang="less">
@import "../../libs/css/common.less";
</style>
