<template>
  <div id="setExhibition">
    <div class="headWrp clearfix">
      <p class="fl">当前展览：{{exhibitionName||'无'}}</p>

      <div class="fr clearfix">
        <EySelectsearch class="fl" placeHolder="添加艺术品" url="/getProductStatisticsList/v1" name="productName" resultList="productList" :postData="{searchInfo: { productName: '' },pageNo: 0,pageSize: 10,sortField: '',sort: ''}" :kv="['productDto.id','productDto.name']" @getItem="getItem"></EySelectsearch>

        <span class="fl" style="margin:0 10px 0 30px;">排序值：</span>
        <InputNumber class="fl" :min="0" v-model="sortNum" placeholder="排序值" style="width: 100px;"></InputNumber>
        <Button class="fl" type="primary" icon="plus" style="margin-left:10px;" @click="addExhibits()">添加作品</Button>
      </div>
    </div>

    <Table :loading="loading" class="mt10" border :columns="columns" :data="exhibitsList"></Table>
    <Page class="paging tr mt10" :current="pageNo" :total="totalItems" show-total show-elevator show-sizer :page-size-opts="[10,20,30]" placement="top" @on-change="onChage" @on-page-size-change="onPageSizeChange"></Page>
  </div>
</template>

<script>
import { Table, Page, Button, Input, InputNumber } from "iview";

import {
  setExhibits,
  findByExhibitionId,
  deleteExhibits
} from "./Content.service";
import EySelectsearch from '../Common/EySelectsearch.vue';

export default {
  name: "SetExhibition",
  components: { Table, Page, Button, Input, InputNumber, EySelectsearch },
  data() {
    return {
      exhibitionName: '',
      loading: true,
      exhibitionId: 0,
      productId: 0,
      sortNum: 0,

      searchInfo: '',
      pageNo: 1,
      pageSize: 10,
      sortField: '',
      sort: '',
      totalItems: 0,
      columns: [
        {
          title: "艺术品id",
          key: "",
          align: 'center',
          width: 100,
          render: (h, params) => {
            const { productDto } = params.row;
            return (<p>{productDto.id}</p>);
          }
        },
        {
          title: "展品名称",
          key: "",
          align: 'center',
          render: (h, params) => {
            const { productDto } = params.row;
            return (<p>{productDto.name}</p>);
          }
        },
        {
          title: "图片",
          key: "",
          align: 'center',
          render: (h, params) => {
            const { productDto } = params.row;
            return (
              <div class="proImg">
                <img src={productDto.imageUrl} />
              </div>
            );
          }
        },
        {
          title: "收藏量",
          key: "",
          align: 'center',
          render: (h, params) => {
            return (<p>{params.row.productDto.collectNum}</p>);
          }
        },
        {
          title: "评论数",
          key: "",
          align: 'center',
          render: (h, params) => {
            return (<p>{params.row.productDto.commentNum}</p>);
          }
        },
        {
          title: "浏览量",
          key: "",
          align: 'center',
          render: (h, params) => {
            return (<p>{params.row.productDto.readNum}</p>);
          }
        },
        {
          title: "作品状态",
          key: "",
          align: 'center',
          render: (h, params) => {
            return (<p>{params.row.productDto.status == 1 ? <span>已发布</span> : <span style="color:red;">未发布</span>}</p>);
          }
        },
        {
          title: "排序",
          key: "",
          align: 'center',
          render: (h, params) => {
            const { productDto } = params.row;
            return (
              <div>
                <input class="iptNum" type="number" min="0" value={params.row.sortNum} onBlur={(e) => { e.target.value = e.target.value == '' ? 0 : e.target.value }} onInput={(e) => { e.target.value = e.target.value.replace(/\-/g, "") }} onKeydown={(e) => { if (e.keyCode == "13") { this.setExhibits({ id: params.row.id, productId: productDto.id, sortNum: e.target.value }) } }} />
              </div>
            );
          }
        },
        {
          title: "操作",
          key: "",
          align: 'center',
          render: (h, params) => {
            const { row } = params;
            return (
              <div class="operateWrp">
                <p>
                  <span class="edit" v-clipboard={`pages/Picture/Detail?id=${row.productDto.id}`} onSuccess={(e) => this.$Message.success('复制成功')}>复制链接</span>
                  <span class="edit" onClick={() => this.deleteExhibits(row)}>删除</span>
                </p>
              </div>
            );
          }
        }
      ],

      exhibitsList: []
    };
  },
  mounted() {
    const { exhibitionId, exhibitionName } = this.$route.query;
    if (exhibitionName) {
      this.exhibitionName = exhibitionName;
    }
    if (exhibitionId) {
      this.exhibitionId = exhibitionId;
      this.searchInfo = JSON.stringify({ exhibitionId });
      this.findByExhibitionId();
    } else {
      // 返回到卡片页面
      this.$router.push({ name: 'Content', params: { tab: '2' } });
    }
  },
  methods: {
    findByExhibitionId() {
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
      findByExhibitionId(postData).then(({ code, data: { exhibitsList, totalItems } }) => {
        this.loading = false;
        this.exhibitsList = this.operateData(exhibitsList);
        this.totalItems = totalItems;
      });
    },
    operateData(list) {
      list.map((item, i) => {
        // 判断头像图片资源是否为七牛云的，如果是的话进行压缩
        const imageUrl = item.productDto.imageUrl;
        if (imageUrl && imageUrl.indexOf('https://img.kanhua.yiwaiart.com') != -1) {
          const str = imageUrl.split(imageUrl.indexOf('?imageView2')[0]);
          item.productDto.imageUrl = `${str}?imageView2/1/w/100/h/100/q/35`;
        }
      });
      return list;
    },
    onChage(pageNo) {
      this.pageNo = pageNo;
      this.findByExhibitionId();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.findByExhibitionId();
    },
    getItem({ key }) {
      this.productId = key;
    },
    addExhibits() {
      if (this.productId == 0) {
        this.$Message.error('请添加艺术品！');
        return;
      }
      const {
        productId,
        sortNum
      } = this;

      this.setExhibits({ productId, sortNum });
    },
    setExhibits({ id = 0, productId, sortNum }) {
      const {
        exhibitionId
      } = this;

      const exhibitsInfo = JSON.stringify({
        id,
        exhibitionId,
        productId,
        sortNum
      });

      setExhibits({ exhibitsInfo }).then(({ code, msg }) => {
        if (code == '10001') {
          this.$Message.error(msg);
        } else if (code == '10000') {
          this.$Message.success(id == 0 ? '添加成功！' : '修改成功！');
          this.findByExhibitionId();
        }
      });
    },
    deleteExhibits(row) {
      const { id } = row;
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除吗？</p>`,
        onOk: () => {
          deleteExhibits({ id }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success('删除成功！');
              this.findByExhibitionId();
            }
          });
        },
        onCancel: () => {
        }
      });
    }

  }
};
</script>

<style lang="less">
@import "../../libs/css/common.less";
#setExhibition {
  .ivu-input-number-input {
    text-align: center;
  }
  .iptNum {
    border-radius: 4px;
    border: 1px solid #dddee1;
    width: 80px;
    text-align: center;
    padding: 5px 0;
  }
  .headWrp {
    padding: 20px 0;
    line-height: 32px;
    margin: 0 20px;
  }
  .operateWrp a {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
  .proImg {
    overflow: hidden;
    display: inline-block;
    width: 100px;
    height: 100px;
    position: relative;
    margin: 10px 0;
    img {
      vertical-align: middle;
      position: absolute;
      max-width: 100%;
      max-height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
