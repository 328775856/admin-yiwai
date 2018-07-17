<template>
    <div id="relateArticle">
      <Breadcrumb separator=">" class="breadCrumb">
        <div>当前位置:</div>
        <BreadcrumbItem to="/Base">三级人物管理</BreadcrumbItem>
        <BreadcrumbItem>相关文章管理</BreadcrumbItem>
      </Breadcrumb>
      <div class="mb20">
        <Row type="flex" justify="space-between" align="middle">
            <Col span="16"><Button type="primary"  class="mt10" @click="deleteBatch">批量取消</Button></Col>
            <Col span="3" style="text-align:right"><Button type="primary" icon="plus" class="add" @click="showModal">添加相关文章</Button></Col>
        </Row>
      </div>
        <Table ref="selection" :columns="columns" :data="dataList" border :loading="loading"></Table>
        <div class="mt20 textRight">
          <Page :total="totalItems" :current.sync="currentPage" show-elevator show-total @on-change="changePage"></Page>
        </div>
     <!-- EyChoose begin-->
    <Modal class="eyChoose" title="添加代表作品" v-model="cIsShowModel" :width="800">
      <div class="mt20">
        <label for="" class="lblWrp">搜索：</label>
        <Input v-model.trim="cSearch" @on-enter="cHanleSearch" placeholder="请输入文章名称" style="width: 250px" />
        <Button type="primary" icon="ios-search" @click="cHanleSearch">查询</Button>
      </div>
      <Table ref="cSelection" class="mt10" border :loading="cLoading" :columns="cColumns" :data="cData"  @on-selection-change="cOnSelectionChange" @on-select-cancel="cOnSelectCancel"></Table>
      <Page class="paging tr mt10" :current.sync="cCurrentPage" :total="cTotalItems" show-total show-elevator placement="top" @on-change="cOnChage"></Page>
      <div slot="footer">
        <div class="clearfix">
          <span class="fl sWrp">已选择：{{this.cChoose.length}}篇文章</span>
          <Button type="text" @click="()=>this.cIsShowModel=false">取消</Button>
          <Button type="primary" @click="cHandleSubmit()">确定</Button>
        </div>
      </div>
    </Modal>
    <!-- EyChoose end-->
    </div>
</template>

<script>
import { Table, Button,Page,Row,Col,Modal,Input,Breadcrumb ,BreadcrumbItem } from 'iview';
import { getArtistArticleList,getArticleList,setArtistArticle,deleteArtistArticle } from './Base.service';

export default {
    name: 'Job',
    components: { Table, Button,Page,Col,Row,Modal,Input,Breadcrumb ,BreadcrumbItem},
    data() {
        return {
          dataList:[],
          cIsShowModel:false,
          cSearch: '',
          artistId:Number(this.$route.query.artistId),
          loading:false,
          cData: [],
          cLoading: false,
          totalItems:0,
          cTotalItems: 0,
          cPageNo: 0,
          cPageSize: 10,
          cCurrentPage:1,
          cSelectAll:false,
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
              width: 100
            },
            {
              title: "文章名称",
              key: "title",
              align: 'center',
            },
            {
              title: "创建时间",
              key: "gmtCreate",
              align: 'center',
            },

          ],
          currentPage:1,
          pageNo:0,
          pageSize:10,
          region:'',
          columns:[
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '编号',
              key: 'articleId'
            },
            {
              title: '文章标题',
              key: 'articleTitle'
            },
            {
              title: '创建时间',
              key: 'gmtCreate'
            },
            {
              title: '操作',
              key: 'action',
              render:(h,params) =>{
                const data = params.row;
                const {id} = params.row;
                return (
                  <div class="action">
                    <a href="javascript:void(0)" class="action-item" onClick={()=>this.cancel(id)}>删除</a>
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
      async getDataList(){
        const params = {
          pageNo:this.pageNo,
          pageSize:this.pageSize,
          searchInfo:JSON.stringify({
            artistId:this.artistId
          }),
          sortField:'',
          sort:''
        }
        const {code, msg, data} = await getArtistArticleList(params)
        if(code ===10000 || code==='10000') {
          this.loading = false;
          this.dataList = data.artistArticleList;
          this.totalItems = data.totalItems;
        }else{
          this.$Message.error(msg);
        }
      },
      async getRepDataList(){
        const params ={
          pageNo:this.cPageNo,
          pageSize:this.cPageSize,
          sortField:'browseNum,id',
          sort:'DESC',
          searchInfo:JSON.stringify({
            title:this.cSearch,
            artistId:this.artistId
          })
        }
        const {code, data,msg } = await getArticleList(params);
        if(code ===10000 || code === '10000'){
          this.cData = data.data;
          this.cTotalItems = data.totalItems;
          this.loading2 = false;
        }else{
          this.$Message.error(msg);
        }
      },
    async addArticle(artistId,articleIds){
      const { code,msg} = await setArtistArticle({
          artistId:artistId,
          articleIds:articleIds
        });

      if (code === 10000) {
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
    showModal(){
      this.cIsShowModel = true;
      this.cSearch = '';
      this.cPageNo =0;
      this.cCurrentPage =1;
       this.cChoose=[];
      this.getRepDataList();
    },
    cOnChage(pageNo) {
       this.cChoose=[];
      this.cPageNo = pageNo;
      this.getRepDataList();
    },
    cHanleSearch() {
        this.getRepDataList();
    },
    cHandleSubmit() {
      const ids = this.cChoose.join(',');
      console.log(ids);
      const artistId = Number(this.$route.query.artistId);
      this.addArticle(artistId, ids);
      this.cIsShowModel = false;
      this.loading = true;

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
    async delete(productId) {
			const { code, msg } = await deleteArtistArticle({
        ids: productId
			});
			if (code === 10000 || code === "10000") {
				this.getDataList();
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

</style>

