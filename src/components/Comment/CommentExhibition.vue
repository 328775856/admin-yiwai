<template>
  <div id="comment">
      <fieldset class="fieldset">
      <legend>查询条件</legend>
      <div class="search">
        <div class="mui-flex" style="width:100%;">
          <div class="cell">
            <Select v-model="condition" style="width:100px;">
              <Option v-for="(item,index) in searchList" :value="item.value" :key="index">{{ item.name }}</Option>
            </Select>
            <Input v-model="kw" placeholder="输入关键字" @on-enter="hanleSearch" style="width: 180px;" />
            <Button type="primary" icon="ios-search" @click="hanleSearch" style="margin-left:10px;display:inline-block;">查询</Button>
          </div>
          <div>
            <label for="">排序：</label>
            <Select v-model="sortField" @on-change="onSortChange" style="width:180px">
              <Option v-for="(item,index) in sortFieldList" :value="item.value" :key="index">{{ item.name }}</Option>
            </Select>
          </div>
        </div>
      </div>
    </fieldset>

    <Button v-if="exhibitionId!=0" type="primary" icon="plus" class="add" @click="addComment">新增评论</Button>

    <div class="ey_ullis mt10">
      <div class="ivu-spin ivu-spin-large ivu-spin-fix" v-if="loading">
        <div class="ivu-spin-main">
          <span class="ivu-spin-dot"></span>
          <div class="ivu-spin-text"></div>
        </div>
      </div>
      <ul>
        <li v-for="(item,index) in commentList" :key="index">
          <div class="mui-flex alc">
            <i class="hotWrp" v-if="item.isHot==1">Hot</i>
            <div class="commentIdWrp">
              编号: {{item.id}}
            </div>
            <div class="imgWrp">
              <img :src="item.customerImg">
            </div>
            <div class="cell">
              <p>
                <router-link :to="{ name: 'Customer',params:{customerName:item.customerName}}" class="aLink" >
                <!-- {{item.customerName}} -->
                {{item.customerName}}
                </router-link>
                <span>{{item.gmtCreate}}</span>
              </p>

              <div class="contentWrp bk">{{item.content}}</div>
              <div class="btmWrp">
                <span>点赞数：{{item.commentLikeNum}}
                  <a href="javascript:;" class="aLink" @click="setLike({commentId:item.id,commentLikeNum:item.commentLikeNum})">设置点赞数</a>
                </span>
              </div>
            </div>

            <div class="opeWrp">
              <a href="javascript:;" class="aLink" @click="deleteComment({commentId:[item.id]})">删除</a>
            </div>
          </div>

          <div class="commentTypeWrp">
            评论了作品：
            <a href="javascript:;" @click="goToContent(item.exhibitionName)">
              [
              <span style="margin-right:10px;">编号:{{item.exhibitionId}}</span> {{item.exhibitionName}} ]
            </a>
          </div>

          <template v-if="item.replyNum > 0">
            <ReplyArtist :index="index" :commentId="item.id" :isOpen="item.isOpen" :reload="item.reload" @updateIsOpen="val=>commentList[index].isOpen=val"></ReplyArtist>
          </template>
        </li>
      </ul>
    </div>

    <Page class="paging tr mt10" :current.sync="currentPage" :total="totalItems" show-total show-elevator  placement="top" @on-change="onChage"  v-if="commentList.length!=0"></Page>

    <div class="noDataWrp" v-if="commentList.length==0&&loading==false">
      暂无数据！
    </div>

    <AddExhibitionReply :pIsShowModel="pIsShowModel" :pCommentInfo="pCommentInfo" :commentType="commentType" :pIndex="pIndex" @updatepIsShowModel="val=>pIsShowModel=val" @resetReplyList="index=>commentList[index].reload=true"></AddExhibitionReply>
    <setExhibitionLike :pLikeIsShowModel="pLikeIsShowModel" :pLikeInfo="pLikeInfo" @updatepLikeIsShowModel="val=>pLikeIsShowModel=val" @updatepLikeInfo="()=>pLikeInfo={}"></setExhibitionLike>
  </div>
</template>

<script>
import { Page, Button, Input, Select, Option, Tabs, TabPane } from 'iview'

