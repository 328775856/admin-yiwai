<template>
    <div id="addPointCard">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" @submit.native.prevent>
            <!-- 观点卡片start -->
            <FormItem label="关联观点" prop="itemId" class="formItem45">
                <Input v-model="formValidate.itemId" placeholder=" 输入评论编号" clearable :maxlength="15" @on-blur="onBlur" @on-enter="onBlur" number/>
            </FormItem>
            <FormItem label="" class="formItem45">
                {{point}}
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
import { getCommentInfo, setHomePageChoiceness } from './Content.service';

export default {
    name: 'AddPointCard',
    components: { Button, Form, FormItem, Input, Icon },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        },
        editData: Object
    },
    data() {
        return {
            point: '',
            formValidate: {
                itemType: 2,
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
                itemId: [
                    { type: 'number', required: true, message: '关联观点不能为空', trigger: 'change' },
                ],
            }
        }
    },
    mounted() {
        if (this.isEdit) {//编辑状态时
            this.formValidate = this.editData;
            this.getCommentInfo({ commentId: this.editData.itemId });
        }
    },
    methods: {
        async getCommentInfo({ commentId = 1, customerId = 0 }) {
            const { code, data } = await getCommentInfo({ commentId, customerId });
            if (code === 10000 || code === '10000') {
                this.point = data.content;
            }
        },
        onBlur(e) {
            this.getCommentInfo({ commentId: this.formValidate.itemId });
        },
        goBack() {
            this.$router.push({ name: 'Content', params: { tab: '1' } });
        },
        save(name) {
            this.$refs[name].validate(async (valid) => {
                if (valid && this.point != '') {
                    let title = this.point;
                    if (title.length > 30) {
                        title = this.point.substring(0, 30) + '...';
                    }
                    this.formValidate.title = title;
                    const { code, msg } = await setHomePageChoiceness({
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
</style>
