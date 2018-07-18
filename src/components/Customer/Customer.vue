<template>
  <div id="customer">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>{{breadName}}</BreadcrumbItem>
    </Breadcrumb>

    <Tabs type="card" @on-click="tabsChange" :value="index">
      <TabPane :label="labelList[0]">
        <CustomerList></CustomerList>
      </TabPane>
      <TabPane :label="labelList[1]">
        <CustomerList :isVirtual="1"></CustomerList>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import {
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabPane,
  Button,
  Table,
  Page,
  Select,
  Option,
  Input
} from 'iview';
import CustomerList from './CustomerList.vue';

export default {
  name: 'Customer',
  components: {
    Breadcrumb,
    BreadcrumbItem,
    Tabs,
    TabPane,
    Button,
    Table,
    Page,
    Select,
    Option,
    Input,
    CustomerList
  },
  data() {
    return {
      labelList: ['真实用户', '虚拟用户'],
      breadName: '真实用户',
      index:0
    }
  },
  created(){
    const { params, query } = this.$route;
    console.log(params.tab);
    if (params.tab === 0 || query.tab == 0) {
      this.index = 0;
    } else if (params.tab === 1 || query.tab == 1) {
      this.index = 1;
    }
  },
  mounted() { },
  methods: {
    tabsChange(index) {
      this.breadName = this.labelList[index];
    }
  }
}

</script>

<style lang="less">
@import "../../libs/css/constant.less";
@import "../../libs/css/common.less";

#customer {
}
</style>
