<template>
  <div id="base">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>基础数据</BreadcrumbItem>
      <BreadcrumbItem>{{labelList[index]}}</BreadcrumbItem>
    </Breadcrumb>
    <!-- 三个tab页start -->
    <Tabs type="card" @on-click="getName" class="tab" :value="index">
      <!-- tab-1 开始 -->
      <TabPane :label="labelList[0]">
        <div class="artPeople">
          <fieldset class="fieldset">
            <legend>查询条件</legend>
            <div class="search">
              <div>
                <label for="">姓名：</label>
                <Input v-model="artName" placeholder="输入艺术家姓名" clearable style="width: 180px" />
                <Button type="primary" icon="ios-search" @click="search('art')">查询</Button>
              </div>
              <EyFilter :data="[{key:'',value:'全部',isActive:true},{key:1,value:'中国'},{key:2,value:'西方'}]" @get-item="getItem"></EyFilter>
            </div>
          </fieldset>
          <Button type="primary" icon="plus" class="add" @click="add('AddArt')">新增艺术家</Button>
          <Table :data="artData.artistList" :columns="artPeoplecolumns" border :loading="loading1"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page class="paging tr mt10" :current.sync="currentPageNoArt" :total="artData.totalItems" show-total show-elevator :page-size-opts="[10,20,30]" placement="top" @on-change="onChangeTab1" @on-page-size-change="onPageSizeChangeTab1"></Page>
            </div>
          </div>
        </div>
      </TabPane>
      <!-- tab-1 结束 -->

      <!-- tab-2 开始 -->
      <TabPane :label="labelList[1]" class="tab">
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
              <div>
                <label for="">发布状态：</label>
                <Select v-model="releaseStatus" style="width:180px" placeholder="全部状态">
                  <Option v-for="(item,index) in statusList" :value="item.value" :key="index">{{ item.name }}</Option>
                </Select>
              </div>
              <Button type="primary" icon="ios-search" @click="search('artProduct')">查询</Button>
            </div>
          </fieldset>
          <Button type="primary" icon="plus" class="add" @click="add('AddArtProduct')">新增艺术品</Button>
          <Table :data="artProductData.productList" :columns="artProductcolumns" border :loading="loading2"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page class="paging tr mt10" :current.sync="currentPageNoProduct" :total="artProductData.totalItems" show-total show-elevator :page-size-opts="[10,20,30]" placement="top" @on-change="onChangeTab2" @on-page-size-change="onPageSizeChangeTab2"></Page>
            </div>
          </div>
        </div>
      </TabPane>
      <!-- tab-2 结束 -->

      <TabPane :label="labelList[2]" class="tab">
        <div class="artProduct">
          <fieldset class="fieldset">
            <legend>查询条件</legend>
            <div class="search">
              <div>
                <label for="">查询条件</label>
                <Select v-model="queryCondition" placeholder="全部" style="width:100px">
                  <Option v-for="(item,index) in queryList" :value="item.value" :key="index">{{ item.name }}</Option>
                </Select>
                <Input v-model="queryName"  clearable style="width:180px;" placeholder="搜索关键字"></Input>
              </div>
            </div>
            <div style="padding-bottom:30px;">
              <Button type="primary" icon="ios-search" @click="search('organ')">筛选</Button>
              <Button type="default" @click="reset">清空筛选条件</Button>
            </div>
          </fieldset>
          <Button type="primary" icon="plus" class="add" @click="add('AddOrgan')">新增机构</Button>
          <Table :data="organList" :columns="organColumns" border :loading="organLoading"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page class="paging tr mt10" :current.sync="currentOrganPage" :total="organTotalItems" show-total show-elevator placement="top" @on-change="changeOrganPage"></Page>
            </div>
          </div>
        </div>
      </TabPane>

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
  Select,
  Option,
  Input
} from 'iview'
import EyFilter from '../Common/EyFilter/EyFilter'
import { getProductStatisticsList } from 'libs/js/api.js'
import {
  getArtistStatisticsList,
  deleteArtist,
  getOrganStatisticsList,
  deleteOrgan
} from './Base.service.js'

