<template>
  <div id="customerList">

    <fieldset class="fieldset">
      <legend>查询条件</legend>
      <div class="search">
        <div>
          <label for="">用户名称：</label>
          <Input v-model.trim="nickName" @on-enter="hanleSearch" placeholder="输入用户名称" style="width: 180px" />
        </div>
        <Button type="primary" icon="ios-search" @click="hanleSearch">查询</Button>
      </div>
    </fieldset>

    <Button v-if="isVirtual==1" type="primary" icon="plus" class="mt10" @click="goToSetCustomer">新增虚拟用户</Button>
    <Table class="mt10" border :loading="loading" :columns="columns" :data="data" @on-sort-change="onSortChange"></Table>
    <Page class="paging tr mt10" :current="pageNo" :total="totalItems" show-total show-elevator :page-size-opts="[10,20,30]" placement="top" @on-change="onChage" @on-page-size-change="onPageSizeChange"></Page>
    <SetCustomer :pIsShowModel="pIsShowModel" :pIsAdd="pIsAdd" :pIsLook="pIsLook" :pCustomerInfo="pCustomerInfo" @updatepCustomerInfo="()=>pCustomerInfo={}" @updatepIsShowModel="val=>pIsShowModel=val"></SetCustomer>
  </div>
</template>

<script>
import { Table, Page, Button, Input } from "iview";
import SetCustomer from './SetCustomer.vue'

