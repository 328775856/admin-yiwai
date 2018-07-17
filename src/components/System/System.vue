<template>
  <div id="system">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>系统设置</BreadcrumbItem>
      <BreadcrumbItem>{{labelList[index]}}</BreadcrumbItem>
    </Breadcrumb>
    <Tabs type="card" @on-click="getName" class="tab">
      <!-- tab-1 开始 -->
      <TabPane :label="labelList[0]">
        <User></User>
      </TabPane>
      <!-- tab-1 结束 -->

      <!-- tab-2 开始 -->
      <!-- <TabPane :label="labelList[1]" class="tab">
      </TabPane> -->
      <!-- tab-2 结束 -->

      <!-- tab-3 开始 -->
      <!-- <TabPane :label="labelList[2]">
      </TabPane> -->
      <!-- tab-3 结束 -->

      <!-- tab-4 开始 -->
      <TabPane :label="labelList[1]">
        <DataWordBook/>
      </TabPane>
      <!-- tab-4 结束 -->

      <!-- tab-5 开始 -->
      <TabPane :label="labelList[2]">
        <ProTypeManage/>
      </TabPane>
      <!-- tab-5 结束 -->
    </Tabs>
  </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Tabs, TabPane } from 'iview';
import ProTypeManage from './ProTypeManage.vue';
import DataWordBook from './DataWordBook.vue';
import User from './User.vue';

export default {
  name: 'System',
  components: { ProTypeManage, DataWordBook, Breadcrumb, BreadcrumbItem, Tabs, TabPane, User },
  data() {
    return {
      labelList: ['系统用户', '数据字典', '品类管理'],
      index: 0,
    }
  },
  mounted() {
  },
  methods: {
    getName(name) {
      this.index = name;
    },
  }

}
</script>
<style lang="less">
@import "../../libs/css/constant.less";
@import "../../libs/css/common.less";

#system {
}
</style>
