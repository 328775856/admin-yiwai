<template>
    <div id="relateArtist">
      <Breadcrumb separator=">" class="breadCrumb">
        <BreadcrumbItem>当前位置:</BreadcrumbItem>
        <BreadcrumbItem to="/Culture">家乡文物管理</BreadcrumbItem>
        <BreadcrumbItem>添加内容</BreadcrumbItem>
      </Breadcrumb>
      <div class="mb20">
            <div  style="text-align:right"><Button type="primary" icon="plus" class="add" @click="showModal">添加相关内容</Button></div>
      </div>
    <div class="ey_ullis mt10">
      <div class="ivu-spin ivu-spin-large ivu-spin-fix" v-if="loading">
        <div class="ivu-spin-main">
          <span class="ivu-spin-dot"></span>
          <div class="ivu-spin-text"></div>
        </div>
      </div>
      <ul>
        <li v-for="(item,index) in dataList" :key="index">
          <div class="mui-flex alc">
            <div class="commentIdWrp">
              编号: {{item.antiqueStatisticsDto !==undefined ?item.antiqueStatisticsDto.hometownAntiqueDto.id : item.hometownAntiqueDto.id}}
            </div>
            <div class="imgWrp">
              <span v-if="item.antiqueStatisticsDto!==undefined">
                  <img :src="item.antiqueStatisticsDto.hometownAntiqueDto.customerImg">
              </span>
              <span v-else>
                <img :src="item.hometownAntiqueDto.customerImg">
              </span>

            </div>
            <div class="cell">
              <p>
                <router-link :to="{ name: 'Customer',params:{customerName:item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.hometownAntiqueDto.customerName :item.hometownAntiqueDto.customerName}}" class="aLink">
                {{item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.hometownAntiqueDto.customerName :item.hometownAntiqueDto.customerName}}
                </router-link>
                <span>{{item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.hometownAntiqueDto.gmtCreate :item.hometownAntiqueDto.gmtCreate}}</span>
              </p>
              <div class="contentWrp bk">{{item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.hometownAntiqueDto.content :item.hometownAntiqueDto.content}}</div>
              <div class="btmWrp">
                <span>点赞数：{{item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.likeNum :item.likeNum}}
                  <a href="javascript:;" class="aLink" @click="setLike({antiqueId:item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.hometownAntiqueDto.id :item.hometownAntiqueDto.id,likeNum:item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.likeNum :item.likeNum})">设置点赞数</a>
                </span>
                <span class="ml15">投票数：{{item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.voteNum :item.voteNum}}
                    <a href="javascript:;" class="aLink" @click="setVote({antiqueId:item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.hometownAntiqueDto.id :item.hometownAntiqueDto.id,voteNum:item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.voteNum :item.voteNum})" >设置投票数</a>
                </span>
              </div>
            </div>
            <div class="opeWrp">
              <a href="javascript:;" class="aLink" @click="cancel(item.id)">取消关联</a>
            </div>
          </div>

          <div class="commentTypeWrp">
           排名:
           <span>{{item.antiqueStatisticsDto !==undefined ? (item.antiqueStatisticsDto.rank !==undefined ? item.antiqueStatisticsDto.rank : "未上榜") : (item.rank!==undefined ? item.rank : "未上榜")}}</span>
           文物名称:
           <span>{{item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.hometownAntiqueDto.name :item.hometownAntiqueDto.name}}</span>
           文物配图:
           <span>{{item.antiqueStatisticsDto !==undefined ? (item.antiqueStatisticsDto.hometownAntiqueDto.imageList!==undefined ? item.antiqueStatisticsDto.hometownAntiqueDto.imageList.length : 0) : (item.hometownAntiqueDto.imageList!==undefined ? item.hometownAntiqueDto.imageList.length : 0)}}图 <a href="javascript:void(0);" @click="lookImage(item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.hometownAntiqueDto.imageList : item.hometownAntiqueDto.imageList)">查看图片</a></span>
           地域:
           <span>{{item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.hometownAntiqueDto.province :item.hometownAntiqueDto.province}},{{item.antiqueStatisticsDto !==undefined ? item.antiqueStatisticsDto.hometownAntiqueDto.city :item.hometownAntiqueDto.city}}</span>
          </div>
        </li>
      </ul>
    </div>

    <div style="text-align:center" v-if="isLoadMore" >
      <a  href="javascript:void(0)" @click="getMoreData">{{tip}}</a>
    </div>


    <div class="noDataWrp"   v-if="!isLoadMore">
      {{tip}}
    </div>

     <!-- EyChoose begin-->
    <Modal class="eyChoose" title="添加相关内容" v-model="cIsShowModel" :width="800">
      <div class="mt20">
        <label for="" class="lblWrp">搜索：</label>
        <Input v-model.trim="cSearch" @on-enter="cHanleSearch" placeholder="请国宝标题名称" style="width: 250px" />
        <Button type="primary" icon="ios-search" @click="cHanleSearch">查询</Button>
      </div>
      <Table ref="cSelection" class="mt10" border :loading="cLoading" :columns="cColumns" :data="cData"  @on-selection-change="cOnSelectionChange" @on-select-cancel="cOnSelectCancel"></Table>
      <Page class="paging tr mt10" :current.sync="cCurrentPage" :page-size="cPageSize" :total="cTotalItems" show-total show-elevator placement="top" @on-change="cOnChage"></Page>
      <div slot="footer">
        <div class="clearfix">
          <span class="fl sWrp">已选择：{{this.cChoose.length}}个</span>
          <Button type="text" @click="()=>this.cIsShowModel=false">取消</Button>
          <Button type="primary" @click="cHandleSubmit()">确定</Button>
        </div>
      </div>
    </Modal>
    <!-- EyChoose end-->
  <div>
    <VueGallery :images="imageList" :index="index2" @close="index2 = null"></VueGallery>
  </div>
    <SetLike :pLikeIsShowModel="pLikeIsShowModel" :pLikeInfo="pLikeInfo" @updatepLikeIsShowModel="val=>pLikeIsShowModel=val" @updatepLikeInfo="()=>pLikeInfo={}"></SetLike>
    <SetVote :pVoteIsShowModel="pVoteIsShowModel" :pVoteInfo="pVoteInfo" @updatepLikeIsShowModel="val=>pVoteIsShowModel=val" @updatepLikeInfo="()=>pVoteInfo={}"></SetVote>
    </div>
