<template>
    <div id="index">
      <div class="artPeople">
        <fieldset class="fieldset">
          <legend>查询条件</legend>
          <div class="search">
            <div>
              <label for="city">展览名：</label>
              <Input id="city" v-model="ExhibitionName" placeholder="输入展览名" clearable style="width: 180px" />
            </div>
            <!--<div>-->
              <!--<label for="museum">博物馆id：</label>-->
              <!--<Input id="museum" v-model="museumId" placeholder="输入博物馆id" clearable style="width: 180px" />-->
            <!--</div>-->
            <Button type="primary" icon="ios-search" @click="search">查询</Button>
          </div>
        </fieldset>
      </div>
        <Table ref="selection" :columns="columns" :data="dataList" border :loading="loading"></Table>
        <div class="mt20 textRight">
          <Page :total="totalItems" :current.sync="currentPage" show-elevator show-total @on-change="changePage"></Page>
        </div>
     <!-- EyChoose begin-->
    <!-- EyChoose end-->
    </div>
</template>

<script>
import { Table, Button,Page,Row,Col,Modal,Input,Breadcrumb ,BreadcrumbItem,Form,FormItem,Icon,RadioGroup,Radio } from 'iview';
import { getBwgExhibitionList } from './Index.service';
export default {
    name: 'Brand',
    components: { Table, Button,Page,Col,Row,Modal,Input,Breadcrumb ,BreadcrumbItem,Form,FormItem,Icon,RadioGroup,Radio},
    data() {
      let that = this;
      return {
          city: '',
          museumName: '',
          ExhibitionName: '',
          museumId:  '',
          dataList:[],
          loading:true,
          currentPage:1,
          totalItems:0,
          pageNo:0,
          pageSize:10,
          columns:[
            {
              title: '编号',
              align:"center",
              key: 'id'
            },
            // {
            //   title: '城市',
            //   key: 'city',
            //   align:'center'
            // },
            // {
            //   title: '博物馆名称',
            //   key: 'museumName',
            //   align:'center'
            // },
            // {
            //   title: '馆藏数量',
            //   key: 'number',
            //   align:'center'
            // },
            // {
            //   title: '地址',
            //   key: 'address',
            //   align:'center'
            // },
            {
              title: '简介',
              key: 'description',
              align:'center',
              render:function(h,params){
                if(params.row.description){

                }
                return (<div onClick={()=>{
                  that.$Modal.info({
                    title: '简介详情',
                    content: params.row.description
                  })
                }
              }>{params.row.description?params.row.description.slice(0,20)+ '...': '暂无'}</div>)
              }
            },
            {
              title: '标题',
              key: 'title',
              align:'center'
            },
            {
              title: 'logo图',
              key: 'placardUrl',
              align:'center',
              width: '200',
              render:function(h,params){
                if(params.row.placardUrl){
                  return (<img class='img' src={params.row.placardUrl}/>)
                }else{
                  return (<div>暂无</div>)
                }
              }
            },
            {
              title: '时间',
              key: 'showTime',
              align:'center'
            }
            ,
            // {
            //   title: '操作',
            //   align:'center',
            //   render:function(h,params){
            //     return (<div>
            //               <div class='edit' onClick={()=>{
            //                     alert('123')}
            //                }>展览</div>
            //               <div class='edit' onClick={()=>{
            //                       alert('456')}
            //               }>作品</div></div>)
            //   }
            // }
          ]
        }
    },

    mounted() {
      this.getDataList()
    },
    methods: {
      async getDataList(){
        const params = {
          searchInfo: JSON.stringify({museumId: this.$route.query.id,ExhibitionName: ''}),
          pageNo:this.pageNo,
          pageSize:this.pageSize,
          sortField: '',
          sort: ''
        }
        const {code, msg, data} = await getBwgExhibitionList(params)
        if(code ===10000 || code==='10000') {
          this.loading = false;
          this.dataList = data.data;
          this.totalItems = data.totalPages;
        }else{
          this.$Message.error(msg);
        }
      },
      async search(){
        const params = {
          searchInfo: JSON.stringify({museumId: this.$route.query.id,exhibitionName: this.ExhibitionName}),
          pageNo:this.pageNo,
          pageSize:this.pageSize,
          sortField: '',
          sort: ''
        }
        const {code, msg, data} = await getBwgExhibitionList(params)
        if(code ===10000 || code==='10000') {
          this.loading = false;
          this.dataList = data.data;
          this.totalItems = data.totalPages;
        }else{
          this.$Message.error(msg);
        }
      },
    async addItem() {
      this.formValidate.isExclusive = this.formValidate.isExclusive =="是"? 1 : 0;
      console.log(this.formValidate);
      const {code,msg} = await setResourceInfo({
        resourceInfo: JSON.stringify(this.formValidate)
      })
			if (code === 10000) {
				this.$Message.success(msg);
        this.getDataList();
        this.cIsShowModel = false;
        this.$refs["formValidate"].resetFields();
			} else {
				this.$Message.error(msg);
			}
		},
    showModal(){
      this.cIsShowModel = true;
      this.formValidate={
              id:0,
              url: '',
              name: '',
              isExclusive:'否',
              type:4
		    	}
    },
    cOnChage(pageNo) {
      this.cPageNo = pageNo;
      this.getDataList();
    },
    editItem(item) {
      this.$refs['formValidate'].resetFields();
      this.isLitUploadOk = true;
			this.formValidate = {
				id: item.id,
				name: item.name,
				url: item.url !== undefined ? item.url : "",
				isExclusive: item.isExclusive ==1 ? "是" : "否",
				type: 4
      };
      console.log(this.formValidate);
      this.cIsShowModel = true;
		},
    cancel(id) {
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除吗？</p>`,
        onOk: () => {
            this.delete(id);
        }
      });
    },
    handleSubmit(){
        this.$refs["formValidate"].validate((valid) => {
          if(valid){
            this.addItem();
          }
        })
    },
		getImageUrl(file) {
			this.isArtImgUploadOk = true;
			this.formValidate.url = file.url;
		},
		getLitImgUrl(file) {
			this.isLitUploadOk = true;
			this.formValidate.url = file.url;
		},
		uploadExceededSize() {
			this.$Message.error("文件超出大小限制!");
		},
		uploadError(error) {
			this.isUploadOk = false;

		},
		resetImg() {
			this.isUploadOk = false;
			this.formValidate.url = "";
		},
		uploadOk() {
			this.isUploadOk = true;
		},
    async delete(ids) {
			const { code, msg } = await deleteResourceInfo({
        ids: ids
			});
			if (code === 10000 || code === "10000") {
				this.getDataList();
			} else {
				this.$Message.error(msg);
			}
		},
      changePage(pageNo){
         this.pageNo = pageNo;
         this.getDataList();
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
    }
}
</script>
<style lang="less">
@import "../../../libs/css/constant.less";
#index{
  .ivu-table-wrapper{
    margin-top: 50px;
  }
}
  .edit{
    color: blue;
  }
  .img{
    width:150px;
    height: 150px;
  }
</style>

