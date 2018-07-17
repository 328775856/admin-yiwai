<template>
    <div id="addWorksCard">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
            <!-- 作品卡片start -->
            <FormItem label="意外提问" prop="proQuestion" class="formItem45">
                <Input v-model="formValidate.proQuestion" placeholder=" 输入提问内容，50个汉字以内" clearable :maxlength="50" />
            </FormItem>
            <FormItem label="关联艺术品" prop="itemId" class="formItem45">
                <EySelectsearch :pShowValue="getArtName" placeHolder="搜索并添加艺术品" url="/getProductStatisticsList/v1" name="productName" resultList="productList" :postData="{searchInfo: { productName: '' },pageNo: 0,pageSize: 10,sortField: '',sort: ''}" :kv="['productDto.id','productDto.name']" @getItem="getItem"></EySelectsearch>
            </FormItem>
            <FormItem class="formItem100">
                <Button type="primary" @click="save('formValidate')">保存</Button>
                <Button type="ghost" @click="goBack" style="margin-left: 8px">取消并返回</Button>
            </FormItem>
            <!-- 作品卡片end -->
        </Form>
    </div>
</template>

<script>
import { Button, Form, FormItem, Input, Icon } from 'iview';
import { setHomePageChoiceness } from './Content.service';
import EySelectsearch from '../Common/EySelectsearch.vue';

export default {
    name: 'AddWorksCard',
    components: { Button, Form, FormItem, Input, Icon, EySelectsearch },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        },
        editData: Object,
        getArtName: {
            type: String,
            default: ''
        },
    },
    data() {
        return {

            formValidate: {
                itemType: 1,
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
                proQuestion: [
                    { required: true, message: '意外提问不能为空', trigger: 'blur' },
                ],
                itemId: [
                    { type: 'number', required: true, message: '关联艺术品不能为空', trigger: 'change' },
                ],
            }
        }
    },
    mounted() {
        if (this.isEdit) {//编辑状态时
            this.formValidate = this.editData;
        }
    },
    methods: {
        getItem(item) {
            this.formValidate.itemId = item.key;
        },
        goBack() {
            this.$router.push({ name: 'Content', params: { tab: '1' } });
        },
        save(name) {
            this.$refs[name].validate(async (valid) => {
                // 同步到title
                this.formValidate.title = this.formValidate.proQuestion;
                if (valid) {
                    const { code, msg } = await setHomePageChoiceness({
                        cardInfo: JSON.stringify(this.formValidate)
                    })
                    if (code === 10000 || code === '10000') {
                        this.$Message.success(msg);
                        setTimeout(() => {
                            this.goBack()
                        }, 1500)
                    } else {
                        this.$Message.error(msg);
                    }
                } else {
                    this.$Message.error(msg);
                }
            })
        }
    }
}
</script>
<style lang="less">
@import "../../libs/css/constant.less";
@import "../../libs/css/common.less";
</style>