import {
  getCustomerList,
  getCustomerInfo,
  setCustomer,
  setVip,
  deleteCustomer
} from "./Customer.service";
export default {
  name: "CustomerList",
  components: { Table, Page, Button, Input, SetCustomer },
  props: {
    isVirtual: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      pIsAdd: true,
      pIsLook: true,
      pCustomerInfo: {},
      nickName: '',
      searchInfo: '',
      pageNo: 1,
      pageSize: 10,
      sortField: "",
      sort: "",
      totalItems: 0,
      pIsShowModel: false,
      loading: true,
      columns: [
        {
          title: "编号",
          key: "customerId",
          align: 'center',
          width: 100
        },
        {
          title: "用户",
          key: "",
          align: 'center',
          render: (h, params) => {
            const { customerDto } = params.row;
            return (
              <div class="headImgWrp">
                <div class="headImg">
                  <img src={customerDto.avatarUrl2} />
                </div>
                <p>{customerDto.nickName}</p>
              </div>
            );
          }
        },
        {
          title: "创建时间",
          key: "gmtCreate",
          sortable: 'custom',
          align: 'center',
          render: (h, params) => {
            const { customerDto } = params.row;
            return (
              <div>
                {customerDto.gmtCreate}
              </div>
            );
          }
        },
        {
          title: "信息",
          key: "",
          align: 'center',
          render: (h, params) => {
            const { customerDto } = params.row;
            return (
              <div>
                <p>国家：{customerDto.country || '无'}</p>
                <p>省份：{customerDto.province || '无'}</p>
                <p>城市：{customerDto.city || '无'}</p>
                <p>性别：{customerDto.gender == 1 ? '男' : customerDto.gender == 2 ? '女' : '不详'}</p>
              </div>
            );
          }
        },
        {
          title: "浏览作品数",
          key: "readNum",
          sortable: 'custom',
          align: 'center'
        },
        {
          title: "收获点赞数",
          key: "harvestLikeNum",
          sortable: 'custom',
          align: 'center'
        },
        {
          title: "评论数",
          key: "commentNum",
          sortable: 'custom',
          align: 'center',
          render: (h, params) => {
            const { customerDto, commentNum } = params.row;
            return (
              <div>
                <p>{commentNum}</p>
                <p class="edit" onClick={() => this.$router.push({ path: '/Comment', query: { customerId: customerDto.id } })}>查看评论</p>
              </div>
            );
          }


        },
        {
          title: "收藏作品数",
          key: "collectNum",
          sortable: 'custom',
          align: 'center'
        },
        {
          title: "操作",
          key: "",
          align: 'center',
          render: (h, params) => {
            const { row } = params;
            const isOperate = () => this.isVirtual == 1 && (<div>
              <p><span class="edit" onClick={() => this.editCustomer(row)}>编辑</span></p>
              <p><span class="edit" onClick={() => this.deleteCustomer(row)}>删除</span></p>
            </div>);
            return (
              <div class="operateWrp">
                <p><span class="edit" onClick={() => this.selectCustomer(row)}>查看</span></p>
                {isOperate()}
              </div>
            );
          }
        }
      ],

      data: []
    };
  },
  created(){
    const { params } = this.$route;
    if(params.customerName){
      this.nickName = params.customerName;
    }
    this.getCustomerList()
    console.log(this.$route.params);
  },
  mounted() {
    // 设置searchInfo
    this.getCustomerList();
  },
  methods: {
    getCustomerList() {
      const postData = {
        searchInfo:JSON.stringify({
          isVirtual:this.isVirtual,
          nickName:this.nickName
        }),
        pageNo:this.pageNo,
        pageSize:this.pageSize,
        sortField:this.sortField,
        sort:this.sort
      };
      getCustomerList(postData).then(({ code, data: { customerList, totalPages, totalItems } }) => {
        this.loading = false;
        this.totalItems = totalItems;
        this.data = this.operateData(customerList);
      });
    },
    operateData(list) {
      console.log(list);
      list.map((item, i) => {
        // 判断头像图片资源是否为七牛云的，如果是的话进行压缩
        const { avatarUrl: customerImg } = item.customerDto;
        if (customerImg && customerImg.indexOf('https://img.kanhua.yiwaiart.com') != -1) {
          const str = customerImg.split(customerImg.indexOf('?imageView2')[0]);
          item.customerDto.avatarUrl2 = `${str}?imageView2/1/w/80/h/80/q/35`;
        } else {
          item.customerDto.avatarUrl2 = item.customerDto.avatarUrl;
        }
        item.isOpen = false;
        // item.checked = false;
        item.reload = false;
      });
      return list;
    },
    goToSetCustomer() {
      this.pIsAdd = true;
      this.pIsLook = false;
      this.pIsShowModel = true;
    },
    onChage(pageNo) {
      this.pageNo = pageNo;
      this.getCustomerList();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getCustomerList();
    },
    hanleSearch() {
      this.pageNo = 1;
      this.getCustomerList();
    },
    p2Js(obj) {
      return JSON.stringify(obj);
    },
    editCustomer(row) {
      // 获取需要传送的对象
      const { customerDto } = row;
      this.pCustomerInfo = customerDto;
      // this.pCustomerInfo=;
      this.pIsAdd = false;
      this.pIsLook = false;
      this.pIsShowModel = true;
    },
    deleteCustomer(row) {
      const { customerDto } = row;
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除用户 [ ${customerDto.nickName} ] 吗？</p>`,
        onOk: () => {
          console.log(customerDto.id);
          deleteCustomer({ customerId: customerDto.id }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success('删除成功！');
              this.getCustomerList();
            }
          });
        },
        onCancel: () => {
        }
      });
    },
    selectCustomer(row) {
      const { customerDto } = row;
      this.pCustomerInfo = customerDto;
      this.pIsAdd = false;
      this.pIsLook = true;
      this.pIsShowModel = true;
    },
    onSortChange({ column, key, order }) {
      console.log(key, 'key');
      const k = key == 'gmtCreate' ? 'id' : key;
      if ('normal' == order) {
        this.sortField = '';
        this.sort = '';
      } else {
        this.sortField = k;
        this.sort = (order + '').toUpperCase();
      }
      this.getCustomerList();
    }
  }
};
</script>

<style lang="less">
@import "../../libs/css/common.less";
#customerList {
}

#customerList {
  .headImgWrp {
    margin: 10px 0;
  }
  .headImg {
    overflow: hidden;
    display: inline-block;
    width: 50px;
    height: 50px;
    img {
      position: relative;
      max-width: 100%;
      max-height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .operateWrp {
    line-height: 1.8em;
  }
}
</style>
