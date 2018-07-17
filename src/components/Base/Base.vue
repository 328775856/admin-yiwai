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
                <Input v-model="artName" placeholder="输入艺术家姓名" style="width: 180px" />
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

      <!-- tab-3 开始 -->
      <!-- <TabPane :label="labelList[2]">标签三的内容
      </TabPane> -->
      <!-- tab-3 结束 -->
    </Tabs>
    <!-- 三个tab页end -->
  </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Tabs, TabPane, Button, Table, Page, Select, Option, Input } from 'iview';
import EyFilter  from '../Common/EyFilter/EyFilter'
import { getProductStatisticsList } from 'libs/js/api.js';
import { getArtistStatisticsList, deleteArtist } from './Base.service.js';

export default {
  name: 'Base',
  components: { Breadcrumb, BreadcrumbItem, Tabs, TabPane, Button, Table, Page, Select, Option, Input,EyFilter },
  data() {
    return {
      loading1: true,
      loading2: true,
      labelList: ['艺术家库', '艺术品库', '展馆库'],
      isAdd: false,
      index: 0,
      artName: '',
      apageSize:10,
      apageNo:0,
      pPageNo:0,
      pPageSize:10,
      psortField:'',
      sortField:'',
      artistName: '',
      artProductName: '',
      currentPageNoProduct: 1,
      currentPageNoArt: 1,
      releaseStatus: 2,
      region:'',
      statusList: [{ value: 2, name: '全部状态' }, { value: 1, name: '已发布' }, { value: 0, name: '未发布' }],
      artPeoplecolumns: [
        {
          title: '编号',
          key: 'id',
          width: 70,
          align: 'center',
          render(h, params) {
            const {id} = params.row.artistDto;
            return (
              <div>{id}</div>
            )
          }
        },
        {
          title: '艺术家姓名',
          key: 'name',
          align: 'center',
          render(h, params) {
            const {name} = params.row.artistDto;
            return (
              <div>{name}</div>
            )
          }
        },
        {
          title: '头像',
          key: 'imageUrl',
          align: 'center',
          width: 100,
          render(h, params) {
            var {imageUrl} = params.row.artistDto;
            return (
              <div class="headImg" style={`background:url(${imageUrl}?imageView2/1/w/60/h/60/q/50) no-repeat center;background-size: contain;`}></div>
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
            const {nationality} = params.row.artistDto;
            return (
              <div>{nationality}</div>
            )
          }
        },
        {
          title: '浏览数',
          width: 100,
          key: 'readNum',
          align: 'center',
          sortable:true,
          sortType:'desc'
        },
        {
          title: '评论数',
          width: 100,
          key: 'commentNum',
          align: 'center',
          sortable:true,
          sortType:'desc',
          render:(h,params) => {
            const {artistId,commentNum} = params.row;
            return (
              <div>
              <p>{commentNum}</p>
              <a href="javascript:void(0)" onClick={()=>this.$router.push({path:"/Comment?tab=1",query:{artistId:artistId}})}>查看评论</a>
              </div>
            )
          }
        },
        {
          title: '作品数',
          width: 100,
          key: 'productNum',
          align: 'center',
          sortable:true,
          sortType:'desc',
          render:(h,params) => {
            const {name} = params.row.artistDto;
            const {productNum} = params.row;
            return (
              <div>
                <p>{productNum}</p>
                <a href="javascript:void(0)" onClick={()=>{
                this.index =1;
                this.artistName = name;
                this.getProductStatisticsList();
              }}>查看作品</a>
              </div>
            )
          }
        },
        // {
        //   title: '年代',
        //   key: 'years',
        //   align: 'center',
        //   render: (h, params) => {
        //     const birthDate = params.row.birthDate;
        //     const deathDate = params.row.deathDate
        //     return (
        //       <div>
        //         {birthDate ? birthDate : '?'} - {deathDate ? deathDate : '?'}
        //       </div>
        //     )
        //   }
        // },
        {
          title: '创建时间',
          key: 'gmtCreate',
          align: 'center',
          render(h, params) {
            const {gmtCreate} = params.row.artistDto;
            return (
              <div>{gmtCreate}</div>
            )
          }
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          render: (h, params) => {
            const data = params.row;
            const {artistId} = params.row;
            return (
              <div>
                <span onClick={() => this.$router.push({ name: 'AddArt', params: { data } })} class="edit">编辑</span>
                <span class="edit" onClick={()=>this.deleteArtist(artistId)}>删除</span>
                <div style="color:blue; cursor:pointer;"  onClick={()=>this.$router.push({path:"/Person",query:{artistId:artistId}})}>代表作品管理</div>
                <div style="color:blue; cursor:pointer;"  onClick={()=>this.$router.push({path:"/Base/RelateArtist",query:{artistId:artistId}})}>关联艺术家管理</div>
                <div style="color:blue; cursor:pointer;"  onClick={()=>this.$router.push({path:"/Base/RelateProduct",query:{artistId:artistId}})}>相关商品管理</div>
                <div style="color:blue; cursor:pointer;"  onClick={()=>this.$router.push({path:"/Base/RelateArticle",query:{artistId:artistId}})}>相关文章管理</div>
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
            const { id } = params.row.productDto;
            return (
              <div>{id}</div>
            )
          }
        },
        {
          title: '艺术品名称',
          key: 'name',
          align: 'center',
          width:150,
          render(h, params) {
            const { name } = params.row.productDto;
            return (
              <div>{name}</div>
            )
          }
        },
        {
          title: '图片',
          align: 'center',
          key: 'imageUrl',
          render(h, params) {
            const { imageUrl } = params.row.productDto;
            return (
              <div class="headImg" style={`background:url(${imageUrl}?imageView2/1/w/175/h/100/q/50) no-repeat center;background-size: contain;`}></div>
            )
          }
        },
        {
          title: '作者',
          align: 'center',
          key: 'artistName',
          render(h, params) {
            const { artistName } = params.row.productDto;
            return (
              <div>{artistName}</div>
            )
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
          sortable:true,
          sortType:'desc'
        },
        {
          title: '评论数',
          align: 'center',
          key: 'commentNum',
          width: 80,
          sortable:true,
          sortType:'desc'
        },
        {
          title: '浏览量',
          align: 'center',
          key: 'readNum',
          width: 80,
          sortable:true,
          sortType:'desc'
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 80,
          render(h, params) {
            const { status } = params.row.productDto;
            return (
              <div>{status == 0 ? '未发布' : '已发布'}</div>
            )
          }
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'gmtCreate',
          width: 100,
          render(h, params) {
            const { gmtCreate } = params.row.productDto;
            return (
              <div>{gmtCreate}</div>
            )
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'operate',
          render: (h, params) => {
            const data = params.row.productDto;
            const productId = params.row.productId;
            const { id } = params.row.productDto;
            return (
              <div>
                <span onClick={() => this.$router.push({ name: 'AddArtProduct', params: { data } })} class="edit">编辑</span>
                <span class="edit" v-clipboard={`pages/Picture/Detail?id=${id}`} onSuccess={(e) => this.$Message.success('复制成功')}>复制链接</span>
                <span class="edit" onClick={() => this.$router.push({ path: '/Comment', query: { productId } })}>查看评论</span>

              </div>
            )
          }
        }
      ],
      artProductData: {}
    }
  },
  created() {
    const { params, query } = this.$route;
    if (params.tab === '0' || query.tab == 0) {
      this.index = 0;
    } else if (params.tab === '1' || query.tab == 1) {
      this.index = 1;
    } else if (params.tab === '2' || query.tab == 2) {
      this.index = 2;
    }
    if(params.artistName){
      this.artName = params.artistName;
    }
    this.getArtistList();
    if (params.productName) {
      this.artProductName = params.productName;
    }
    this.getProductStatisticsList();
  },
  watch: {
    '$route'(newValue, oldValue) {
      const { params, query } = this.$route;
      if (params.tab === '0' || query.tab == 0) {
        this.index = 0;
      } else if (params.tab === '1' || query.tab == 1) {
        this.index = 1;
      } else if (params.tab === '2' || query.tab == 2) {
        this.index = 2;
      }
    }
  },
  mounted() {
  },
  methods: {
    getName(name) {
      this.index = name;
    },
    getItem({key,value}){
      this.apageNo =0;
      this.currentPageNoArt = 1;
      if(key){
        this.region = key;
      }else{
        this.region ="";
      }
      this.getArtistList();
    },
    add(name) {
      this.$router.push({ name });
    },
    search(sort) {
      if (sort === 'art') {
        this.currentPageNoArt = 1;
        this.getArtistList();
      } else if (sort === 'artProduct') {
        this.currentPageNoProduct = 1;
        this.getProductStatisticsList();
      }
    },
    onChangeTab1(pageNo) {
      this.apageNo = pageNo;
      this.getArtistList();
    },
    onChangeTab2(pageNo) {
      this.pPageNo = pageNo;
      this.getProductStatisticsList()
    },
    onPageSizeChangeTab1(pageSize) {
      this.apageSize = pageSize;
      this.getArtistList();
    },
    onPageSizeChangeTab2(pageSize) {
      this.pPageSize = pageSize;
      this.getProductStatisticsList()
    },
    async getArtistList() {
      const params ={
        pageNo:this.apageNo,
        pageSize:this.apageSize,
        searchInfo:JSON.stringify({
          artistName:this.artName,
          region:this.region
        }),
        sortField:this.sortField,
        sort:''
      }
      const { code, data } = await getArtistStatisticsList(params)
      if (code === 10000) {
        this.artData = data;
        this.loading1 = false;
      }
    },
    async getProductStatisticsList() {
      const params ={
        pageNo:this.pPageNo,
        pageSize:this.pPageSize,
        sortField:this.psortField,
        sort:'DESC',
        searchInfo:JSON.stringify({
          artistName:this.artistName,
          productName:this.artProductName,
          status:this.releaseStatus === 2 ? '' : this.releaseStatus
        })
      }
      const { code, data } = await getProductStatisticsList(params);
      if (code === 10000) {
        this.artProductData = data;
        this.loading2 = false;
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
            this.getArtistList({});
          } else if (code === 10001 || code === '10001') {
            this.$Message.warning(msg);
          }
        }
      })
    }
  }

}
</script>
<style lang="less">
@import "../../libs/css/constant.less";
@import "../../libs/css/common.less";

#base {
  .tab {
    .artPeople,
    .artProduct {
      .headImg {
        height: 60px;
      }
      .edit{
        margin: 0;
      }
    }
  }
}
</style>
