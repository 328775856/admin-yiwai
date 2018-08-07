<template>
    <div id='production'>
        <Breadcrumb separator=">" class="breadCrumb">
            <BreadcrumbItem>博物官</BreadcrumbItem>
            <BreadcrumbItem>作品</BreadcrumbItem>
            <BreadcrumbItem>{{labelList[0]}}</BreadcrumbItem>
        </Breadcrumb>

        <!-- 展览和馆藏 -->
        <Tabs type="card" class="tab" :value="0">
            <TabPane :label="labelList[0]">
                <div class="collectionProduct">
                    <fieldset class="fieldset">
                        <legend>查询条件</legend>
                        <div class = "search">
                            <div>
                                <label for = "">作品名称:</label>
                                <Input v-model="exhibitionName" placeholder = "请输入名称关键字" style = "width:180px"></Input>
                                <Button type = "primary" icon = "ios-search" @click = "search">查询</Button>
                            </div>
                        </div>
                    </fieldset>
                    <Table :data="productionData.data" :columns="productionColums" border :loading="loading"></Table>
                    <div style="margin: 10px;overflow: hidden">
                        <div style="float: right;">
                            <Page class="paging tr mt  10" :current.sync="currentPageNoExhibition" :total="productionData.totalItems" show-total show-elevator :page-size-opts="[10,20,30]" placement="top" @on-change="onChangeTab"></Page>
                        </div>
                    </div>
                </div>
            </TabPane>
        </Tabs>
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
  Select,
  Option,
  Input
} from 'iview'
import { getBwgAntiqueList } from './Index.service.js'
export default {
  components: {
    Breadcrumb,
    BreadcrumbItem,
    Tabs,
    TabPane,
    Button,
    Table,
    Page,
    Select,
    Option,
    Input
  },
  data() {
    let that = this
    return {
      labelList: ['馆藏'],
      productionData: {},
      exhibitionName: '',
      currentPageNoExhibition: 1,
      museumId: '',
      antiqueName: '',
      loading: true,
      currentPage: 1,
      totalItems: 0,
      pageNo: 1,
      pageSize: 10,
      productionColums: [
        {
          title: '编号',
          key: 'id',
          align: 'center'
          // width: 70
          // render(h, params) {
          //   const id = params.row.id;
          //   return (
          //     <div>EXH00000{id}</div>
          //   )
          // }
        },
        {
          title: '名称',
          key: 'name',
          align: 'center'
          // ellipsis: true
        },
        {
          title: '作者',
          key: 'creator',
          align: 'center'
          // ellipsis: true
        },
        {
          title: '材料',
          key: 'material',
          align: 'center'
          // ellipsis: true
        },
        {
          title: '图片',
          key: 'imageUrl',
          width: '200',
          render: (h, params) => {
            const image = params.row.imageUrl
            return (
              <div
                class="headImg"
                style={`background:url(${image}?imageView2/1/w/150/h/150/q/50) no-repeat center;background-size: contain;`}
              />
            )
          },
          align: 'center',
          ellipsis: true
        },
        {
          title: '朝代',
          key: 'dateDesc',
          align: 'center'
          // ellipsis: true
        },
        {
          title: '详情',
          render: function(h, params) {
            let temp = params.row.richDetail
              ? params.row.richDetail
              : params.row.detail
            return (
              <div
                onClick={() => {
                  that.$Modal.info({
                    title: '简介详情',
                    content: temp,
                    width: 700
                  })
                }}
              >
                {temp.slice(0, 20) + '...'}
              </div>
            )
          },
          align: 'center'
          // ellipsis: true
        },
        {
          title: '尺寸',
          key: 'dimensions',
          align: 'center'
          // ellipsis: true
        },
        {
          title: '出土时间',
          key: 'excavatedDate',
          align: 'center'
          // ellipsis: true
        },
        {
          title: '出土地点',
          key: 'excavatedPlace',
          align: 'center'
          // ellipsis: true
        },
        {
          title: '音频url',
          key: 'audioUrl',
          align: 'center'
          // ellipsis: true
        }
      ]
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    async getDataList() {
      const params = {
        searchInfo: JSON.stringify({
          museumId: this.$route.query.id,
          antiqueName: this.antiqueName
        }),
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sortField: '',
        sort: ''
      }
      const { code, msg, data } = await getBwgAntiqueList(params)
      if (code === 10000 || code === '1000') {
        this.loading = false
        this.productionData = data
        this.totalItems = data.totalPages
      } else {
        this.$Message.error(msg)
      }
    },
    onChangeTab(pageNo) {
      this.pageNo = pageNo
      this.getDataList()
    },
    async search() {
      const params = {
        searchInfo: JSON.stringify({
          museumId: this.$route.query.id,
          antiqueName: this.exhibitionName
        }),
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sortField: '',
        sort: ''
      }
      const { code, msg, data } = await getBwgAntiqueList(params)
      if (code === 10000 || code === '10000') {
        this.loading = false
        this.productionData = data
        this.totalItems = data.totalPages
      } else {
        this.$Message.error(msg)
      }
    }
  }
}
</script>

<style lang="less">
.headImg {
  width: 150px;
  height: 150px;
}
</style>
