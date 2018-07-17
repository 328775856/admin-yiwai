<template>
  <div id="content">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>内容管理</BreadcrumbItem>
      <BreadcrumbItem>{{labelList[index]}}</BreadcrumbItem>
    </Breadcrumb>
    <!-- 三个tab页start -->
    <Tabs type="card" @on-click="getName" class="tab" :value="index">
      <!-- 取消注释时，将TabPane label="labelList[0]"递增，labelList第一个元素加'文章发布'，并修改created钩子逻辑' -->
      <!-- tab-1 开始 -->
      <TabPane :label="labelList[0]">
        <div class="artPeople">
          <fieldset class="fieldset">
            <legend>查询条件</legend>
            <div class="search">
              <div>
                <label for="">文章标题：</label>
                <Input v-model="articleTitle" placeholder="输入标题关键字" style="width: 180px" />
              </div>
              <div>
                <label for="">文章分类：</label>
                <Select v-model="classifyValue" style="width:180px">
                  <Option v-for="(item,index) in sortList" :value="item.id" :key="index">{{ item.dictionaryValue }}</Option>
                </Select>
              </div>
              <Button type="primary" icon="ios-search" @click="search('tab1')">查询</Button>
            </div>
          </fieldset>
          <Button type="primary" icon="plus" class="add" @click="add('tab1')">新增文章</Button>
          <Table :data="articleData.data" :columns="articleColumns" :loading="articleLoading" border></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page class="paging tr mt10" :total="articleData.totalItems" show-total show-elevator  :page-size-opts="[10,20,30]" placement="top" @on-change="onChangeTab1" @on-page-size-change="onPageSizeChangeTab1"></Page>
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
                <label for="">卡片标题：</label>
                <Input v-model="cardTitle" placeholder="输入标题关键字" style="width: 180px" />
              </div>
              <div>
                <label for="">卡片分类：</label>
                <Select v-model="cardStatus" style="width:180px">
                  <Option v-for="(item,index) in cardList" :value="item.value" :key="index">{{ item.name }}</Option>
                </Select>
              </div>
              <Button type="primary" icon="ios-search" @click="search('tab2')">查询</Button>
            </div>
          </fieldset>
          <Button type="primary" icon="plus" class="add" @click="add('tab2')">新增卡片</Button>
          <Table :data="cardData.homePageList" :columns="cardColumns" border :loading="loading1"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page class="paging tr mt10" :current.sync="currentPageNoCard" :total="cardData.totalItems" show-total show-elevator :page-size-opts="[10,20,30]" placement="top" @on-change="onChangeTab2" @on-page-size-change="onPageSizeChangeTab2"></Page>
            </div>
          </div>
        </div>
      </TabPane>
      <!-- tab-2 结束 -->

      <!-- tab-3 开始 -->
      <TabPane :label="labelList[2]">
        <div class="artProduct">
          <fieldset class="fieldset">
            <legend>查询条件</legend>
            <div class="search">
              <div>
                <label for="">展览名称：</label>
                <Input v-model="exhibitionName" placeholder="输入名称关键字" style="width: 180px" />
              </div>
              <Button type="primary" icon="ios-search" @click="search('tab3')">查询</Button>
            </div>
          </fieldset>
          <Button type="primary" icon="plus" class="add" @click="add('tab3')">新增展览</Button>
          <Table :data="artShowData.exhibitionList" :columns="artShowColumns" border :loading="loading2"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page class="paging tr mt10" :current.sync="currentPageNoExhibition" :total="artShowData.totalItems" show-total show-elevator :page-size-opts="[10,20,30]" placement="top" @on-change="onChangeTab3" @on-page-size-change="onPageSizeChangeTab3"></Page>
            </div>
          </div>
        </div>
      </TabPane>
      <!-- tab-3 结束 -->
    </Tabs>
    <!-- 三个tab页end -->
  </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Tabs, TabPane, Button, Table, Page, Select, Option, Input } from 'iview';
import { getArticleList, setArticle, deleteArticle, getHomePageStatisticsList, deleteHomePageChoiceness, getExhibitionList, deleteExhibition } from './Content.service';
import { getDictionaryList } from 'libs/js/api.js';


