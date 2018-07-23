<template>
  <div id="base">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>基础数据</BreadcrumbItem>
      <BreadcrumbItem>{{labelList[index]}}</BreadcrumbItem>
    </Breadcrumb>
    <!-- 三个tab页start -->
    <Tabs type="card" @on-click="getName" class="tab" :value="index">
      <!-- tab-2 开始 -->
      <TabPane :label="labelList[0]" class="tab">
        <div class="artProduct">
          <fieldset class="fieldset">
            <legend>查询条件</legend>
            <div class="search">
              <div>
                <label for="">艺术家姓名：</label>
                <Input v-model="artistName" placeholder="输入艺术家姓名" style="width: 180px" />
              </div>
              <div>
                <label for="">艺术品名称：</label>
                <Input v-model="artProductName" placeholder="输入艺术品名称" style="width: 180px" />
              </div>
              <Button type="primary" icon="ios-search" @click="search">查询</Button>
            </div>
          </fieldset>
          <Button type="primary" icon="plus" class="add" @click="add">新增投票作品</Button>
          <Table :data="productList" :columns="artProductcolumns" border :loading="loading"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page class="paging tr mt10" :current.sync="currentPageProduct" :total="totalItems" show-total show-elevator  placement="top" @on-change="onChangeTab2"></Page>
            </div>
          </div>
        </div>
      </TabPane>

      <Modal title="添加投票作品" v-model="isShowModel" width="400">
        <Form class="mt10" ref="formValidate" :model="productFormData" :rules="ruleValidate" :label-width="80">
          <FormItem label="作品编号" prop="productId">
            <Input v-model="productFormData.productId" placeholder=""  />
            <router-link to="Base?tab=1" target="_blank">查看作品列表</router-link>
          </FormItem>
          <FormItem label="机构编号" prop="organNumber">
            <Input v-model="productFormData.organNumber" placeholder=""  />
          </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="()=>this.isShowModel=false">取消</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
      </div>
    </Modal>
      <!-- tab-2 结束 -->
    </Tabs>
    <!-- 三个tab页end -->
  </div>
</template>

<script>
import {
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabPane,
  Button,
  Table,
  Page,
  Form,
  FormItem,
  Input,
  Icon,
  Modal,
  Poptip
} from 'iview'
import {
  getYouthProductList,
  addYouthProduct,
  deleteYouthProduct,
  setPeachNum
} from '../Activity.service.js'

