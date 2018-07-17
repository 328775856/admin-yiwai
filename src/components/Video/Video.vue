<template>
  <div id="video">
        <Row type="flex" justify="space-between" align="middle">
          <Col span="10"><EyFilter :data="filterData" @get-item="getItem"></EyFilter></Col>
          <Col span="3" style="text-align:right"> <Button type="primary" icon="plus" class="mt10" @click="()=>{this.pIsShowModel=true;}">上传素材</Button></Col>
      </Row>
    <Table class="mt10" border :loading="loading" :columns="columns" :data="dataList" @on-sort-change="onSortChange"></Table>
    <Page class="paging tr mt10" :current.sync="currentPage" :total="totalItems" show-total show-elevator :page-size-opts="[10,20,30]" placement="top" @on-change="onChage" @on-page-size-change="onPageSizeChange"></Page>
    <AddVideo :pIsShowModel="pIsShowModel" @updatepIsShowModel="val=>pIsShowModel=val"></AddVideo>
  </div>
</template>

<script>
import { Table, Page, Button, Input,Row,Col } from "iview";
import AddVideo from './AddVideo.vue'
import EyFilter  from '../Common/EyFilter/EyFilter'
import {
  getMaterialList,
  setMaterial,
  deleteMaterial
} from "./Video.service";
export default {
  name: "Video",
  components: { Table, Page, Button, Input, AddVideo,EyFilter,Row,Col },
  props: {
    isVirtual: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      searchInfo: '',
      pageNo: 1,
      currentPage:1,
      pageSize: 10,
      sortField: "",
      sort: "DESC",
      totalItems: 0,
      materialType:0,
      pIsShowModel: false,
      loading: true,
      filterData:[
          {key:'',value:'全部',isActive:true},
          {key:1,value:'视频'},
          {key:2,value:'音频'}
        ],
      columns: [
        {
          title: "编号",
          key: "id",
          align: 'center',
          width: 100
        },
        {
          title: "标题",
          key: "title",
          align: 'center'
        },
        {
          title: "链接",
          key: "",
          align: 'center',
          render: (h, params) => {
            const { row } = params;
            return (
              <div class="copyWrp">
                <p>{row.materialUrl}</p>
                <span class="edit" v-clipboard={row.materialUrl} onSuccess={(e) => this.$Message.success('复制成功')}>复制链接</span>
              </div>
            );
          }
        },
        {
          title: "播放量",
          key: "clickNum",
          align: 'center',
          sortable: 'custom'
        },
        {
          title: "创建时间",
          key: "gmtCreate",
          align: 'center'
        },
        {
          title: "类型",
          key: "type",
          align: 'center',
          render:(h,params) =>{
            const {materialType} = params.row;
            return (
              <p>{materialType===1 ? "视频" : "音频" }</p>
            )
          }
        },
        {
          title: "操作",
          key: "",
          align: 'center',
          render: (h, params) => {
            return (
              <div class="operateWrp">
                <p><span class="edit" onClick={() => this.deleteMaterial(params.row)}>删除</span></p>
              </div>
            );
          }
        }
      ],

      dataList: []
    };
  },
  mounted() {
    this.getMaterialList();
  },
  methods: {
   async getMaterialList() {
      const postData = {
        pageNo:this.pageNo,
        pageSize:this.pageSize,
        sort:this.sort,
        materialType:this.materialType
      };
      const {code, msg,data} = await getMaterialList(postData);
      if(code ===10000 | code ==="10000"){
        this.loading = false;
        this.totalItems = data.totalItems;
        this.dataList = data.materialList;
      }
    },
    onChage(pageNo) {
      this.pageNo = pageNo;
      this.getMaterialList();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getMaterialList();
    },
    deleteMaterial(row) {
      const { id } = row;
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除该视频吗？</p>`,
        onOk: () => {
          deleteMaterial({ materialId: id }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success('删除成功！');
              this.getMaterialList();
            }
          });
        },
        onCancel: () => {
        }
      });
    },
    onSortChange({ column, key, order }) {
      this.sort = 'normal' == order ? '' : (order + '').toUpperCase();
      this.getMaterialList();
    },
    getItem({key,value}){
      this.pageNo =0;
      this.currentPage = 1;
      if(key){
        this.materialType = key;
      }else{
        this.materialType =0;
      }
      this.getMaterialList();
    },
  }
};
</script>

<style lang="less">
@import "../../libs/css/common.less";
#video {
  .copyWrp {
    margin: 10px 0;
  }
}
</style>
