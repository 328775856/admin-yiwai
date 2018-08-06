<template>
    <div id="index">
      <div class="artPeople">
        <fieldset class="fieldset">
          <legend>查询条件</legend>
          <div class="search">
            <div>
              <label for="city">城市：</label>
              <Input id="city" v-model="city" placeholder="输入城市" clearable style="width: 180px" />
            </div>
            <div>
              <label for="museum">博物馆：</label>
              <Input id="museum" v-model="name" placeholder="输入博物馆" clearable style="width: 180px" />
            </div>
            <Button type="primary" icon="ios-search" @click="search('art')">查询</Button>
          </div>
        </fieldset>
      </div>
        <Table ref="selection" :columns="columns" :data="dataList" border :loading="loading"></Table>
        <div class="mt20 textRight">
          <Page :total="totalItems" :current.sync="currentPage" show-elevator show-total @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script>
import { Table, Button,Page,Row,Col,Modal,Input,Breadcrumb ,BreadcrumbItem,Form,FormItem,Icon,RadioGroup,Radio } from 'iview';
import { getBwgMuseumList } from './Index.service';
export default {
    name: 'Brand',
    components: { Table, Button,Page,Col,Row,Modal,Input,Breadcrumb ,BreadcrumbItem,Form,FormItem,Icon,RadioGroup,Radio},
    data() {
      let that = this;
      return {
          city: '',
          name: '',
          artData: {},
          isUploadOk:false,
          isLitUploadOk:false,
          dataList:[],
          formValidate: {
              id:0,
              url: '',
              name: '',
              isExclusive:'否',
              type:4
		    	},
          ruleValidate: {
            url: [{ required: true, message: "图片不能为空", trigger: "blur" }],
            name: [
              { required: true, message: "品牌名称不能为空", trigger: "blur" }
            ],
            isExclusive: [{ required: true, message: "请选择是否独家冠名", trigger: "blur" }]
          },
          nameList:[
            {
              value:"是",
              label:"是"
            },{
              value:"否",
              label:"否"
            }
          ],
          cIsShowModel:false,
          loading:true,
          currentPage:1,
          totalItems:0,
          pageNo:1,
          pageSize:10,
          columns:[
            {
              title: '编号',
              align:"center",
              key: 'id'
            },
            {
              title: '城市',
              key: 'city',
              align:'center'
            },
            {
              title: '博物馆名称',
              key: 'name',
              align:'center'
            },
            {
              title: '馆藏数量',
              key: 'number',
              align:'center'
            },
            {
              title: '地址',
              key: 'address',
              align:'center'
            },
            {
              title: '简介',
              key: 'description',
              align:'center'
            },
            {
              title: '海报图',
              key: 'placardUrl',
              align:'center'
            },
            {
              title: 'logo图',
              key: 'logoUrl',
              align:'center'
            },
            {
              title: '联系电话',
              key: 'tel',
              align:'center'
            },
            {
              title: '开闭馆时间',
              key: 'openTime',
              align:'center'
            }
            ,
            {
              title: '操作',
              align:'center',
              render:function(h,params){
                return (<div>
                          <div class='edit' onClick={()=>{
                                that.$router.push({path: '/Exhibition',query:{id:0}})}
                           }>展览</div>
                          <div class='edit' onClick={()=>{
                                  alert('456')}
                          }>作品</div></div>)
              }
            }
          ]
        }
    },

    mounted() {
     // this.getDataList()
    },
    methods: {
      async getDataList(){
        const params = {
          searchInfo: JSON.stringify({
            name: '',
            city: '北京'
          }),
          pageNo:this.pageNo,
          pageSize:this.pageSize,
          sortField: '',
          sort: ''
        }
        const {code, msg, data} = await getBwgMuseumList(params)
        if(code ===10000 || code==='10000') {
          alert(code)
          this.loading = false;
          this.dataList = data.data;
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
      }
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
</style>