</template>

<script>
import { Table, Button,Page,Row,Col,Modal,Input,Breadcrumb ,BreadcrumbItem } from 'iview';
import { getAntiqueAntiqueList,getAntiqueList,getAntiqueStatisticsList,setAntiqueAntique,deleteAntiqueAntique } from './Culture.service';
import SetLike from './SetLike';
import SetVote from './SetVote';
import VueGallery from 'vue-gallery';
export default {
    name: 'CultureContent',
    components: { Table, Button,Page,Col,Row,Modal,Input,Breadcrumb ,BreadcrumbItem,SetLike,SetVote,VueGallery },
    data() {
        return {
          imageList: [
          'https://dummyimage.com/800/ffffff/000000',
          'https://dummyimage.com/1600/ffffff/000000',
          'https://dummyimage.com/1280/000000/ffffff',
          'https://dummyimage.com/400/000000/ffffff',
        ],
          index2: null,
          storage: true,
          dataList:[],
          isDelete:true,
          customerId:0,
          isLoadContent:true,
          antiqueId:0,
          antiqueName:'',
          cIsShowModel:false,
          cSearch: '',
          loading:false,
          tip:'加载更多',
          cData: [],
          cLoading: false,
          totalItems:0,
          cTotalItems: 0,
          cPageNo: 1,
          dPageNo:1,
          cPageSize: 10,
          isLoadMore:true,
          cSelectAll:false,
          sortField:'likeNum,id',
          pLikeIsShowModel:false,
          pVoteIsShowModel:false,
          pLikeInfo:{},
          pVoteInfo:{},
          sort:'',

          cChoose: [],
          cCurIds: [],
          cColumns:[
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: "编号",
              key: "id",
              align: 'center',
              width: 100,
            },
            {
              title: "国宝标题",
              key: "name",
              align: 'center',
              render(h,params){
                const {name} = params.row;
                return(
                  <p>{name}</p>
                )
              }
            },
            {
              title: "创建时间",
              key: "gmtCreate",
              align: 'center',
              render(h,params){
                const {gmtCreate} = params.row;
                return(
                  <p>{gmtCreate}</p>
                )
              }
            },

          ],
          currentPage:1,
          cCurrentPage:1,
          pageNo:1,
          pageSize:10,
          region:''
        }
    },
    created(){
        if(this.$route.query.antiqueId ){
          this.antiqueId = this.$route.query.antiqueId;
          console.log(this.antiqueId);
        }
        if(this.$route.query.antiqueName ){
          this.antiqueName = this.$route.query.antiqueName;
          console.log(this.antiqueName);
        }
    },
    mounted() {
      this.getMoreData();
    },
    methods: {

      getMoreData(){
          if(this.isLoadContent){
            this.getDataList();
          }else{
            this.getBlurData();
          }
      },
      async getBlurData(){
            const params = {
                pageNo:this.dPageNo,
                pageSize:this.pageSize,
                sort:this.sort,
                sortField:this.sortField,
                customerId:this.customerId,
                searchInfo:JSON.stringify({
                 name:this.antiqueName,
                 notRelation:this.antiqueId
                })
              };
              const {code, msg, data} = await getAntiqueStatisticsList(params)
              if(code ===10000 || code==='10000') {

                this.dataList = [...this.dataList,...data.antiqueList];
                if(this.isDelete){
                    let index = this.dataList.findIndex((item)=>item.id == this.antiqueId );
                    console.log(index);
                    this.dataList.splice(index,1);
                }

                if( data.antiqueList.length<10){

                      this.isLoadMore= false;
                      this.tip = '暂更多无数据';
                      console.log(this.isLoadMore);
                }else{
                  this.dPageNo++;
                }
              }else{
                this.$Message.error(msg);
              }
      },
      async getDataList(){
        const params = {
          antiqueId:this.antiqueId,
          pageNo:this.pageNo,
          pageSize:this.pageSize,
          customerId:this.customerId
        }
        const {code, msg, data} = await getAntiqueAntiqueList(params)
        if(code ===10000 || code==='10000') {
          this.loading = false;
          this.dataList = [...this.dataList,...data.antiqueList];
          console.log(this.dataList);
          if(data.antiqueList.length<10){
            this.isLoadContent = false;
            console.log(this.isLoadContent);
            if(data.antiqueList.length==0){
              this.isDelete=false;
            }
            this.getBlurData();
          }else{
            this.pageNo++;
          }

        }else{
          this.$Message.error(msg);
        }
      },
      async getRepDataList(){
        const params = {
          pageNo:this.cPageNo,
          pageSize:this.pageSize,
          searchInfo:JSON.stringify({
            antiqueName:this.cSearch,
            antiqueId:this.antiqueId
          })
        };
        const {code, msg, data} = await getAntiqueList(params)
        if(code ===10000 || code==='10000') {
          this.cLoading = false;
          this.cData = data.antiqueList;
          this.cTotalItems = data.totalItems;
        }else{
          this.$Message.error(msg);
        }
      },
      lookImage(images){
        this.imageList=[];
        if(images && images.length){
          for(let i=0;i<images.length;i++){
            this.imageList.push(images[i].imageUrl);
          }
        this.index2 =0;
        }

    },
      setLike({
        antiqueId,
        likeNum
      }) {
      this.pLikeInfo = {
        antiqueId,
        likeNum
      };
      console.log(this.pLikeInfo);
      this.pLikeIsShowModel = true;
    },
    setVote({
        antiqueId,
        voteNum
      }) {
      this.pVoteInfo = {
        antiqueId,
        voteNum
      };
      console.log(this.pVoteInfo);
      this.pVoteIsShowModel = true;
    },
    showModal(){
      this.cIsShowModel = true;
      this.cSearch = '';
      this.cChoose=[];
      this.cPageNo = 0;
      this.cCurrentPage =1;
      this.getRepDataList();
    },
    cHanleSearch() {
      this.cCurrentPage = 1;
      this.cPageNo =0;
      this.getRepDataList();
    },
    cHandleSubmit() {
      const ids = this.cChoose.join(',');
      console.log(this.antiqueId);
      this.addRelation(this.antiqueId, ids);

      // 调用接口插入
      // To do something...
    },
    deleteBatch() {
      const selection = this.$refs.selection.getSelection();
      if(selection.length>0){
        const arr = [];
        console.log(selection);
        selection.map((item, i) => {
          arr.push(item.id);
        });
        const ids = arr.join(',');

        this.cancel(ids);
      }else{
        this.$Message.warning("请选择要取消关联的作品");
      }
    },
    cancel(id) {
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要取消关联吗？</p>`,
        onOk: () => {
            this.delete(id);
        }
      });
    },
     async addRelation(id,ids){

      const { code,msg} = await setAntiqueAntique({
          antiqueId:id,
          relationAntiqueIds:ids
        });

      if (code === 10000) {
        this.cIsShowModel = false;
        setTimeout(()=>{
           this.getDataList();
        },1000)
          this.cChoose=[];
          this.$Message.success(msg);
        } else {
            this.$Message.error(msg);
            this.cChoose=[];
        }
    },


    async delete(ids) {
			const { code, msg } = await deleteAntiqueAntique({
        ids: ids
			});
			if (code === 10000 || code === "10000") {
        this.$Message.success(msg);
        let index = this.dataList.findIndex((item)=>item.id == ids);
        console.log(index);
				this.dataList.splice(index,1);
			} else {
				this.$Message.error(msg);
			}
		},
    isInArray(arr, value) {
      for (var i = 0; i < arr.length; i++) {
        if (value == arr[i]) {
          return true;
        }
      }
      return false;
    },
    onChage(pageNo) {
      this.pageNo = pageNo;
      this.getDataList();
    },
    cOnChage(pageNo) {
       this.cChoose=[];
      this.cPageNo = pageNo;
      this.getRepDataList();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getDataList();
    },
    cOnSelectionChange(selection) {
      // console.log(selection, 'onSelectionChange');
      if(selection.length>0){
        selection.map((item, i) => {
          if(this.cChoose.indexOf(item.id)>-1){
            return
          }else {
            this.cChoose.push(item.id);
          }
        })
      }else{
        this.cChoose = [];
      }
      console.log(this.cChoose);
    },
    cOnSelectCancel(selection, row) {
      this.cChoose = this.cChoose.filter(o => o != row.id);
    },
      changePage(pageNo){
         this.pageNo = pageNo;
         this.getDataList();
      }
    }
}
</script>
<style lang="less">
@import "./../../Comment/comment.less";
.noDataWrp{
  text-align:center;
}
</style>