export default {
  name: 'Content',
  components: { Breadcrumb, BreadcrumbItem, Tabs, TabPane, Button, Table, Page, Select, Option, Input },
  data() {
    var _this = this;
    return {
      labelList: ['文章管理','内容卡片', '展览发布'],
      isAdd: false,
      index: 0,
      titleName: '',
      artShowName: '',
      sortStatus: '',
      dictonaryPageNo:0,
      dictonaryPageSize:10,
      articleLoading:true,
      sortList: [],
      /* 文章发布---start */
      articleTitle: '',
      articlePageNo:0,
      articlePageSize:10,
      classifyValue: '',
      currentPageNoCard:1,
      currentPageNoExhibition:1,
      articleData: {},
      articleColumns: [
        {
          title: '编号',
          key: 'id',
          align: 'center',
          width:70,
          // render: (h, params) => {
          //   const id = params.row.id;
          //   return (
          //     <div>ATC00000{id}</div>
          //   )
          // }
        },
        {
          title: '文章标题',
          key: 'title',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '作者',
          width: 100,
          key: 'author',
          align: 'center'
        },
        {
          title: '分类',
          key: 'classifyValue',
          align: 'center'
        },
        {
          title: '评论数',
          key: 'years',
          align: 'center',
          width: 100,
          render: (h, params) => {
            const commentNum = params.row.articleStatisticsDto.commentNum;
            return (
              <div>{commentNum}</div>
            )
          }
        }, {
          title: '浏览量',
          key: 'years',
          align: 'center',
          width: 100,
          render: (h, params) => {
            const browseNum = params.row.articleStatisticsDto.browseNum;
            return (
              <div>{browseNum}</div>
            )
          }
        },
        {
          title: '创建时间',
          key: 'gmtCreate',
          align: 'center'
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          render(h, params) {
            const data = params.row;
            return (
              <div>
                <span onClick={() => _this.$router.push({ name: 'AddArticle', params: { data } })} class="edit">编辑</span>
                <span class="edit" onClick={_this.deleteArticle.bind(_this, this.row.id)}>删除</span>
              </div>
            )
          }
        }
      ],
      /* 文章发布---end */
      /* 内容卡片---start */
      loading1: true,
      cardTitle: '',
      cardPageNo:0,
      cardPageSize:10,
      cardStatus: 0,
      cardList: [{ value: 0, name: '全部状态' }, { value: 1, name: '作品卡片' }, { value: 2, name: '观点卡片' }, { value: 3, name: '商品卡片' }],
      cardColumns: [
        {
          title: '编号',
          key: 'choicenessId',
          align: 'center',
          width:70,
          // render: (h, params) => {
          //   const choicenessId = params.row.choicenessId;
          //   return (
          //     <div>CAD00000{choicenessId}</div>
          //   )
          // }
        },
        {
          title: '卡片标题',
          key: 'title',
          align: 'center',
          render(h, params) {
            console.log(params.row)
            if (this.row.itemType === 1) {
              return (
                <div class="txt-2ovh">{this.row.title}</div>
              )
            } else if (this.row.itemType === 2) {
              return (
                <div class="txt-2ovh">{this.row.commentDto.content}</div>
              )
            } else if (this.row.itemType === 3) {
              return (
                <div class="txt-2ovh">{this.row.title}</div>
              )
            }
          }
        },
        {
          title: '卡片分类',
          align: 'center',
          key: 'itemType',
          width: 100,
          render: (h, params) => {
            const itemType = params.row.itemType;
            if (itemType === 1) {
              return (
                <div>作品</div>
              )
            } else if (itemType === 2) {
              return (
                <div>观点</div>
              )
            } else if (itemType === 3) {
              return (
                <div>商品</div>
              )
            }

          }
        },
        {
          title: '图片',
          align: 'center',
          key: 'image',
          render: (h, params) => {
            const itemType = params.row.itemType;
            if (itemType === 1 || itemType === 2) {
              const image = params.row.productDto.imageUrl;
              return (
                <div class="headImg" style={`background:url(${image}?imageView2/1/w/150/h/150/q/50) no-repeat center;background-size: contain;`}></div>
              )
            } else if (itemType === 3) {
              const image = params.row.image;
              return (
                <div class="headImg" style={`background:url(${image}?imageView2/1/w/150/h/150/q/50) no-repeat center;background-size: contain;`}></div>
              )
            }

          }
        },
        {
          title: '关联主体',
          align: 'center',
          key: 'name',
          render: (h, params) => {
            if (params.row.itemType === 1 || params.row.itemType === 2) {
              const name = params.row.productDto.name;
              return (
                <div>{name}</div>
              )
            } else {
              const goodsName = params.row.goodsName;
              return (
                <div>{goodsName}</div>
              )
            }

          }
        },
        {
          title: '浏览量',
          align: 'center',
          key: 'clickNum',
          width: 100,
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'gmtCreate',
        },
        {
          title: '操作',
          align: 'center',
          key: 'operate',
          render(h, params) {
            const data = params.row;
            return (
              <div>
                <span onClick={() => _this.$router.push({ name: 'AddContent', params: { data } })} class="edit">编辑</span>
                <span class="edit" onClick={_this.deleteHomePageChoiceness.bind(_this, this.row.choicenessId)}>删除</span>
              </div>
            )
          }
        }
      ],
      cardData: {},
      /* 内容卡片---end */
      /* 展览发布---start */
      loading2: true,
      exhibitionPageNo:0,
      exhibitionPageSize:10,
      exhibitionName: '',
      artShowColumns: [
        {
          title: '编号',
          key: 'id',
          align: 'center',
          width: 70,
          // render(h, params) {
          //   const id = params.row.id;
          //   return (
          //     <div>EXH00000{id}</div>
          //   )
          // }
        },
        {
          title: '展览名称',
          key: 'exhibitionName',
          align: 'center',
        },
        {
          title: '展览图片',
          align: 'center',
          key: 'image',
          render: (h, params) => {
            const image = params.row.image;
            return (
              <div class="headImg" style={`background:url(${image}?imageView2/1/w/150/h/150/q/50) no-repeat center;background-size: contain;`}></div>
            )
          }
        },
        {
          title: '策展人',
          align: 'center',
          key: 'curator',
        },
        {
          title: '展品数量',
          align: 'center',
          width: 100,
          key: 'exhibitsNum',
        },
        {
          title: '展期',
          align: 'center',
          key: 'time',
          render(h, params) {
            const start = params.row.exhibitionStartTime;
            const end = params.row.exhibitionEndTime;
            return (
              <div>{start}~{end}</div>
            )
          }
        },
        {
          title: '观展人数',
          align: 'center',
          width: 100,
          key: 'clickNum',
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'gmtCreate',
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 100,
          render(h, params) {
            const timestamp = Date.parse(new Date().toLocaleDateString()) / 1000;//获取当前年月日时间戳
            const end = Date.parse(new Date(params.row.exhibitionEndTime)) / 1000;//结束时间转化成时间戳
            const start = Date.parse(new Date(params.row.exhibitionStartTime)) / 1000; // 开始时间转化成时间戳
            let statusText = "进行中";
            if(timestamp<start) {
              statusText =  "未开始"
            }else if(timestamp>end) {
              statusText = "已结束"
            }else {
              statusText = "进行中"
            }
            return (

              <div>
                { statusText !=="进行中" ? <div style="color:red">{statusText}</div> : '进行中'}
              </div>
            )
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'operate',
          render(h, params) {
            const data = params.row;
            return (
              <div>
                <span onClick={() => _this.$router.push({ name: 'AddArtShow', params: { data } })} class="edit">编辑</span>
                <span
                  onClick={
                    () => {
                      const { href } = _this.$router.resolve({
                        path: '/SetExhibition',
                        query: {
                          exhibitionId: this.row.id,
                          exhibitionName: this.row.exhibitionName
                        }
                      })
                      window.open(href, '_blank')
                    }
                  }
                  class="edit">展品</span>
                <br />
                <span onClick={_this.deleteExhibition.bind(_this, this.row.id)} class="edit">删除</span>
                <span class="edit"></span>
              </div>
            )
          }
        }
      ],
      artShowData: {}
      /* 展览发布---end */
    }
  },
  created() {
    if (this.$route.params.tab === '1') {
      this.index = 0;
    } else if (this.$route.params.tab === '2') {
      this.index = 1;
    }
  },
  mounted() {
    this.getDictionaryList();
    this.getArticleList();
    this.getHomePageStatisticsList();
    this.getExhibitionList();
  },
  methods: {
    getName(name) {
      this.index = name;
    },
    add(tab) {
      if (tab === 'tab1') {
        this.$router.push({ name: 'AddArticle' });
      } else if (tab === 'tab2') {
        this.$router.push({ name: 'AddContent' });
      } else {
        this.$router.push({ name: 'AddArtShow' });
      }
    },
    onChangeTab1(pageNo) {
      this.articlePageNo =pageNo;
      this.getArticleList();
    },
    onPageSizeChangeTab1(pageSize) {
      this.articlePageSize = pageSize;
      this.getArticleList();
    },
    onChangeTab2(pageNo) {
      this.cardPageNo = pageNo;
      this.getHomePageStatisticsList();
    },
    onPageSizeChangeTab2(pageSize) {
      this.cardPageSize = pageSize;
      this.getHomePageStatisticsList();
    },
    onChangeTab3(pageNo) {
      this.getExhibitionList();
    },
    onPageSizeChangeTab3(pageSize) {
      this.getExhibitionList();
    },
    search(tab) {
      if (tab === 'tab1') {
        this.getArticleList();
      } else if (tab === 'tab2') {
        this.currentPageNoCard =1;
        this.getHomePageStatisticsList();
      } else {
        this.currentPageNoExhibition = 1;
        this.getExhibitionList();
      }
    },
    async getHomePageStatisticsList() {
      const params ={
        pageNo:this.cardPageNo,
        pageSize:this.cardPageSize,
        sortField:'clickNum,id',
        sort:'DESC',
        searchInfo:JSON.stringify({
          title:this.cardTitle,
          itemType:this.cardStatus == 0 ? '' : this.cardStatus
        })
      }
      const {code, data,msg } = await getHomePageStatisticsList(params);
      if(code ===10000 || code==='10000'){
          this.cardData = data;
          this.loading1 = false;
      }else{
        this.$Message.error(msg);
      }
    },
    deleteHomePageChoiceness(choicenessId) {
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除吗？</p>`,
        onOk: async () => {
          const { code, msg } = await deleteHomePageChoiceness({ choicenessId });
          if (code === 10000 || code === '10000') {
            this.$Message.success(msg);
            this.getHomePageStatisticsList();
          }
        }
      })
    },
    async getArticleList() {
      const params ={
        pageNo:this.articlePageNo,
        pageSize:this.articlePageSize,
        sortField:'id',
        sort:'DESC',
        searchInfo:JSON.stringify({
          title:this.articleTitle,
          classifyId:this.classifyValue
        })
      }
      const {code, data,msg } = await getArticleList(params);
      if(code ===10000 || code === '10000'){
        this.articleData = data;
        this.articleLoading = false;
      }else{
        this.$Message.error(msg);
      }
    },
    async getDictionaryList() {
      const params ={
        pageNo:this.dictonaryPageNo,
        pageSize:this.dictonaryPageSize,
        dictionaryGroup:'article-type',
        dictionaryKey:''
      }
      const { data,code,msg } = await getDictionaryList(params);
      if(code ===10000 || code ==='10000'){
        this.sortList = data.data;
      }else{
        this.$Message.error(msg);
      }

    },
    deleteArticle(id) {
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除吗？</p>`,
        onOk: async () => {
          const { code, msg } = await deleteArticle({ id });
          if (code === 10000 || code === '10000') {
            this.$Message.success(msg);
            this.getArticleList();
          }
        }
      })
    },
    async getExhibitionList() {
      const params ={
        pageNo:this.cardPageNo,
        pageSize:this.cardPageSize,
        sortField:'clickNum,id',
        sort:'DESC',
        searchInfo:JSON.stringify({
          exhibitionName:this.exhibitionName
        })
      }
      const {code, data,msg } = await getExhibitionList(params);
      if(code === 10000 || code ==='10000') {
         this.artShowData = data;
         this.loading2 = false;
      }else{
        this.$Message.error(msg);
      }
    },
    deleteExhibition(id) {
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除吗？</p>`,
        onOk: async () => {
          const { code, msg } = await deleteExhibition({ id });
          if (code === 10000 || code === '10000') {
            this.$Message.success(msg);
            this.getExhibitionList();
          }else if(code === 10001 ||  code==='10001') {
            this.$Message.error(msg);
          }
        }
      })
    },
  }
}
</script>
<style lang="less">

#content {
  .tab {
    .artPeople,
    .artProduct {
      .headImg {
        height: 100px;
      }
    }
  }
}
</style>
