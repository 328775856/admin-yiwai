<template>
  <div id="faction">
    <EyFilter :data="[{key:0,value:'全部',isActive:true},{key:1,value:'中国'},{key:2,value:'西方'}]" @get-item="getItem"></EyFilter>
    <div class="mt20">
      <label for="" class="lblWrp">搜索：</label>
      <Input v-model.trim="name" @on-enter="hanleSearch" placeholder="输入用户名称" style="width: 180px" />
      <Button type="primary" icon="ios-search" @click="hanleSearch">查询</Button>
    </div>
    <Button type="primary" icon="plus" class="mt20" @click="()=>this.$router.push({ path: '/Faction/SetFaction' })">添加画派</Button>
    <Table class="mt10" border :loading="loading" :columns="columns" :data="data" @on-sort-change="onSortChange"></Table>
    <Page class="paging tr mt10" :current="pageNo" :total="totalItems" show-total show-elevator :page-size="pageSize" :page-size-opts="[10,20,30]" placement="top" @on-change="onChage" @on-page-size-change="onPageSizeChange"></Page>
  </div>
</template>

<script>
import { Table, Page, Button, Input, Modal } from "iview";
import EyFilter from '../../Common/EyFilter/EyFilter';
import {
  getMapPaintingFactionList,
  setMaterial,
  deleteMapPaintingFaction,
} from "./Faction.service";
export default {
  name: "Faction",
  components: { Table, Page, Button, Input, EyFilter, Modal },
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
      pageSize: 10,
      sortField: "",
      sort: "",
      totalItems: 0,
      loading: false,
      name: '',
      key: '',
      columns: [
        {
          title: "编号",
          key: "id",
          align: 'center',
          width: 100
        },
        {
          title: "画派",
          key: "name",
          align: 'center'
        },
        {
          title: "封面",
          key: "",
          align: 'center',
          render: (h, params) => {
            const { row } = params;
            return (
              <div class="imgWrp">
                <img src={row.cover} />
              </div>
            );
          }
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
            const { row } = params;
            const { id: factionId } = row;
            return (
              <div class="operateWrp">
                <p><span onClick={() => this.$router.push({ name: 'SetFaction', params: { factionInfo: row } })} class="edit">编辑</span><span class="edit" onClick={() => this.deleteMapPaintingFaction(params.row)}>删除</span></p>
                <p><span class="edit" onClick={() => this.$router.push({ path: '/Faction/RepFactionPerson', query: { factionId } })}>代表人物管理</span></p>
                <p><span class="edit" onClick={() => this.$router.push({ path: '/Faction/RepFactionProduct', query: { factionId } })}>代表作品管理</span></p>
              </div>
            );
          }
        }
      ],

      data: []
    };
  },
  mounted() {
    this.getMapPaintingFactionList();
  },
  methods: {
    getMapPaintingFactionList() {
      this.loading = true;
      const {
        searchInfo,
        pageNo,
        pageSize,
        sortField,
        sort
      } = this;
      const postData = {
        searchInfo,
        pageNo,
        pageSize,
        sortField,
        sort
      };
      getMapPaintingFactionList(postData).then(({ code, data: { mapPaintingFactionList, totalPages, totalItems } }) => {
        console.log(mapPaintingFactionList, 'mapPaintingFactionList');
        this.loading = false;
        this.totalItems = totalItems;
        this.data = mapPaintingFactionList;
      });
    },
    onChage(pageNo) {
      this.pageNo = pageNo;
      this.getMapPaintingFactionList();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getMapPaintingFactionList();
    },
    setFaction() {

    },
    deleteMapPaintingFaction(row) {
      const { id } = row;
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除该画派吗？</p>`,
        onOk: () => {
          deleteMapPaintingFaction({ id }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success('删除成功！');
              this.getMapPaintingFactionList();
            }
          });
        },
        onCancel: () => {
        }
      });
    },
    onSortChange({ column, key, order }) {
      this.sort = 'normal' == order ? '' : (order + '').toUpperCase();
      this.getMapPaintingFactionList();
    },
    getItem({ key }) {
      this.pageNo = 1;
      this.key = key;
      this.setSearchInfo();
      this.getMapPaintingFactionList();
    },
    hanleSearch() {
      this.pageNo = 1;
      this.setSearchInfo();
      this.getMapPaintingFactionList();
    },
    setSearchInfo() {
      const { key, name } = this;
      const region = key == 0 ? '' : key;
      this.searchInfo = JSON.stringify(this.operateObj({ region, name }));
    },
    operateObj(obj) {
      const newObj = {};
      for (let o in obj) {
        if (obj[o] != '') {
          newObj[o] = obj[o];
        }
      }
      return newObj;
    },

  }
};
</script>

<style lang="less">
@import "../../../libs/css/common.less";

#faction {
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
