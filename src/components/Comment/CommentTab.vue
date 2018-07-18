<template>
  <div id="customer">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>评论管理</BreadcrumbItem>
      <BreadcrumbItem>{{breadName}}</BreadcrumbItem>
    </Breadcrumb>
    <Tabs type="card" @on-click="tabsChange" :value="index">
      <TabPane :label="labelList[0]">
        <Comment></Comment>
      </TabPane>
      <TabPane :label="labelList[1]">
        <CommentArtist ></CommentArtist>
      </TabPane>
      <TabPane :label="labelList[2]">
        <CommentExhibition ></CommentExhibition>
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
} from 'iview'
import Comment from './Comment.vue'
import CommentArtist from './CommentArtist.vue'
import CommentExhibition from './CommentExhibition'

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
    Comment,
    CommentArtist,
    CommentExhibition
  },
  data() {
    return {
      labelList: ['作品评论列表', '艺术家评论列表', '展览评论列表'],
      breadName: '作品评论列表',
      index: 0
    }
  },
  created() {
    const { params, query } = this.$route
    if (params.tab === '0' || query.tab == 0) {
      this.index = 0
    } else if (params.tab === '1' || query.tab == 1) {
      this.index = 1
    } else if (params.tab === '2' || query.tab == 2) {
      this.index = 2
    }
  },
  watch: {
    $route(newValue, oldValue) {
      const { params, query } = this.$route
      if (params.tab === '0' || query.tab == 0) {
        this.index = 0
      } else if (params.tab === '1' || query.tab == 1) {
        this.index = 1
      }
    }
  },
  mounted() {},
  methods: {
    tabsChange(index) {
      this.breadName = this.labelList[index]
    }
  }
}
</script>

<style lang="less">
#customer {
}
</style>
