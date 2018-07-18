<template>
  <div id="setExhibition">
    <div class="headWrp clearfix">
      <p class="fl">当前展览：{{exhibitionName||'无'}}</p>

      <div class="fr clearfix">
        <Button class="fl" type="primary" icon="plus" style="margin-left:10px;" @click="showModal">关联展品</Button>
      </div>
    </div>

    <Table :loading="loading" class="mt10" border :columns="columns" :data="dataList"></Table>
    <Page class="paging tr mt10" :current.sync="currentPage" :total="totalItems" show-total show-elevator placement="top" @on-change="onChage"></Page>

    <Modal class="eyChoose" title="添加代表作品" v-model="cIsShowModel" :width="800">
      <div class="mt20">
        <label for="" class="lblWrp">搜索：</label>
        <Input v-model.trim="cSearch" @on-enter="cHanleSearch" placeholder="请输入作品名称" style="width: 250px" />
        <Button type="primary" icon="ios-search" @click="cHanleSearch">查询</Button>
      </div>
      <Table ref="cSelection" class="mt10" border :loading="cLoading" :columns="cColumns" :data="cData"  @on-selection-change="cOnSelectionChange" @on-select-cancel="cOnSelectCancel"></Table>
      <Page class="paging tr mt10" :current.sync="cCurrentPage" :page-size="cPageSize" :total="cTotalItems" show-total show-elevator placement="top" @on-change="cOnChage"></Page>
      <div slot="footer">
        <div class="clearfix">
          <span class="fl sWrp">已选择：{{this.cChoose.length}}展品</span>
          <Button type="text" @click="()=>this.cIsShowModel=false">取消</Button>
          <Button type="primary" @click="cHandleSubmit()">确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Table, Page, Button, Input, InputNumber, Modal } from 'iview'

import {
  setExhibits,
  findByExhibitionId,
  deleteExhibits,
  getProductStatisticsList,
  batchSetExhibits
} from './Content.service'
import EySelectsearch from '../Common/EySelectsearch.vue'

