<template>
  <div id="index">
    <div class="clearfix">
      <div class="fl">
        <div class="innerWrp bk">
          <p>目前总用户数：</p>
          <p class="pNum">{{customerNum}}</p>
        </div>
      </div>
      <div class="fl">
        <div  class="innerWrp bk">
          <p>目前收录作品数：</p>
          <p class="pNum">{{productNum}}</p>
        </div>
      </div>
      <div class="fl">
        <div  class="innerWrp bk">
          <p>目前收录艺术家数：</p>
          <P class="pNum">{{artistNum}}</P>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import { getCustomerList, getProductList, getArtistList } from './Index.service';

export default {
  name: 'Index',
  data() {
    return {
      customerNum: '',
      productNum: '',
      artistNum: ''
    }
  },
  mounted() {
    this.getCustomerList();
    this.getProductList();
    this.getArtistList();
  },
  methods: {
    getCustomerList() {
      const postData = {
        searchInfo: '',
        pageNo: 1,
        pageSize: 1,
        sortField: '',
        sort: ''
      };
      getCustomerList(postData).then(({ data: { totalItems } }) => {
        this.customerNum = totalItems;
      });
    },

    getProductList() {
      const postData = {
        searchInfo: '',
        pageNo: 1,
        pageSize: 1,
        sortField: '',
        sort: ''
      };

      getProductList(postData).then(({ data: { totalItems } }) => {
        this.productNum = totalItems;
      }, () => {
        console.log('reject');
      });
    },
    getArtistList() {
      const postData = {
        searchInfo: '',
        pageNo: 1,
        pageSize: 1,
      };
      getArtistList(postData).then(({ data: { totalItems } }) => {
        this.artistNum = totalItems;
      }, () => {
        console.log('reject');
      });
    },


  }
}
</script>

<style lang="less">
@import "../../libs/css/constant.less";
@import "../../libs/css/common.less";

#index {
  p{
    font-size: 18px;
  }
  .pNum {
    font-size: 40px;
    font-weight: bold;
  }
  .fl{
    margin-right: 30px;
  }
  .fl:last-child{
    margin-right: 0;
  }
  .innerWrp{
    border-radius: 4px;
    border:1px solid #dddee1;
    margin: 0 auto;
    padding:30px;
  }
}
</style>
