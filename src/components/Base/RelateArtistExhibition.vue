<template>
  <div >
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem to="/Base">艺术家</BreadcrumbItem>
      <BreadcrumbItem>关联艺术家展览</BreadcrumbItem>
    </Breadcrumb>

    <Row type="flex" justify="space-between" align="middle">
          <Col span="4"><Button type="primary"  class="mt10" @click="deleteBatch">批量取消</Button></Col>
          <Col span="3" style="text-align:right"><Button type="primary" icon="plus" class="add" @click="showModal">关联展览</Button></Col>
      </Row>
    <Table ref="selection" class="mt10" border :loading="loading" :columns="columns" :data="dataList" @on-sort-change="onSortChange"></Table>
    <Page class="paging tr mt10" :current.sync="pageNo" :total="totalItems" show-total show-elevator  placement="top" @on-change="onChage"></Page>

    <!-- EyChoose begin-->
    <Modal class="eyChoose" title="关联艺术家展览" v-model="cIsShowModel" :width="800">
      <div class="mt20">
        <label for="" class="lblWrp">搜索：</label>
        <Input v-model.trim="cSearch" @on-enter="cHanleSearch" placeholder="请输入展览名称" style="width: 250px" />
        <Button type="primary" icon="ios-search" @click="cHanleSearch">查询</Button>
      </div>
      <Table ref="cSelection" class="mt10" border :loading="cLoading" :columns="cColumns" :data="cData"  @on-selection-change="cOnSelectionChange" @on-select-cancel="cOnSelectCancel"></Table>
      <Page class="paging tr mt10" :current.sync="cCurrentPage" :page-size="cPageSize" :total="cTotalItems" show-total show-elevator placement="top" @on-change="cOnChage"></Page>
      <div slot="footer">
        <div class="clearfix">
          <span class="fl sWrp">已选择：{{this.cChoose.length}}展览</span>
          <Button type="text" @click="()=>this.cIsShowModel=false">取消</Button>
          <Button type="primary" @click="cHandleSubmit()">确定</Button>
        </div>
      </div>
    </Modal>
    <!-- EyChoose end-->
  </div>

</template>

