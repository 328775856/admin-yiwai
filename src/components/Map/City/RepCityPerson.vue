<template>
  <div id="repCityPerson">

    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem to="/City">一级城市管理</BreadcrumbItem>
      <BreadcrumbItem>代表人物</BreadcrumbItem>
    </Breadcrumb>

    <div class="clearfix">
      <Button class="fl mt10" type="primary" @click="deleteBatch()" v-if="data.length>0">批量取消</Button>
      <Button class="fr mt10" type="primary" icon="plus" @click="addFaction()">关联人物</Button>
    </div>
    <Table ref="selection" class="mt10" border :loading="loading" :columns="columns" :data="data"></Table>
    <Page class="paging tr mt10" :current="pageNo" :total="totalItems" show-total show-elevator :page-size="pageSize" placement="top" @on-change="onChage" @on-page-size-change="onPageSizeChange"></Page>

    <!-- EyChoose begin-->
    <Modal class="eyChoose" title="添加人物" v-model="cIsShowModel" :width="800">
      <EyFilter :data="[{key:0,value:'全部',isActive:true},{key:1,value:'中国'},{key:2,value:'西方'}]" @get-item="cGetItem"></EyFilter>
      <div class="mt20">
        <label for="" class="lblWrp">搜索：</label>
        <Input v-model.trim="cName" @on-enter="cHanleSearch" placeholder="" style="width: 250px" />
        <Button type="primary" icon="ios-search" @click="cHanleSearch">查询</Button>
      </div>
      <Table ref="cSelection" class="mt10" border :loading="cLoading" :columns="cColumns" :data="cData" @on-selection-change="cOnSelectionChange" @on-select-cancel="cOnSelectCancel"></Table>
      <Page class="paging tr mt10" :current="cPageNo" :page-size="cPageSize" :total="cTotalItems" show-total show-elevator placement="top" @on-change="cOnChage"></Page>
      <div slot="footer">
        <div class="clearfix">
          <span class="fl sWrp">已选择：{{this.cChoose.length}}人物</span>
          <Button type="text" @click="()=>this.cIsShowModel=false">取消</Button>
          <Button type="primary" @click="cHandleSubmit()">确定</Button>
        </div>
      </div>
    </Modal>
    <!-- EyChoose end-->

  </div>
</template>

