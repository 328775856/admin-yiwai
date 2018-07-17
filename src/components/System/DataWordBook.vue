<template>
    <div id="dataWordBook">
        <fieldset class="fieldset">
            <legend>查询条件</legend>
            <div class="search">
                <div>
                    <label for="">字典组名：</label>
                    <Input v-model="dictionaryGroup" placeholder="输入字典组名" style="width: 180px" />
                </div>
                <div>
                    <label for="">字典key：</label>
                    <Input v-model="dictionaryKey" placeholder="输入字典key" style="width: 180px" />
                </div>
                <Button type="primary" icon="ios-search" @click="search">查询</Button>
            </div>
        </fieldset>
        <Button type="primary" icon="plus" class="add" @click="add">新增字典项</Button>
        <Table :data="dataWordBook.data" :columns="wordBookColumns" border></Table>
        <Modal v-model="modal" title="新增字典项" width="460">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" :inline="true">
                <FormItem label="字典组名" prop="dictionaryGroup" class="formItem80">
                    <Input v-model="formValidate.dictionaryGroup" placeholder=" 字典组名为3~20个字符" clearable :maxlength="20" />
                </FormItem>
                <FormItem label="字典key" prop="dictionaryKey" class="formItem80">
                    <Input v-model="formValidate.dictionaryKey" placeholder=" 字典key为3~20个字符" clearable :maxlength="20" />
                </FormItem>
                <FormItem label="字典值" prop="dictionaryValue" class="formItem80">
                    <Input v-model="formValidate.dictionaryValue" placeholder="  字典值为3~20个字符" clearable :maxlength="20" />
                </FormItem>
                <FormItem label="排序" prop="sortNum" class="formItem80">
                    <Input v-model="formValidate.sortNum" clearable number/>
                </FormItem>
                <FormItem label="状态" prop="status" class="formItem80">
                    <RadioGroup v-model="formValidate.status" v-for="(item,index) in addStatus" :key="index">
                        <Radio :label="item.value">{{item.name}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="()=>this.modal=false">取消</Button>
                <Button type="primary" @click="setDictionary">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { Button, Table, Input, Modal, Form, FormItem, RadioGroup, Radio } from 'iview';
import { setDictionary } from './System.service';
import { getDictionaryList } from 'libs/js/api.js';

export default {
    name: 'DataWordBook',
    components: { Button, Table, Input, Modal, Form, FormItem, RadioGroup, Radio },
    data() {
        const _this = this;
        return {
            /* 数据字典--start */
            dictionaryGroup: '',
            dictionaryKey: '',
            addStatus: [
                { value: 1, name: '有效' },
                { value: 0, name: '无效' }
            ],
            dataWordBook: {},
            edit: false,
            modal: false,
            wordBookColumns: [
                {
                    title: '字典组名',
                    key: 'dictionaryGroup',
                    align: 'center',
                },
                {
                    title: '字典key',
                    align: 'center',
                    key: 'dictionaryKey',
                },
                {
                    title: '字典值',
                    align: 'center',
                    key: 'dictionaryValue',
                },
                {
                    title: '排序',
                    align: 'center',
                    key: 'sortNum',
                },
                {
                    title: '状态',
                    align: 'center',
                    key: 'status',
                    render: (h, params) => {
                        const status = params.row.status;
                        return (
                            <div>{status == 1 ? '有效' : '无效'}</div>
                        )
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'operate',
                    render(h, params) {
                        return (
                            <div>
                                <span onClick={() => {
                                    _this.formValidate = {
                                        id: this.row.id,
                                        dictionaryGroup: this.row.dictionaryGroup,
                                        dictionaryKey: this.row.dictionaryKey,
                                        dictionaryValue: this.row.dictionaryValue,
                                        sortNum: this.row.sortNum,
                                        status: this.row.status
                                    };
                                    _this.modal = true;
                                    _this.edit = true;
                                }} class="edit">修改</span>
                            </div>
                        )
                    }
                }
            ],
            formValidate: {
                id: 0,
                dictionaryGroup: '',
                dictionaryKey: '',
                dictionaryValue: '',
                sortNum: 0,
                status: 1,
            },
            ruleValidate: {
                dictionaryGroup: [
                    { required: true, message: '字典组名不能为空', trigger: 'blur' }
                ],
                dictionaryKey: [
                    { required: true, message: '字典key不能为空', trigger: 'change' },
                ],
                dictionaryValue: [
                    { required: true, message: '字典值不能为空', trigger: 'blur' },
                ],
                sortNum: [
                    { type: 'number', required: true, message: '字典排序不能为空', trigger: 'blur' },
                ],
                status: [
                    { type: 'number', required: true, message: '字典状态不能为空', trigger: 'change' },
                ]
            },
            /* 数据字典--end */
        }
    },
    mounted() {
        this.getDictionaryList({});
    },
    methods: {
        add() {
            this.modal = true;
        },
        cancel() {
            // this.$Message.warning('Clicked cancel');
        },
        search() {
            this.getDictionaryList({ dictionaryGroup: this.dictionaryGroup, dictionaryKey: this.dictionaryKey })
        },
        async getDictionaryList({ dictionaryGroup = '', dictionaryKey = '', pageNo = 1, pageSize = 10 }) {
            const { data } = await getDictionaryList({ dictionaryGroup, dictionaryKey, pageNo, pageSize });
            this.dataWordBook = data;
        },
        setDictionary() {
            this.$refs['formValidate'].validate(async (valid) => {
                if (valid) {
                    const { code, msg } = await setDictionary({ dictionaryInfo: JSON.stringify(this.formValidate) });
                    if (code === 10000 || code === '10000') {
                        if (!this.edit) {
                            this.$Message.success('新增成功');
                            this.$refs['formValidate'].resetFields();
                        } else {
                            this.$Message.success('编辑成功');
                            this.$refs['formValidate'].resetFields();
                        }
                        this.getDictionaryList({});
                        this.modal=false;
                    }
                } else {
                    this.$Message.error('必填字段不能为空!');
                }
            })
        },
    }
}
</script>
<style lang="less">
@import "../../libs/css/constant.less";
@import "../../libs/css/common.less";

#dataWordBook {
}
</style>