<script>
import {
  Table,
  Page,
  Button,
  Input,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col,
  Modal
} from 'iview'
import {
  getArtistExhibitionList,
  getExhibitionList,
  deleteArtistExhibition,
  setArtistExhibition
} from './Base.service'
export default {
  name: 'relateArtistExhibition',
  components: {
    Table,
    Page,
    Button,
    Input,
    Breadcrumb,
    BreadcrumbItem,
    Row,
    Col,
    Modal
  },
  data() {
    let _this = this
    return {
      artistId: Number(this.$route.query.artistId),
      pageNo: 1,
      pageSize: 10,
      sortField: '',
      sort: '',
      totalItems: 0,
      productName: '',
      dataList: [],
      loading: true,
      cIsShowModel: false,
      cSearch: '',
      cData: [],
      cLoading: false,
      cTotalItems: 0,
      cPageNo: 1,
      cPageSize: 10,
      cSelectAll: false,
      cCurrentPage: 1,
      cChoose: [],
      cCurIds: [],
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
          width: 100
        },
        {
          title: '作品名称',
          key: 'exhibitionName',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'gmtCreate',
          align: 'center'
        }
      ],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '展览编号',
          key: 'exhibitionId', 
          align: 'center',
          width: 100
        },
        {
          title: '展览标题',
          key: 'name',
          align: 'center',
          render(h, params) {
            const { exhibitionName } = params.row
            return <p>{exhibitionName}</p>
          }
        },
        {
          title: '展览时间',
          key: 'name',
          align: 'center',
          render(h, params) {
            const { exhibitionStartTime,exhibitionEndTime } = params.row
            return <p>{exhibitionStartTime} ~ {exhibitionEndTime}</p>
          }
        },
        {
          title: '创建时间',
          key: 'gmtCreate',
          align: 'center',
          render(h, params) {
            const { gmtCreate } = params.row
            return <p>{gmtCreate}</p>
          }
        },
        {
          title: '操作',
          key: 'artistId',
          align: 'center',
          render(h, params) {
            const { id } = params.row
            return (
              <div class="operateWrp">
                <p>
                  <span class="edit" onClick={() => _this.cancel(id)}>
                    取消关联
                  </span>
                </p>
              </div>
            )
          }
        }
      ]
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    //获取数据列表
    async getDataList() {
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        searchInfo: JSON.stringify({
          artistId: this.artistId
        }),
        sort: '',
        sortField: ''
      }
      console.log(params)
      const { code, msg, data } = await getArtistExhibitionList(params)
      if (code == 10000) {
        this.dataList = data.data
        this.totalItems = data.totalItems
        this.loading = false
      } else {
        this.$Message.error(msg)
        this.loading = false
      }
    },

    async getRepDataList() {
      const params = {
        pageNo: this.cPageNo,
        pageSize: this.cPageSize,
        searchInfo: JSON.stringify({
          exhibitionName: this.cSearch
        }),
        sort: 'DESC',
        sortField: 'gmtCreate'
      }
      const { code, msg, data } = await getExhibitionList(params)
      if (code == 10000) {
        this.cData = data.exhibitionList
        this.cTotalItems = data.totalItems
        this.loading = false
      } else {
        this.$Message.error(msg)
        this.loading = false
      }
    },

    async addProduct(exhibitionIds) {
      const { code, msg } = await setArtistExhibition({
        artistId: this.artistId,
        exhibitionIds: exhibitionIds
      })

      if (code === 10000) {
        setTimeout(() => {
          this.pageNo = 1
          this.getDataList()
        }, 500)

        this.cChoose = []
        this.$Message.success(msg)
      } else {
        this.$Message.error(msg)
        this.cChoose = []
      }
    },
    showModal() {
      this.cIsShowModel = true
      this.cSearch = ''
      this.cChoose = []
      this.cPageNo = 1
      this.cCurrentPage = 1
      this.getRepDataList()
    },
    deleteBatch() {
      const selection = this.$refs.selection.getSelection()
      if (selection.length > 0) {
        const arr = []
        console.log(selection)
        selection.map((item, i) => {
          arr.push(item.id)
        })
        const ids = arr.join(',')

        this.cancel(ids)
      } else {
        this.$Message.warning('请选择要取消关联的作品')
      }

      // To do something...
    },
    onChage(pageNo) {
      this.pageNo = pageNo
      this.getDataList()
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getDataList()
    },
    cancel(id) {
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要取消关联吗？</p>`,
        onOk: () => {
          this.delete(id)
        }
      })
    },
    async delete(ids) {
      const { code, msg } = await deleteArtistExhibition({
        ids: ids
      })
      if (+code === 10000) {
        setTimeout(() => {
          this.pageNo = 1
          this.getDataList()
        }, 500)
      } else {
        this.$Message.error(msg)
      }
    },
    onSortChange({ column, key, order }) {
      this.sort = 'normal' == order ? '' : (order + '').toUpperCase()
      this.getDataList()
    },
    getItem({ key, value }) {
      console.log(key)
      console.log(value)
    },
    cOnSelectionChange(selection) {
      // console.log(selection, 'onSelectionChange');
      if (selection.length > 0) {
        selection.map((item, i) => {
          if (this.cChoose.indexOf(item.id) > -1) {
            return
          } else {
            this.cChoose.push(item.id)
          }
        })
      } else {
        this.cChoose = []
      }
      console.log(this.cChoose)
    },
    cOnSelectCancel(selection, row) {
      this.cChoose = this.cChoose.filter(o => o != row.id)
    },
    cGetItem({ key, value }) {},
    cOnChage(pageNo) {
      this.cPageNo = pageNo
      this.cChoose = []
      this.getRepDataList()
    },
    cHanleSearch() {
      this.cChoose = []
      this.cPageNo = 1
      this.cCurrentPage = 1
      this.getRepDataList()
    },
    cHandleSubmit() {
      const ids = this.cChoose.join(',')
      console.log(ids)

      this.addProduct(ids)
      this.cIsShowModel = false
      setTimeout(() => {
        this.pageNo = 1
        this.getDataList()
      }, 500)

      // 调用接口插入
      // To do something...
    },
    isInArray(arr, value) {
      for (var i = 0; i < arr.length; i++) {
        if (value == arr[i]) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style lang="less">
#city {
  .copyWrp {
    margin: 10px 0;
  }
}
</style>