export default {
  name: 'Base',
  components: {
    Breadcrumb,
    BreadcrumbItem,
    Tabs,
    TabPane,
    Button,
    Form,
    FormItem,
    Table,
    Page,
    Input,
    Modal,
    Poptip,
    Icon
  },
  data() {
    let _this = this
    return {
      index: 0,
      loading: true,
      isShowModel: false,
      labelList: ['青年100'],
      artistName: '',
      artProductName: '',
      totalItems: 0,
      productList: [],
      pPageNo: 1,
      pPageSize: 10,
      currentPageProduct: 1,
      productFormData: {
        id: 0,
        productId: '',
        organNumber: ''
      },

      ruleValidate: {
        productId: [
          { required: true, message: '作品编号不能为空', trigger: 'blur' }
        ],
        organNumber: [
          { required: true, message: '机构编号不能为空', trigger: 'blur' }
        ]
      },
      artProductcolumns: [
        {
          title: '作品编号',
          key: 'productId',
          align: 'center',
          width: 70,
          render(h, params) {
            const { productId } = params.row
            return <div>{productId}</div>
          }
        },
        {
          title: '机构编号',
          key: 'id',
          align: 'center',
          width: 70,
          render(h, params) {
            const { organNumber } = params.row
            return <div>{organNumber}</div>
          }
        },
        {
          title: '艺术品名称',
          key: 'name',
          align: 'center',
          width: 150,
          render(h, params) {
            const { name } = params.row.productDto
            return <div>{name}</div>
          }
        },
        {
          title: '图片',
          align: 'center',
          key: 'imageUrl',
          render(h, params) {
            const { imageUrl } = params.row.productDto
            return (
              <div
                class="headImg"
                style={`background:url(${imageUrl}?imageView2/1/w/175/h/100/q/50) no-repeat center;background-size: contain;`}
              />
            )
          }
        },
        {
          title: '作者',
          align: 'center',
          key: 'artistName',
          render(h, params) {
            const { artistName } = params.row.productDto
            return <div>{artistName}</div>
          }
        },
        {
          title: '桃子数量',
          align: 'center',
          key: 'peachNum',
          sortable: true,
          sortType: '',
          render(h, params) {
            let { id, peachNum } = params.row
            return (
              <Poptip placement="right">
                <a>
                  {peachNum} <Icon type="ios-compose-outline" />
                </a>
                <div slot="content">
                  <input
                    class="input"
                    min="1"
                    type="number"
                    value={peachNum}
                    onInput={e => {
                      peachNum = parseInt(e.target.value)
                    }}
                  />
                  <span
                    class="input-save"
                    onClick={e => {
                      let postData = {
                        youthId: id,
                        peachNum: peachNum
                      }
                      _this.setpeachNum(postData)
                    }}
                  >
                    保存
                  </span>／
                  <span
                    class="input-cancel"
                    onClick={e => {
                      _this.getYouthProductList()
                    }}
                  >
                    取消
                  </span>
                </div>
              </Poptip>
            )
          }
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'gmtCreate',
          width: 100,
          render(h, params) {
            const { gmtCreate } = params.row.productDto
            return <div>{gmtCreate}</div>
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'operate',
          render: (h, params) => {
            const { id, productId, organNumber } = params.row
            return (
              <div>
                <span onClick={() => _this.edit(params.row)} class="edit">
                  编辑
                </span>
                <span
                  class="edit"
                  onClick={() => {
                    _this.confirmDel(id)
                  }}
                >
                  删除
                </span>
                <span
                  class="edit"
                  onClick={() =>
                    this.$router.push({
                      path: '/Comment',
                      query: { productId }
                    })
                  }
                >
                  查看评论
                </span>
              </div>
            )
          }
        }
      ],
      artProductData: {}
    }
  },
  created() {},
  mounted() {
    this.getYouthProductList()
  },
  methods: {
    getName(name) {
      this.index = name
    },
    add() {
      this.isShowModel = true
      this.productFormData = {
        id: 0,
        productId: '',
        organNumber: ''
      }
    },
    search() {
      this.pPageNo = 1
      this.currentPageProduct = 1
      this.getYouthProductList()
    },
    onChangeTab2(pageNo) {
      this.pPageNo = pageNo
      this.getYouthProductList()
    },

    async setpeachNum(postData) {
      const { code, msg } = await setPeachNum(postData)
      if (+code === 10000) {
        this.$Message.success(msg)
        this.getYouthProductList()
      } else {
        this.$Message.error(msg)
      }
    },

    async getYouthProductList() {
      const params = {
        pageNo: this.pPageNo,
        pageSize: this.pPageSize,
        searchInfo:
          this.artistName !== ''
            ? this.artistName
            : this.artProductName !== '' ? this.artProductName : ''
      }
      const { code, data } = await getYouthProductList(params)
      if (code === 10000) {
        this.productList = data.youthProductList
        this.totalItems = data.totalItems
        this.loading = false
      }
    },

    edit(data) {
      const { id, productId, organNumber } = data
      this.productFormData = {
        id: id.toString(),
        productId: productId.toString(),
        organNumber: organNumber.toString()
      }
      this.isShowModel = true
    },

    confirmDel(id) {
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>确定要删除该投票作品吗？</p>',
        onOk: () => {
          this.delYouthProduct(id)
        }
      })
    },

    async delYouthProduct(id) {
      let postData = {
        youthId: id
      }

      const { code, msg } = await deleteYouthProduct(postData)
      if (+code === 10000) {
        this.$Message.success(msg)
        setTimeout(() => {
          this.pPageNo = 1
          this.getYouthProductList()
        }, 500)
      } else {
        this.$Message.error(msg)
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          let postData = {
            youthProductInfo: JSON.stringify(this.productFormData)
          }
          console.log(postData)
          const { code, msg } = await addYouthProduct(postData)
          if (+code === 10000) {
            this.$Message.success(msg)
            setTimeout(() => {
              this.getYouthProductList()
            }, 500)
            this.isShowModel = false
          } else {
            this.$Message.error(msg)
          }
        }
      })
    }
  }
}
</script>
<style lang="less">
@import '../../../libs/css/constant.less';
@import '../../../libs/css/common.less';

#base {
  .tab {
    .artPeople,
    .artProduct {
      .headImg {
        height: 60px;
      }
      .edit {
        margin: 0;
      }
    }
  }

  .input {
    border: 1px solid #57a3f3;
    width: 50px;
    border-radius: 4px;
    width: 60px;
    height: 32px;
    line-height: 1.5;
    text-align: center;
    padding: 4px 7px;
    font-size: 12px;
    transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
    &:focus {
      border-color: #57a3f3;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    }
  }

  .input-save {
    color: #57a3f3;
    display: inline-block;
    margin-left: 5px;
    cursor: pointer;
  }
  .input-cancel {
    display: inline-block;
  }
}
</style>
