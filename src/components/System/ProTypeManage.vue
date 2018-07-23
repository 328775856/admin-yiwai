<template>
    <div id="proTypeManage">
        <div class="artProduct">
            <Button type="primary" icon="plus" class="add" @click="add">新增品类</Button>
            <Table :data="productTypeList" :columns="productTypeColumns" border></Table>
        </div>
        <Modal v-model="modal" title="新增品类" width="460">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" :inline="true">
                <FormItem label="品类名称" prop="name" class="formItem80">
                    <Input v-model="formValidate.name" placeholder="品类名称为3~10个字符" clearable :maxlength="30" />
                </FormItem>
                <FormItem label="父级品类" prop="parentId" class="formItem80">
                    <Select v-model="formValidate.parentId" style="width:180px">
                        <Option v-for="(item,index) in parentSort" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="排序" prop="sortNo" class="formItem80">
                    <Input v-model="formValidate.sortNo" clearable number/>
                </FormItem>
                <FormItem label="状态" prop="status" class="formItem80">
                    <RadioGroup v-model="formValidate.status" v-for="(item,index) in addStatus" :key="index">
                        <Radio :label="item.value">{{item.name}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="()=>this.modal=false">取消</Button>
                <Button type="primary" @click="setProductType">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { Button, Table, Page, Select, Option, Input, Modal, Form, FormItem, RadioGroup, Radio, Row, Col } from 'iview';
import { getProductTypeList } from 'libs/js/api.js';
import { setProductType, deleteProductType } from './System.service';

export default {
    name: 'ProTypeManage',
    components: { Button, Table, Page, Select, Option, Input, Modal, Form, FormItem, RadioGroup, Radio, Row, Col },
    data() {
        const _this = this;
        return {
            /* 品类管理--start */
            cardList: [{ value: 3, name: '全部状态' }, { value: 2, name: '作品卡片' }, { value: 1, name: '观点卡片' }, { value: 0, name: '商品卡片' }],
            edit: false,
            productList: [],
            productTypeList: [],
            modal: false,
            productTypeColumns: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        const children = params.row.children;
                        const childrenColumns = [
                            {
                                width: 50
                            },
                            {
                                title: '品类名称',
                                key: 'name',
                                align: 'center',
                            },
                            {
                                title: '排序',
                                align: 'center',
                                key: 'sortNo',
                            },
                            {
                                title: '状态',
                                align: 'center',
                                key: 'status',
                                render: (h, params) => {
                                    const status = params.row.status;
                                    return (
                                        <div>
                                            {status === 0 ? '隐藏' : '显示'}
                                        </div>
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
                                                    name: this.row.name,
                                                    level: this.row.level,
                                                    id: this.row.id,
                                                    parentId: this.row.parentId,
                                                    sortNo: this.row.sortNo,
                                                    status: this.row.status
                                                };
                                                _this.modal = true;
                                                _this.edit = true;

                                            }} class="edit">修改</span>
                                        </div>
                                    )
                                }
                            }
                        ];
                        if (children) {
                            return (
                                <Table data={children} columns={childrenColumns} show-header={false} class="childrenTable" border={false}></Table>
                            )
                        }
                    }
                },
                {
                    title: '品类名称',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '排序',
                    align: 'center',
                    key: 'sortNo',
                },
                {
                    title: '状态',
                    align: 'center',
                    key: 'status',
                    render: (h, params) => {
                        const status = params.row.status;
                        return (
                            <div>
                                {status === 0 ? '隐藏' : '显示'}
                            </div>
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
                                    console.log(this.row)
                                    _this.formValidate = {
                                        name: this.row.name,
                                        level: this.row.level,
                                        id: this.row.id,
                                        parentId: this.row.parentId,
                                        sortNo: this.row.sortNo,
                                        status: this.row.status
                                    };
                                    _this.modal = true;
                                    _this.edit = true;
                                }} class="edit">修改</span>
                              <span  onClick={() => {
                              _this.$Modal.confirm({
                                  title: '系统提示',
                                  content: `<p>确定删除吗？</p>`,
                                  onOk: async ()=>{
                                     const { code, msg } = await  deleteProductType({productTypeId: this.row.id})
                                    if(code === 10000){
                                      _this .getProductTypeList({level:0})
                                    }
                                  }
                                })
                             }} class="edit">删除</span>
                            </div>
                        )
                    }
                }
            ],
            parentSort: [],
            addStatus: [{ value: 1, name: '显示' }, { value: 0, name: '隐藏' }],
            formValidate: {
                name: '',
                id: 0,
                level: 0,
                parentId: 0,
                sortNo: 0,
                status: 1
            },
            ruleValidate: {
                name: [
                    { required: true, message: '品类名称不能为空', trigger: 'blur' }
                ],
                parentId: [
                    { type: 'number', required: true, message: '父级品类不能为空', trigger: 'change' },
                ],
                sortNo: [
                    { type: 'number', required: true, message: '品类排序不能为空', trigger: 'blur' },
                ],
                status: [
                    { type: 'number', required: true, message: '品类状态不能为空', trigger: 'change' },
                ]
            },
            /* 品类管理--end */
        }
    },
    watch: {
        'formValidate.parentId'(v, o) {
            if (v != 0) {
                this.formValidate.level = 1;
            }
        }
    },
    mounted() {
        this.getProductTypeList({});
    },
    methods: {
        add() {
            this.modal = true;
            this.edit = false;//为新增状态
            this.formValidate = {
                name: '',
                id: 0,
                level: 0,
                parentId: 0,
                sortNo: 0,
                status: 1
            }
        },
        cancel() {
            // this.$Message.warning('Clicked cancel');
        },
        async getProductTypeList({ level = 0 }) {
            const { data } = await getProductTypeList({ level });
            this.productTypeList = data.productTypeList;
            if (this.productTypeList.length != 0) {
                this.productList = this.productTypeList;
                this.parentSort = [{ name: '创建顶级品类', id: 0 }];//初始化
                this.productTypeList.forEach((item, index) => {
                    this.parentSort.push({ name: item.name, id: item.id });
                })
            }
        },
        async setProductType() {
            this.$refs['formValidate'].validate(async (valid) => {
                if (valid) {
                    const { code, msg } = await setProductType({ productTypeInfo: JSON.stringify(this.formValidate) });
                    if (code === 10000 || code === '10000') {
                        if (!this.edit) {
                            this.$Message.success('新增成功');
                            this.$refs['formValidate'].resetFields();

                        } else {
                            this.$Message.success('编辑成功');
                            this.$refs['formValidate'].resetFields();
                        }
                        this.modal = false;
                        this.getProductTypeList({});
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

#proTypeManage {
}
</style>