export default {
  name: 'SetExhibition',
  components: {
    Table,
    Page,
    Button,
    Input,
    InputNumber,
    EySelectsearch,
    Modal
  },
  data() {
    return {
      exhibitionName: '',
      loading: true,
      exhibitionId: 0,
      productId: 0,
      sortNum: 0,
      cIsShowModel: false,
      searchInfo: '',
      pageNo: 1,
      pageSize: 10,
      currentPage: 1,
      sortField: '',
      sort: '',
      totalItems: 0,
      dataList: [],

      cSearch: '',
      cLoading: '',
      cColumns: [],
      cData: [],
      cTotalItems: 0,
      cPageSize: 10,
      cPageNo: 1,
      cCurrentPage: 1,
      cChoose: [],
      cColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '编号',
          key: 'id',
          align: 'center',
          width: 100,
          render(h, params) {
            const { id } = params.row.productDto
            return <p>{id}</p>
          }
        },
        {
          title: '作品名称',
          key: 'title',
          align: 'center',
          render(h, params) {
            const { name } = params.row.productDto
            return <p>{name}</p>
          }
        },
        {
          title: '创建时间',
          key: 'gmtCreate',
          align: 'center',
          render(h, params) {
            const { gmtCreate } = params.row.productDto
            return <p>{gmtCreate}</p>
          }
        }
      ],
      columns: [
        {
          title: '艺术品id',
          key: '',
          align: 'center',
          width: 100,
          render: (h, params) => {
            const { productDto } = params.row
            return <p>{productDto.id}</p>
          }
        },
        {
          title: '展品名称',
          key: '',
          align: 'center',
          render: (h, params) => {
            const { productDto } = params.row
            return <p>{productDto.name}</p>
          }
        },
        {
          title: '图片',
          key: '',
          align: 'center',
          render: (h, params) => {
            const { productDto } = params.row
            return (
              <div class="proImg">
                <img src={productDto.imageUrl} />
              </div>
            )
          }
        },
        {
          title: '收藏量',
          key: '',
          align: 'center',
          render: (h, params) => {
            return <p>{params.row.productDto.collectNum}</p>
          }
        },
        {
          title: '评论数',
          key: '',
          align: 'center',
          render: (h, params) => {
            return <p>{params.row.productDto.commentNum}</p>
          }
        },
        {
          title: '浏览量',
          key: '',
          align: 'center',
          render: (h, params) => {
            return <p>{params.row.productDto.readNum}</p>
          }
        },
        {
          title: '作品状态',
          key: '',
          align: 'center',
          render: (h, params) => {
            return (
              <p>
                {params.row.productDto.status == 1 ? (
                  <span>已发布</span>
                ) : (
                  <span style="color:red;">未发布</span>
                )}
              </p>
            )
          }
        },
        {
          title: '排序',
          key: '',
          align: 'center',
          render: (h, params) => {
            const { productDto } = params.row
            return (
              <div>
                <input
                  class="iptNum"
                  type="number"
                  min="0"
                  value={params.row.sortNum}
                  onBlur={e => {
                    e.target.value = e.target.value == '' ? 0 : e.target.value
                  }}
                  onInput={e => {
                    e.target.value = e.target.value.replace(/\-/g, '')
                  }}
                  onKeydown={e => {
                    if (e.keyCode == '13') {
                      this.setExhibits({
                        id: params.row.id,
                        productId: productDto.id,
                        sortNum: e.target.value
                      })
                    }
                  }}
                />
              </div>
            )
          }
        },
        {
          title: '创建时间',
          key: '',
          align: 'center',
          render: (h, params) => {
            return <p>{params.row.productDto.gmtCreate}</p>
          }
        },
        {
          title: '操作',
          key: '',
          align: 'center',
          render: (h, params) => {
            const { row } = params
            return (
              <div class="operateWrp">
                <p>
                  <span class="edit" onClick={() => this.deleteExhibits(row)}>
                    取消关联
                  </span>
                </p>
              </div>
            )
          }
        }
      ],

      exhibitsList: []
    }
  },
  mounted() {
    const { exhibitionId, exhibitionName } = this.$route.query

    if (exhibitionName) {
      this.exhibitionName = exhibitionName
    }
    if (exhibitionId) {
      this.exhibitionId = exhibitionId
    }

    this.getDataList()
  },
  methods: {
    async getDataList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sort: this.sort,
        sortField: this.sortField,
        searchInfo: JSON.stringify({
          exhibitionId: this.exhibitionId
        })
      }
      const { code, msg, data } = await findByExhibitionId(params)
      if (code === 10000 || code === '10000') {
        this.loading = false
        this.dataList = data.exhibitsList
        this.totalItems = data.totalItems
      } else {
        this.$Message.error(msg)
      }
    },
    onChage(pageNo) {
      this.pageNo = pageNo
      this.getDataList()
    },
    getItem({ key }) {
      this.productId = key
    },

    async getRepDataList() {
      let postData = {
        searchInfo: JSON.stringify({
          productName: this.cSearch,
          exhibitionId: this.exhibitionId
        }),
        pageNo: this.cPageNo,
        pageSize: this.cPageSize,
        sortField: '',
        sort: ''
      }
      const { data, code } = await getProductStatisticsList(postData)
      if (code === 10000) {
        this.cData = data.productList
        this.cTotalItems = data.totalItems
        this.cLoading = false
      }
    },

    showModal() {
      this.cIsShowModel = true
      this.cSearch = ''
      this.cPageNo = 1
      this.cCurrentPage = 1
      this.cChoose = []
      this.getRepDataList()
    },
    cOnChage(pageNo) {
      this.cChoose = []
      this.cPageNo = pageNo
      this.getRepDataList()
    },
    cHanleSearch() {
      this.cPageNo = 1
      this.getRepDataList()
    },

    cOnSelectionChange(selection) {
      // console.log(selection, 'onSelectionChange');
      if (selection.length > 0) {
        selection.map((item, i) => {
          if (this.cChoose.indexOf(item.productId) > -1) {
            return
          } else {
            this.cChoose.push(item.productId)
          }
        })
      } else {
        this.cChoose = []
      }
    },
    cOnSelectCancel(selection, row) {
      this.cChoose = this.cChoose.filter(o => o != row.productId)
    },

    cHandleSubmit() {
      const ids = this.cChoose.join(',')
      const exhibitionId = Number(this.$route.query.exhibitionId)
      this.addRelationProduct(exhibitionId, ids)
      this.cIsShowModel = false
      this.currentPage = 1
      this.getDataList()
      // 调用接口插入
      // To do something...
    },
    async addRelationProduct(exhibitionId, productIds) {
      const { code, msg } = await batchSetExhibits({
        exhibitionId: exhibitionId,
        productIds: productIds
      })

      if (code === 10000) {
        setTimeout(() => {
          this.getDataList()
        }, 1000)
        this.cChoose = []
        this.$Message.success(msg)
      } else {
        this.$Message.error(msg)
        this.cChoose = []
      }
    },

    changePage(pageNo) {
      this.pageNo = pageNo
      this.getDataList()
    },
    deleteExhibits(row) {
      const { id } = row
      console.log(id)
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要取消关联吗？</p>`,
        onOk: () => {
          deleteExhibits({ id }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success('删除成功!')
              this.getDataList()
            }
          })
        },
        onCancel: () => {}
      })
    }
  }
}
</script>

<style lang="less">
@import '../../libs/css/common.less';
#setExhibition {
  .ivu-input-number-input {
    text-align: center;
  }
  .iptNum {
    border-radius: 4px;
    border: 1px solid #dddee1;
    width: 80px;
    text-align: center;
    padding: 5px 0;
  }
  .headWrp {
    padding: 20px 0;
    line-height: 32px;
    margin: 0 20px;
  }
  .operateWrp a {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
  .proImg {
    overflow: hidden;
    display: inline-block;
    width: 100px;
    height: 100px;
    position: relative;
    margin: 10px 0;
    img {
      vertical-align: middle;
      position: absolute;
      max-width: 100%;
      max-height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
