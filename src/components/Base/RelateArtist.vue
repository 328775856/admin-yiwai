<template>
    <div id="relateArtist">
      <Breadcrumb separator=">" class="breadCrumb">
        <div>当前位置:</div>
        <BreadcrumbItem to="/Base">三级人物管理</BreadcrumbItem>
        <BreadcrumbItem>关联艺术家管理</BreadcrumbItem>
      </Breadcrumb>
      <div class="mb20">
        <Row type="flex" justify="space-between" align="middle">
            <Col span="16"><Button type="primary"  class="mt10" @click="deleteBatch">批量取消</Button><p style="font-size:14px;line-height:1.4;">提示:最多关联6个艺术家</p></Col>
            <Col span="3" style="text-align:right"><Button type="primary" icon="plus" class="add" @click="showModal">关联艺术家</Button></Col>
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
        <Input v-model.trim="cSearch" @on-enter="cHanleSearch" placeholder="请输入艺术家名称" style="width: 250px" />
        <Button type="primary" icon="ios-search" @click="cHanleSearch">查询</Button>
      </div>
      <Table ref="cSelection" class="mt10" border :loading="cLoading" :columns="cColumns" :data="cData"  @on-selection-change="cOnSelectionChange" @on-select-cancel="cOnSelectCancel"></Table>
      <Page class="paging tr mt10" :current.sync="cCurrentPage" :page-size="cPageSize" :total="cTotalItems" show-total show-elevator placement="top" @on-change="cOnChage"></Page>
      <div slot="footer">
        <div class="clearfix">
          <span class="fl sWrp">已选择：{{this.cChoose.length}}艺术家</span>
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
import { getArtistArtistList,setArtistArtist,deleteArtistArtist,getArtistStatisticsList } from './Base.service';

export default {
    name: 'Job',
    components: { Table, Button,Page,Col,Row,Modal,Input,Breadcrumb ,BreadcrumbItem },
    data() {
        return {
          dataList:[],
          cIsShowModel:false,
          artistId:Number(this.$route.query.artistId),
          cSearch: '',
          loading:true,
          cData: [],
          cLoading: false,
          totalItems:0,
          cTotalItems: 0,
          cPageNo: 1,
          cPageSize: 10,
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
              width: 100,
              render(h,params){
                const {id} = params.row.artistDto;
                return(
                  <p>{id}</p>
                )
              }
            },
            {
              title: "艺术家名称",
              key: "name",
              align: 'center',
              render(h,params){
                const {name} = params.row.artistDto;
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
                const {gmtCreate} = params.row.artistDto;
                return(
                  <p>{gmtCreate}</p>
                )
              }
            },

          ],
          currentPage:1,
          cCurrentPage:1,
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
              key: 'relationArtistId'
            },
            {
              title: '艺术家名称',
              key: 'relationArtistName'
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
        const {code, msg, data} = await getArtistArtistList(params)
        if(code ===10000 || code==='10000') {
          this.loading = false;
          this.dataList = data.artistArtistList;
          this.totalItems = data.totalItems;
        }else{
          this.$Message.error(msg);
        }
      },
      async getRepDataList(){
        const params = {
          pageNo:this.cPageNo,
          pageSize:this.cPageSize,
          searchInfo:JSON.stringify({
            artistName:this.cSearch,
            relationArtistId:this.artistId
        }),
        sortField:'',
        sort:''
        }
        const {code, msg, data} = await getArtistStatisticsList(params)
        if(code ===10000 || code==='10000') {
          this.cLoading = false;
          this.cData = data.artistList;
          this.cTotalItems = data.totalItems;
        }else{
          this.$Message.error(msg);
        }
      },

    showModal(){
      this.cIsShowModel = true;
      this.cSearch = '';
      this.cChoose=[];
      this.cPageNo = 0;
      this.cCurrentPage =1;
      this.getRepDataList();
    },
    cOnChage(pageNo) {
      this.cChoose =[];
      this.cPageNo = pageNo;
      this.getRepDataList();
    },
    cHanleSearch() {
      this.cCurrentPage = 1;
      this.cPageNo =0;
      this.getRepDataList();
    },
    cHandleSubmit() {
      if((this.cChoose.length*1 + this.totalItems*1)>6){
        this.$Message.warning("最多关联6个艺术家");
        return;
      }
      const ids = this.cChoose.join(',');
      const artistId = Number(this.$route.query.artistId);
      this.addRelationArtist(artistId, ids);
      this.cIsShowModel = false;
      this.getDataList();
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
     async addRelationArtist(artistId,relationArtistIds){

      const { code,msg} = await setArtistArtist({
          artistId:artistId,
          relationArtistIds:relationArtistIds
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
    async delete(productId) {
			const { code, msg } = await deleteArtistArtist({
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
          if(this.cChoose.indexOf(item.artistId)>-1){
            return
          }else {
            this.cChoose.push(item.artistId);
          }
        })
      }else{
        this.cChoose = [];
      }
      console.log(this.cChoose);
    },
    cOnSelectCancel(selection, row) {
      this.cChoose = this.cChoose.filter(o => o != row.artistId);
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