<script>
import { Table, Page, Button, Input, Modal, Breadcrumb, BreadcrumbItem } from "iview";
import EyFilter from '../../Common/EyFilter/EyFilter';
import {
  getMapCityArtistList,
  getArtistList,

  setMapCityArtist,
  deleteMapCityArtist
} from "./City.service";
export default {
  name: "RepCityPerson",
  components: { Table, Page, Button, Input, EyFilter, Modal, Breadcrumb, BreadcrumbItem },
  data() {
    return {
      // EyChoose begin
      cName: '',
      cIsShowModel: false,
      cColumns: [
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
          title: "人物名称",
          key: "name",
          align: 'center'
        },
        {
          title: "创建时间",
          key: "gmtCreate",
          align: 'center'
        }
      ],
      cData: [],
      cLoading: false,
      cTotalItems: 0,

      cSearchInfo: '',
      cPageNo: 1,
      cPageSize: 10,
      cSortField: "",
      cSort: "",
      cChoose: [],
      cCurIds: [],
      // EyChoose end

      mapCityId: 0,
      searchInfo: '',
      pageNo: 1,
      pageSize: 10,
      sortField: "",
      sort: "",
      totalItems: 0,
      loading: false,
      columns: [
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
          title: "人物名称",
          key: "artistName",
          align: 'center'
        },
        {
          title: "创建时间",
          key: "gmtCreate",
          align: 'center'
        },
        {
          title: "操作",
          key: "",
          align: 'center',
          render: (h, params) => {
            return (
              <div class="operateWrp">
                <p><span class="edit" onClick={() => this.deleteMapCityArtist([params.row.id])}>取消</span></p>
              </div>
            );
          }
        }
      ],

      data: []
    };
  },
  mounted() {
    const { mapCityId } = this.$route.query;
    if (mapCityId) {
      this.mapCityId = mapCityId;
    }
    this.getMapCityArtistList();
  },
  methods: {
    getArtistList() {
      this.cLoading = true;
      const {
        cSearchInfo: searchInfo,
        cPageNo: pageNo,
        cPageSize: pageSize,
        cSortField: sortField,
        cSort: sort
      } = this;
      const postData = {
        searchInfo,
        pageNo,
        pageSize,
        sortField,
        sort
      };
      console.log(postData, 'postData');
      getArtistList(postData).then(({ code, data: { artistList, totalPages, totalItems } }) => {
        console.log(artistList, 'artistList');
        this.cCurIds = [];
        this.cLoading = false;
        this.cTotalItems = totalItems;
        artistList.map((item, i) => {
          this.cCurIds.push(item.id);
          if (this.isInArray(this.cChoose, item.id)) {
            item._checked = true;
          }
        });
        this.cData = artistList;
      });
    },
    // EyChoose end

    getMapCityArtistList() {
      this.loading = true;
      const {
        mapCityId,
        pageNo,
        pageSize,
        sortField,
        sort
      } = this;
      const postData = {
        searchInfo: JSON.stringify({ mapCityId }),
        pageNo,
        pageSize,
        sortField,
        sort
      };
      getMapCityArtistList(postData).then(({ code, data: { mapCityArtistList, totalPages, totalItems } }) => {
        console.log(mapCityArtistList, 'mapCityArtistList');
        this.loading = false;
        this.totalItems = totalItems;
        this.data = mapCityArtistList;
      });
    },
    onChage(pageNo) {
      this.pageNo = pageNo;
      this.getMapCityArtistList();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getMapCityArtistList();
    },
    deleteMapCityArtist(arr) {
      const ids = arr.join(',');
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要取消关联吗？</p>`,
        onOk: () => {
          deleteMapCityArtist({ ids }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success('取消关联成功！');
              this.getMapCityArtistList();
            }
          });
        },
        onCancel: () => {
        }
      });
    },
    getItem({ key, value }) {
      console.log(key)
      console.log(value)
    },
    hanleSearch() {

    },
    deleteBatch() {
      const selection = this.$refs.selection.getSelection();
      if (selection.length == 0) {
        this.$Message.warning("请选择要取消关联的人物");
        return;
      }
      const arr = [];
      selection.map((item, i) => {
        arr.push(item.id);
      });
      this.deleteMapCityArtist(arr);
    },
    addFaction() {
      // 重置
      this.cName='';
      this.cSetSearchInfo();
      this.cIsShowModel = true;
      this.cChoose = [];
      this.cPageNo = 1;
      this.getArtistList();
    },


    // EyChoose begin
    cOnSelectionChange(selection) {
      console.log(this.cCurIds, '');
      // console.log(selection, 'onSelectionChange');
      const arr = [];
      selection.map((item, i) => {
        arr.push(item.id);
      });
      // console.log(arr);
      if (arr.length > 0) {
        this.cChoose = Array.from(new Set([...arr, ...this.cChoose]));
      } else {
        this.cChoose = this.cChoose.filter(o => !this.isInArray(this.cCurIds, o));
      }
      console.log(this.cChoose);
    },
    cOnSelectCancel(selection, row) {
      this.cChoose = this.cChoose.filter(o => o != row.id);
      console.log(this.cChoose);
    },
    cGetItem({ key }) {
      this.cPageNo = 1;
      this.key = key;
      this.cSetSearchInfo();
      this.getArtistList();
    },
    cHanleSearch() {
      this.cPageNo = 1;
      this.cSetSearchInfo();
      this.getArtistList();
    },
    cOnChage(pageNo) {
      this.cPageNo = pageNo;
      this.getArtistList();
    },

    cHandleSubmit() {
      if (this.cChoose.length == 0) {
        this.cIsShowModel = false;
        return;
      }
      const artistIds = this.cChoose.join(',');
      const {
        mapCityId
      } = this;
      const postData = {
        mapCityId,
        artistIds
      };
      setMapCityArtist(postData).then(({ code }) => {
        if (code == '10000') {
          this.$Message.success('新增关联成功！');
          this.cIsShowModel = false;
          // 因为批量新增后台是异步动作，马上取回太快，要做定时
          this.loading = true;
          setTimeout(() => {
            this.getMapCityArtistList();
          }, 1500);
        }
      });
    },
    isInArray(arr, value) {
      for (var i = 0; i < arr.length; i++) {
        if (value == arr[i]) {
          return true;
        }
      }
      return false;
    },
    cSetSearchInfo() {
      const { key, cName: artistName, mapCityId } = this;
      const region = key == 0 ? '' : key;
      this.cSearchInfo = JSON.stringify(this.cOperateObj({ region, artistName, cityId: mapCityId }));
    },
    cOperateObj(obj) {
      const newObj = {};
      for (let o in obj) {
        if (obj[o] != '') {
          newObj[o] = obj[o];
        }
      }
      return newObj;
    },
    // EyChoose end
  }
};
</script>

<style lang="less">
@import "../../../libs/css/common.less";

#repCityPerson {
  .lblWrp {
    font-weight: bold;
    font-size: 20px;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 7px;
  }

  .edit {
    cursor: pointer;
    color: blue;
    margin: 3px 10px;
    width: auto !important;
    display: inline-block;
  }

  .imgWrp {
    border: 1px solid @GRAY-50;
    height: 100px;
    width: 100px;
    position: relative;
    margin: 10px auto;

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