import {
  deleteExhibitionComment,
  setExhibitionCommentLikeNum,
  addExhibitionComment,
  getExhibitionCommentPage
} from './CommentExhibition.service'
import ReplyArtist from './ReplyArtist.vue'
import AddExhibitionReply from './AddExhibitionReply'
import setExhibitionLike from './setExhibitionLike'
import EyFilter from '../Common/EyFilter/EyFilter'
export default {
  name: 'CommentExhibition',
  components: {
    Page,
    Button,
    Input,
    Select,
    Option,
    ReplyArtist,
    AddExhibitionReply,
    setExhibitionLike,
    Button,
    Tabs,
    TabPane,
    EyFilter
  },
  data() {
    return {
      pCommentInfo: {},
      exhibitionId: 0,
      pageNo: 1,
      pageSize: 10,
      customerId: '',
      customerName: '',
      content: '',
      sortField: '',
      currentPage: 1,
      sort: '',
      commentList: [],
      index: 0,
      totalItems: 0,
      pIsShowModel: false,
      pLikeIsShowModel: false,
      pReplyInfo: {},
      commentType: 1,
      pIndex: 0,
      pLikeInfo: {},
      condition: 0,
      kw: '',
      loading: true,
      searchList: [
        { value: 0, name: '用户名称' },
        { value: 1, name: '评论内容' }
      ],
      sortFieldList: [
        { name: '无', value: '' },
        { name: '按时间', value: 'gmtCreate,id' },
        { name: '按点赞数', value: 'commentLikeNum' }
      ]
    }
  },
  mounted() {
    this.isDetails(this.$route)
  },
  watch: {
    $route(newValue, oldValue) {
      this.pageNo = 1
      this.isDetails(newValue)
    }
  },
  methods: {
    getName(name) {
      this.index = name
    },
    isDetails(newValue) {
      const { query } = newValue
      console.log(query)
      if (query.exhibitionId) {
        this.exhibitionId = parseInt(query.exhibitionId, 10)
      } else {
        this.exhibitionId = ''
      }
      if (query.customerId) {
        this.customerId = parseInt(query.customerId, 10)
      } else {
        this.customerId = ''
      }
      this.getCommentList()
    },

    //customerName artistName content
    async getCommentList() {
      const params = {
        searchInfo: JSON.stringify({
          content: this.condition === 1 ? this.kw : '',
          customerName: this.condition === 0 ? this.kw : '',
          exhibitionId: this.exhibitionId
        }),
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sort: this.sort,
        presentCustomerId: 0
      }
      const { code, msg, data } = await getExhibitionCommentPage(params)
      if (code === 10000 || code === '10000') {
        this.loading = false
        this.totalItems = data.totalItems
        this.commentList = this.operateData(data.commentList)
      }
    },
    operateData(list) {
      list.map((item, i) => {
        // 判断头像图片资源是否为七牛云的，如果是的话进行压缩
        const customerImg = item.customerImg
        if (
          customerImg &&
          customerImg.indexOf('https://img.kanhua.yiwaiart.com') != -1
        ) {
          const str = customerImg.split(customerImg.indexOf('?imageView2')[0])
          item.customerImg = `${str}?imageView2/1/w/80/h/80/q/35`
        }
        item.isOpen = false
        item.reload = false
      })
      return list
    },

    addComment() {
      this.pCommentInfo = {
        content: '', // 内容
        customerId: 0, // 用户id
        exhibitionId: this.exhibitionId // 作品id
      }
      this.commentType = 1
      this.pIsShowModel = true
    },
    addReply({ commentId, replyType, toCustomerId, toReplyId }, index) {
      this.commentType = 2
      this.pIsShowModel = true
      this.pReplyInfo = {
        commentId, // 评论id
        content: '', // 内容
        customerId: 0, // 顾客id
        replyType, // 1回复评论 2回复回复
        toCustomerId, // 被回复者id 楼主/层主ID
        toReplyId // 被回复的id 没有传0 [当在回复回复的时候才有，否则为0]
      }
      this.pIndex = index
    },
    deleteComment({ commentId }) {
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除评论？</p>`,
        onOk: () => {
          deleteExhibitionComment({
            commentId
          }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success('删除成功！')
              this.getCommentList()
            }
          })
        },
        onCancel: () => {}
      })
    },
    setLike({ commentId, commentLikeNum }) {
      this.pLikeInfo = {
        commentId,
        commentLikeNum
      }
      console.log(this.pLikeInfo)
      this.pLikeIsShowModel = true
    },

    onChage(pageNo) {
      this.pageNo = pageNo
      this.getCommentList()
    },
    openReply(index) {
      const { commentList } = this
      const isOpen = commentList[index].isOpen
      if (isOpen) {
        commentList[index].isOpen = false
      } else {
        commentList[index].isOpen = true
      }
    },
    onSortChange(value) {
      console.log(value)
      const { sortField } = this
      this.sort = sortField == '' ? '' : 'DESC'
      this.getCommentList()
    },

    hanleSearch() {
      this.pageNo = 1
      this.getCommentList()
    },
    goToContent(exhibitionName) {
      this.$router.push({
        name: 'Content',
        params: {
          tab: '2',
          exhibitionName
        }
      })
    }
  }
}
</script>

<style lang="less">
@import './comment.less';

#comment {
  .ivu-spin-fix .ivu-spin-main {
    top: 100px !important;
  }
  .search {
    justify-content: flex-start !important;
  }
  .noDataWrp {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
}
</style>
