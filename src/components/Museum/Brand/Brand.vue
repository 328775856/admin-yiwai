<template>
    <div id="relateProduct">
      <div class="mb20">
        <Row type="flex" justify="space-between" align="middle">
            <Col span="4"></Col>
            <Col span="3" style="text-align:right"><Button type="primary" icon="plus" class="add" @click="showModal">添加品牌</Button></Col>
        </Row>
      </div>
        <Table ref="selection" :columns="columns" :data="dataList" border :loading="loading"></Table>
        <div class="mt20 textRight">
          <Page :total="totalItems" :current.sync="currentPage" show-elevator show-total @on-change="changePage"></Page>
        </div>
     <!-- EyChoose begin-->
    <Modal class="eyChoose" title="添加品牌" v-model="cIsShowModel" :width="800">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <Form-item label="图片" prop="url">
                <EyUpload @upload-ok="getLitImgUrl" @upload-error="uploadError"  @upload-exceeded-size="uploadExceededSize" imgSizeText="最大高宽161px X 161px 图片不能超过50K" :maxSize="50"  accept="image/gif,image/jpeg,image/jpg,image/png"/>
                <p v-show="isLitUploadOk">
                    <div class="imgWrp mt20" v-show="formValidate.url">
                      <img :src="formValidate.url+'?imageView2/1/w/135/h/165/q/50'"  class="img headImg">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                    </div>
                </p>
                <!-- <div style="color:#ed3f14;padding-top:6px; line-height:1;position:absolute;top:100%;left:0;" v-show="!formValidate.image">图片不能为空</div> -->
          </Form-item>
        <Form-item label="品牌名称" prop="name">
            <Input v-model.trim="formValidate.name"  placeholder="请输入品牌名称"></Input>
        </Form-item>
        <FormItem label="是否战略合作" prop="isExclusive" class="formItem100">
              <RadioGroup v-model="formValidate.isExclusive" v-for="(item,index) in nameList" :key="index">
                  <Radio :label="item.value">{{item.label}}</Radio>
              </RadioGroup>
        </FormItem>
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
import { Table, Button,Page,Row,Col,Modal,Input,Breadcrumb ,BreadcrumbItem,Form,FormItem,Icon,RadioGroup,Radio } from 'iview';
import { getResourceList,setResourceInfo,deleteResourceInfo } from './Brand.service';
import EyUpload from '../../Common/EyUpload/EyUpload';
export default {
    name: 'Brand',
    components: { Table, Button,Page,Col,Row,Modal,Input,Breadcrumb ,BreadcrumbItem,Form,FormItem,EyUpload,Icon,RadioGroup,Radio},
    data() {
        return {
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
          pageNo:0,
          pageSize:10,
          columns:[
            {
              title: '编号',
              align:"center",
              key: 'id'
            },
            {
              title: '品牌名称',
              key: 'name',
              align:'center'
            },
            {
              title: '是否战略合作',
              key: 'isExclusive',
              align:'center',
              render(h,params){
                const {isExclusive} = params.row;
                return(
                 <p>{isExclusive==1 ? "是" : "否"}</p>
                )
              }
            },
            {
              title: '创建时间',
              key: 'gmtCreate',
              align:'center'
            },
            {
              title: '操作',
              key: 'action',
              align:'center',
              render:(h,params) =>{
                const {id} = params.row;
                const item = params.row;
                return (
                  <div class="action">
                    <a href="javascript:void(0)" class="action-item" onClick={()=>this.editItem(item)}>编辑</a>
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
          type:4
        }
        const {code, msg, data} = await getResourceList(params)
        if(code ===10000 || code==='10000') {
          this.loading = false;
          this.dataList = data.resourceInfoList;
          this.totalItems = data.totalItems;
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
      }
    }
}
</script>
<style lang="less">
@import "../../../libs/css/constant.less";
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

