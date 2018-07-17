<template>
    <div id="relateProduct">
      <Breadcrumb separator=">" class="breadCrumb">
        <div>当前位置:</div>
        <BreadcrumbItem to="/Base">三级人物管理</BreadcrumbItem>
        <BreadcrumbItem>相关商品管理</BreadcrumbItem>
      </Breadcrumb>
      <div class="mb20">
        <Row type="flex" justify="space-between" align="middle">
            <Col span="4"><Button type="primary"  class="mt10" @click="deleteBatch">批量取消</Button></Col>
            <Col span="3" style="text-align:right"><Button type="primary" icon="plus" class="add" @click="showModal">添加商品</Button></Col>
        </Row>
      </div>
        <Table ref="selection" :columns="columns" :data="dataList" border :loading="loading"></Table>
        <div class="mt20 textRight">
          <Page :total="totalItems" :current.sync="currentPage" show-elevator show-total @on-change="changePage"></Page>
        </div>

     <!-- EyChoose begin-->
    <Modal class="eyChoose" title="添加商品" v-model="cIsShowModel" :width="800">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <Form-item label="封面:" prop="cover">
                <EyUpload @upload-ok="getLitImgUrl" @upload-error="uploadError"  @upload-exceeded-size="uploadExceededSize" :maxSize="1024" imgSizeText="图片大小不超过1M"  accept="image/gif,image/jpeg,image/jpg,image/png"/>
                <p v-show="isLitUploadOk">
                    <div class="imgWrp mt20" v-show="formValidate.cover">
                        <img :src="formValidate.cover+'?imageView2/1/w/135/h/165/q/50'"  class="img headImg">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                    </div>
                </p>
                <!-- <div style="color:#ed3f14;padding-top:6px; line-height:1;position:absolute;top:100%;left:0;" v-show="!formValidate.image">图片不能为空</div> -->
          </Form-item>
        <Form-item label="商品名称:" prop="name">
            <Input v-model.trim="formValidate.name"  placeholder="请输入商品名称"></Input>
        </Form-item>
          <Form-item label="商品链接:" prop="link">
            <Input v-model="formValidate.link"  placeholder="请输入商品链接"></Input>
        </Form-item>
        </Form>
      <div slot="footer">
        <div class="clearfix">
          <Button type="text" @click="()=>this.cIsShowModel=false">取消</Button>
          <Button type="primary" @click="handleSubmit">确定</Button>
        </div>
      </div>
    </Modal>
    <!-- EyChoose end-->
    </div>
</template>

<script>
import { Table, Button,Page,Row,Col,Modal,Input,Breadcrumb ,BreadcrumbItem,Form,FormItem,Icon } from 'iview';
import { getArtistMerchandisetList,setArtistMerchandise,deleteArtistMerchandise } from './Base.service';
import EyUpload from '../Common/EyUpload/EyUpload';
export default {
    name: 'Job',
    components: { Table, Button,Page,Col,Row,Modal,Input,Breadcrumb ,BreadcrumbItem,Form,FormItem,EyUpload,Icon},
    data() {
        return {
          isUploadOk:false,
          isLitUploadOk:false,
          dataList:[],
          formValidate: {
              id:0,
              artistId:Number(this.$route.query.artistId),
              cover: '',
              name: '',
              link: '',
		    	},
          ruleValidate: {
            cover: [{ required: true, message: "封面不能为空", trigger: "blur" }],
            name: [
              { required: true, message: "商品名称不能为空", trigger: "blur" }
            ],
            link: [{ required: true, message: "商品链接不能为空", trigger: "blur" }]
          },
          cIsShowModel:false,
          loading:false,
          currentPage:1,
          totalItems:0,
          pageNo:0,
          pageSize:10,
          columns:[
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '编号',
              key: 'id'
            },
            {
              title: '商品名称',
              key: 'name'
            },
            {
              title: '创建时间',
              key: 'gmtCreate'
            },
            {
              title: '操作',
              key: 'action',
              render:(h,params) =>{
                const {id} = params.row;
                const item = params.row;
                return (
                  <div class="action">
                    <a href="javascript:void(0)" class="action-item" onClick={()=>this.edit(item)}>编辑</a>
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
            artistId:Number(this.$route.query.artistId)
          }),
          sortField:'',
          sort:''
        }
        const {code, msg, data} = await getArtistMerchandisetList(params)
        if(code ===10000 || code==='10000') {
          this.loading = false;
          this.dataList = data.artistMerchandiseList;
          this.totalItems = data.totalItems;
        }else{
          this.$Message.error(msg);
        }
      },
    edit(data){
          for (let item in data) {
            if (data.hasOwnProperty(item) && this.formValidate.hasOwnProperty(item)) {//筛选过滤赋值formValidate
              this.formValidate[item] = data[item]
            }
          }
          this.cIsShowModel = true;
    },
    async addItem() {
			const { code, msg } = await setArtistMerchandise({
        artistMerchandiseInfo:JSON.stringify(this.formValidate)
      });
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
      this.formValidate.id=0;
    },
    cOnChage(pageNo) {
      this.cPageNo = pageNo;
      this.getDataList();
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
        console.log(ids);
        this.cancel(ids);
      }else{
        this.$Message.warning("请选择要取消关联的商品");
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
    handleSubmit(){
        this.$refs["formValidate"].validate((valid) => {
          if(valid){
            this.addItem();
          }
        })
    },
		getImageUrl(file) {
			this.isArtImgUploadOk = true;
			this.formValidate.cover = file.url;
		},
		getLitImgUrl(file) {
			this.isLitUploadOk = true;
			this.formValidate.cover = file.url;
		},
		uploadExceededSize() {
			this.$Message.error("文件超出大小限制!");
		},
		uploadError(error) {
			this.isUploadOk = false;

		},
		resetImg() {
			this.isUploadOk = false;
			this.formValidate.cover = "";
		},
		uploadOk() {
			this.isUploadOk = true;
		},
    async delete(productId) {
			const { code, msg } = await deleteArtistMerchandise({
        ids: productId
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
      }
    }
}
</script>
<style lang="less">
@import "../../libs/css/constant.less";
  .imgWrp {
    .closeIcon {
      cursor: pointer;
      position: absolute;
      top: -8px;
      right: -8px;
      background: #fff;
    }
    border: 1px solid @GRAY-50;
    height: 200px;
    width: 200px;
    position: relative;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>