export default {
  name: 'Base',
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
    Input,
    EyFilter
  },
  data() {
    let _this = this
    return {
      role:'',
      loading1: true,
      loading2: true,
      labelList: ['艺术家库', '艺术品库', '机构'],
      isAdd: false,
      index: 0,
      artName: '',
      apageSize: 10,
      apageNo: 1,
      pPageNo: 1,
      pPageSize: 10,
      psortField: '',
      sortField: '',
      artistName: '',
      artProductName: '',
      currentPageNoProduct: 1,
      currentPageNoArt: 1,
      releaseStatus: 2,
      region: '',
      statusList: [
        { value: 2, name: '全部状态' },
        { value: 1, name: '已发布' },
        { value: 0, name: '未发布' }
      ],
      queryList: [{ value: 2, name: '名称' }, { value: 1, name: '编号' }],
      artPeoplecolumns: [
        {
          title: '编号',
          key: 'id',
          width: 70,
          align: 'center',
          render(h, params) {
            const { id } = params.row.artistDto
            return <div>{id}</div>
          }
        },
        {
          title: '艺术家姓名',
          key: 'name',
          align: 'center',
          render(h, params) {
            const { name } = params.row.artistDto
            return <div>{name}</div>
          }
        },
        {
          title: '头像',
          key: 'imageUrl',
          align: 'center',
          width: 100,
          render(h, params) {
            var { imageUrl } = params.row.artistDto
            return (
              <div
                class="headImg"
                style={`background:url(${imageUrl}?imageView2/1/w/60/h/60/q/50) no-repeat center;background-size: contain;`}
              />
              // <img src={imageUrl} class="headImg" />
            )
          }
        },
        {
          title: '国籍',
          width: 100,
          key: 'nationality',
          align: 'center',
          render(h, params) {
            const { nationality } = params.row.artistDto
            return <div>{nationality}</div>
          }
        },
        {
          title: '浏览数',
          width: 100,
          key: 'readNum',
          align: 'center',
          sortable: true,
          sortType: ''
        },
        {
          title: '评论数',
          width: 100,
          key: 'commentNum',
          align: 'center',
          sortable: true,
          sortType: '',
          render: (h, params) => {
            const { artistId, commentNum } = params.row
            if(this.role !== '1'){
            return (
              <div>
                <p>{commentNum}</p>
                <a
                  href="javascript:void(0)"
                  onClick={() =>
                    this.$router.push({
                      path: '/Comment?tab=1',
                      query: { artistId: artistId }
                    })
                  }
                >
                  查看评论
                </a>
              </div>
            )
            }else{
              return(<p>{commentNum}</p>)
            }
          }
        },
        {
          title: '作品数',
          width: 100,
          key: 'productNum',
          align: 'center',
          sortable: true,
          sortType: '',
          render: (h, params) => {
            const { name } = params.row.artistDto
            const { productNum } = params.row
            return (
              <div>
                <p>{productNum}</p>
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    this.index = 1
                    this.artistName = name
                    this.getProductStatisticsList()
                  }}
                >
                  查看作品
                </a>
              </div>
            )
          }
        },
        {
          title: '展览',
          key: 'years',
          align: 'center',
          render(h, params) {
            const { artistId } = params.row
            return (
              <div>
                <div>{artistId}</div>
                <span
                  class="edit"
                  onClick={() => {
                    _this.$router.push({
                      path: '/Base/RelateArtistExhibition',
                      query: { artistId: artistId }
                    })
                  }}
                >
                  管理
                </span>
              </div>
            )
          }
        },
        {
          title: '创建时间',
          key: 'gmtCreate',
          align: 'center',
          render(h, params) {
            const { gmtCreate } = params.row.artistDto
            return <div>{gmtCreate}</div>
          }
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          render: (h, params) => {
            const data = params.row
            const { artistId } = params.row
            return (
              <div>
                <span
                  onClick={() =>
                    this.$router.push({ name: 'AddArt', params: { data } })
                  }
                  class="edit"
                >
                  编辑
                </span>
                <span class="edit" onClick={() => this.deleteArtist(artistId)}>
                  删除
                </span>
                <div
                  style="color:blue; cursor:pointer;"
                  onClick={() =>
                    this.$router.push({
                      path: '/Person',
                      query: { artistId: artistId }
                    })
                  }
                >
                  代表作品管理
                </div>
                <div
                  style="color:blue; cursor:pointer;"
                  onClick={() =>
                    this.$router.push({
                      path: '/Base/RelateArtist',
                      query: { artistId: artistId }
                    })
                  }
                >
                  关联艺术家管理
                </div>
                <div
                  style="color:blue; cursor:pointer;"
                  onClick={() =>
                    this.$router.push({
                      path: '/Base/RelateProduct',
                      query: { artistId: artistId }
                    })
                  }
                >
                  相关商品管理
                </div>
                <div
                  style="color:blue; cursor:pointer;"
                  onClick={() =>
                    this.$router.push({
                      path: '/Base/RelateArticle',
                      query: { artistId: artistId }
                    })
                  }
                >
                  相关文章管理
                </div>
              </div>
            )
          }
        }
      ],
      artData: {},
      artProductcolumns: [
        {
          title: '编号',
          key: 'id',
          align: 'center',
          width: 70,
          render(h, params) {
            const { id } = params.row.productDto
            return <div>{id}</div>
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
        // {
        //   title: '年代',
        //   align: 'center',
        //   key: 'proYears',
        //   render(h, params) {
        //     const { proYears } = params.row.productDto;
        //     return (
        //       <div>{proYears}</div>
        //     )
        //   }
        // },
        {
          title: '收藏量',
          align: 'center',
          key: 'collectNum',
          width: 80,
          sortable: true,
          sortType: ''
        },
        {
          title: '评论数',
          align: 'center',
          key: 'commentNum',
          width: 80,
          sortable: true,
          sortType: ''
        },
        {
          title: '浏览量',
          align: 'center',
          key: 'readNum',
          width: 80,
          sortable: true,
          sortType: ''
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 80,
          render(h, params) {
            const { status } = params.row.productDto
            return <div>{status == 0 ? '未发布' : '已发布'}</div>
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
            const data = params.row.productDto
            const productId = params.row.productId
            const { id } = params.row.productDto
            // return h('div',  [
            //   h('span',{
            //     'class': {
            //       edit: true
            //     },
            //     domProps: {
            //       innerHTML: '复制链接'
            //     }, on:{click:()=>{this.$router.push({
            //         name: 'AddArtProduct',
            //         params: { data }
            //       })}}
            //   }),
            //     h('span',{
            //       'class': {
            //         edit: true
            //       },
            //       domProps: {
            //         innerHTML: '编辑'
            //       }, on:{click:()=>{this.$router.push({
            //           name: 'AddArtProduct',
            //           params: { data }
            //         })}}
            //     }),
            //   ]
            // )
            if(this.role !== '1'){
              return (
              <div>
                <span
                  onClick={() =>
                    this.$router.push({
                      name: 'AddArtProduct',
                      params: { data }
                    })
                  }
                  class="edit"
                >
                  编辑
                </span>
                <span
                  class="edit"
                  v-clipboard={`pages/Picture/Detail?id=${id}`}
                  onSuccess={e => this.$Message.success('复制成功')}
                >
                  复制链接
                </span>
                <span
                  class="edit"
                  onClick={() =>{
              this.$router.push({
                      path: '/Comment',
                      query: { productId }
                    })
                  }
                  }
                >
                  查看评论
                </span>
              </div>
            )
          }
          else{
              return (
                <div>
                <span
              onClick={() =>
              this.$router.push({
                name: 'AddArtProduct',
                params: { data }
              })
            }
            class="edit"
                >
                编辑
                </span>
                <span
            class="edit"
              v-clipboard={`pages/Picture/Detail?id=${id}`}
              onSuccess={e => this.$Message.success('复制成功')}
            >
              复制链接
              </span>
              </div>
            )
            }
          }
        }
      ],
      artProductData: {},

      queryName: '',
      organList: [],
      organPageNo: 1,
      organPageSize: 10,
      organSort: '',
      organsortField: '',
      organLoading: false,
      currentOrganPage: 1,
      organTotalItems: 0,
      queryCondition: '',
      organColumns: [
        {
          title: '编号',
          key: 'id',
          align: 'center'
        },
        {
          title: '机构',
          key: 'name',
          align: 'center',
          render(h, params) {
            const { name, avatar } = params.row
            return (
              <div>
                <div
                  class="headImg"
                  style={`background:url(${avatar}?imageView2/1/w/150/h/150/q/50) no-repeat center;background-size: contain;`}
                />
                <span>{name}</span>
              </div>
            )
          }
        },
        {
          title: '签约艺术家',
          key: 'id',
          align: 'center',
          render(h, params) {
            const { artistNum, id } = params.row
            return (
              <div>
                <div>{artistNum}</div>
                <span
                  class="edit"
                  onClick={() => {
                    _this.$router.push({
                      path: '/Base/RelateSignedArtist',
                      query: { organId: id }
                    })
                  }}
                >
                  管理
                </span>
              </div>
            )
          }
        },
        {
          title: '馆藏',
          key: 'id',
          align: 'center',
          render(h, params) {
            const { productNum, id } = params.row
            return (
              <div>
                <div>{productNum}</div>
                <span
                  class="edit"
                  onClick={() => {
                    _this.$router.push({
                      path: '/Base/RelateCollect',
                      query: { organId: id }
                    })
                  }}
                >
                  管理
                </span>
              </div>
            )
          }
        },
        {
          title: '展览',
          key: 'id',
          align: 'center',
          render(h, params) {
            const { exhibitionNum, id } = params.row
            return (
              <div>
                <div>{exhibitionNum}</div>
                <span
                  class="edit"
                  onClick={() => {
                    _this.$router.push({
                      path: '/Base/RelateExhibition',
                      query: { organId: id }
                    })
                  }}
                >
                  管理
                </span>
              </div>
            )
          }
        },

        {
          title: '操作',
          align: 'center',
          key: 'operate',
          render(h, params) {
            const data = params.row
            return (
              <div>
                <span
                  onClick={() =>
                    _this.$router.push({ name: 'AddOrgan', params: { data } })
                  }
                  class="edit"
                >
                  编辑
                </span>
                <span
                  class="edit"
                  onClick={() => {
                    _this.confirmDelOrgan(data.id)
                  }}
                >
                  删除
                </span>
              </div>
            )
          }
        }
      ]
    }
  },
  created() {
    this.role = sessionStorage.getItem('role')
    const { params, query } = this.$route
    console.log(this.$route)
    if (params.tab === '0' || query.tab == 0) {
      this.index = 0
    } else if (params.tab === '1' || query.tab == 1) {
      this.index = 1
    } else if (params.tab === '2' || query.tab == 2) {
      this.index = 2
    }
    if (params.artistName) {
      this.artName = params.artistName
    }
    this.getArtistList()
    if (params.productName) {
      this.artProductName = params.productName
    }
    this.getProductStatisticsList()

    this.getOrganDataList()
  },
  watch: {
    $route(newValue, oldValue) {
      const { params, query } = this.$route
      if (params.tab === '0' || query.tab == 0) {
        this.index = 0
      } else if (params.tab === '1' || query.tab == 1) {
        this.index = 1
      } else if (params.tab === '2' || query.tab == 2) {
        this.index = 2
      }
    }
  },
  mounted() {},
  methods: {
    getName(name) {
      this.index = name
    },
    getItem({ key, value }) {
      this.apageNo = 0
      this.currentPageNoArt = 1
      if (key) {
        this.region = key
      } else {
        this.region = ''
      }
      this.getArtistList()
    },
    add(name) {
      this.$router.push({ name })
    },
    search(sort) {
      if (sort === 'art') {
        this.currentPageNoArt = 1
        this.getArtistList()
      } else if (sort === 'artProduct') {
        this.currentPageNoProduct = 1
        this.getProductStatisticsList()
      } else if (sort === 'organ') {
        this.currentOrganPage = 1
        this.getOrganDataList()
      }
    },
    onChangeTab1(pageNo) {
      this.apageNo = pageNo
      this.getArtistList()
    },
    onChangeTab2(pageNo) {
      this.pPageNo = pageNo
      this.getProductStatisticsList()
    },
    onPageSizeChangeTab1(pageSize) {
      this.apageSize = pageSize
      this.getArtistList()
    },
    onPageSizeChangeTab2(pageSize) {
      this.pPageSize = pageSize
      this.getProductStatisticsList()
    },
    async getArtistList() {
      const params = {
        pageNo: this.apageNo,
        pageSize: this.apageSize,
        searchInfo: JSON.stringify({
          artistName: this.artName,
          region: this.region
        }),
        sortField: this.sortField,
        sort: ''
      }
      const { code, data } = await getArtistStatisticsList(params)
      if (code === 10000) {
        this.artData = data
        this.loading1 = false
      }
    },
    async getProductStatisticsList() {
      const params = {
        pageNo: this.pPageNo,
        pageSize: this.pPageSize,
        sortField: this.psortField,
        sort: '',
        searchInfo: JSON.stringify({
          artistName: this.artistName,
          productName: this.artProductName,
          status: this.releaseStatus === 2 ? '' : this.releaseStatus
        })
      }
      const { code, data } = await getProductStatisticsList(params)
      if (code === 10000) {
        this.artProductData = data
        this.loading2 = false
      }
    },
    async deleteArtist(artistId) {
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除吗？</p>`,
        onOk: async () => {
          const { code, msg } = await deleteArtist({
            artistId
          })
          if (code === 10000 || code === '10000') {
            this.$Message.success(msg)
            this.getArtistList({})
          } else if (code === 10001 || code === '10001') {
            this.$Message.warning(msg)
          }
        }
      })
    },

    // 机构部分

    // 获取机构列表
    async getOrganDataList() {
      const params = {
        pageNo: this.organPageNo,
        pageSize: this.organPageSize,
        searchInfo: JSON.stringify({
          name: this.queryCondition === 2 ? this.queryName : '',
          id: this.queryCondition === 1 ? this.queryName : ''
        }),
        sortField: this.organsortField,
        sort: this.organSort
      }
      const { code, data } = await getOrganStatisticsList(params)
      if (+code === 10000) {
        this.organList = data.data
        this.organTotalItems = data.totalItems
        this.organLoading = false
      }
    },

    changeOrganPage(page) {
      this.organPageNo = page
      this.getOrganDataList()
    },

    //重置

    reset() {
      this.queryName = ''
    },

    // 删除展览
    confirmDelOrgan(organId) {
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除吗？</p>`,
        onOk: () => {
          this.delOrgan(organId)
        }
      })
    },
    async delOrgan(organId) {
      const postData = {
        id: organId
      }
      const { code, data, msg } = await deleteOrgan(postData)
      if (+code === 10000) {
        this.getOrganDataList()
        this.$Message.success(msg)
      } else {
        this.$Message.error(msg)
      }
    }
  }
}
</script>
<style lang="less">
@import '../../libs/css/constant.less';
@import '../../libs/css/common.less';

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
}
</style>
