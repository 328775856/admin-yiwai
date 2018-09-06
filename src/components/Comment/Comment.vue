<template>
  <div id="comment">
      <fieldset class="fieldset">
      <legend>查询条件</legend>
      <div class="search">
        <div class="mui-flex" style="width:100%;">
          <div class="cell">
            <Select v-model="condition" style="width:100px;">
              <Option v-for="(item,index) in [{value:0,name:'用户名称'},{value:1,name:'作品名称'},{value:2,name:'评论内容'}]" :value="item.value" :key="index">{{ item.name }}</Option>
            </Select>
            <Input v-model="kw" placeholder="输入关键字" @on-enter="hanleSearch" style="width: 180px;" />
            <Button type="primary" icon="ios-search" @click="hanleSearch" style="margin-left:10px;display:inline-block;">查询</Button>
          </div>
          <div>
            <label for="">排序：</label>
            <Select v-model="sortField" @on-change="onSortChange" style="width:180px">
              <Option v-for="(item,index) in [{name:'无',value:''},{name:'按热门',value:'isHot,gmtCreate'},{name:'按时间',value:'gmtCreate,id'},{name:'按点赞数',value:'commentLikeNum'},{name:'按回复数',value:'replyNum'}]" :value="item.value" :key="index">{{ item.name }}</Option>
            </Select>
          </div>
        </div>
      </div>
    </fieldset>

    <Button v-if="productId!=0" type="primary" icon="plus" class="add" @click="addComment">新增评论</Button>
    <Button v-if="productId!=0" type="primary" icon="plus" class="add" @click="addLongComment">新增长评</Button>
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
                <router-link :to="{ name: 'Customer',params:{customerName:item.customerName}}" class="aLink">
                {{item.customerName}}
                </router-link>
                <span>{{item.gmtCreate}}</span>
              </p>

              <div v-if="item.isOfficial==0" class="contentWrp bk">{{item.content}}</div>
              <div v-else style="margin:10px 0;"><a @click="showComment(item.content)" href="javascript:void(0)">点击查看长评</a></div>
              <div class="btmWrp">
                <span>点赞数：{{item.commentLikeNum}}
                  <a href="javascript:;" class="aLink" @click="setLike({commentId:item.id,commentLikeNum:item.commentLikeNum})">设置点赞数</a>
                </span>
                <span class="ml15">回复数：{{item.replyNum}}
                  <template v-if="item.replyNum > 0">
                    <a href="javascript:;" class="aLink" @click="openReply(index)">{{ item.isOpen ? '收起回复' : '查看回复'}} </a>
                  </template>
                </span>
              </div>
            </div>

            <div class="opeWrp">

              <a href="javascript:;" class="aLink" @click="addReply({ commentId:item.id,replyType:1,toCustomerId:item.customerId, toReplyId:0 },index)">回复</a>
              <span class="cededed">|</span>
              <a href="javascript:;" class="aLink" @click="deleteComment({commentId:[item.id]})">删除</a>
              <span v-if="item.isOfficial==0">
                  <a v-if="item.isHot==1" href="javascript:;" style="margin-left:10px;" class="aLink" @click="setCommentHotFun({commentId:item.id,isHot:0})">取消热门</a>
              <a v-else href="javascript:;" style="margin-left:10px;" class="aLink" @click="setCommentHotFun({commentId:item.id,isHot:1})">设置热门</a>
              </span>

            </div>
          </div>

          <div class="commentTypeWrp">
            评论了作品：
            <a href="javascript:;" @click="goToContent(item.productName)">
              [
              <span style="margin-right:10px;">编号:{{item.productId}}</span> {{item.productName}} ]
            </a>
          </div>

          <template v-if="item.replyNum > 0">
            <Reply :index="index" :commentId="item.id" :isOpen="item.isOpen" :reload="item.reload" @updateIsOpen="val=>commentList[index].isOpen=val"></Reply>
          </template>
        </li>
      </ul>
    </div>

    <Page class="paging tr mt10" :current="pageNo" :total="totalItems" show-total show-elevator :page-size-opts="[10,20,30]" placement="top" @on-change="onChage" @on-page-size-change="onPageSizeChange" v-if="commentList.length!=0"></Page>

    <div class="noDataWrp" v-if="commentList.length==0&&loading==false">
      暂无数据！
    </div>

    <AddReply :pIsShowModel="pIsShowModel" :pReplyInfo="pReplyInfo" :pCommentInfo="pCommentInfo" :commentType="commentType" :pIndex="pIndex" @updatepIsShowModel="val=>pIsShowModel=val" @resetReplyList="index=>commentList[index].reload=true"></AddReply>

    <SetLike :pLikeIsShowModel="pLikeIsShowModel" :pLikeInfo="pLikeInfo" @updatepLikeIsShowModel="val=>pLikeIsShowModel=val" @updatepLikeInfo="()=>pLikeInfo={}"></SetLike>



  </div>
</template>

<script>
import { Page, Button, Input, Select, Option, Tabs, TabPane } from 'iview'

import { getCommentList, deleteComment, setCommentHot } from './Comment.service'
import Reply from './Reply.vue'
import AddReply from './AddReply.vue'
import SetLike from './SetLike.vue'
import EyFilter from '../Common/EyFilter/EyFilter'
export default {
  name: 'Comment',
  components: {
    Page,
    Button,
    Input,
    Select,
    Option,
    Reply,
    AddReply,
    SetLike,
    Button,
    Tabs,
    TabPane,
    EyFilter
  },
  data() {
    return {
      pCommentInfo: {},
      productId: '',
      customerId: '',
      customerName: '',
      productName: '',
      content: '',
      pageNo: 1,
      pageSize: 10,
      sortField: '',
      sort: '',
      commentList: [],
      index: 0,
      labelList: ['作品评论列表', '艺术家评论列表'],
      totalItems: 0,
      pIsShowModel: false,
      pLikeIsShowModel: false,
      pReplyInfo: {},
      commentType: 1,
      pIndex: 0,
      pLikeInfo: {},
      condition: 0,
      kw: '',
      loading: false,
      searchList: [
        { value: 0, name: '用户名称' },
        { value: 1, name: '作品名称' },
        { value: 2, name: '评论内容' }
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
      if (query.productId) {
        this.productId = parseInt(query.productId, 10)
      } else {
        this.productId = ''
      }
      if (query.customerId) {
        this.customerId = parseInt(query.customerId, 10)
      } else {
        this.customerId = ''
      }
      this.getCommentList()
    },
    getCommentList() {
      this.loading = true
      this.setSearch()
      const {
        productId,
        customerId,
        customerName,
        productName,
        content,
        pageNo,
        pageSize,
        sortField,
        sort
      } = this

      const obj = this.operateObj({
        productId,
        customerId,
        customerName,
        productName,
        content
      })
      const searchInfo = JSON.stringify(obj)
      const postData = {
        searchInfo,
        pageNo,
        pageSize,
        sortField,
        sort,
        presentCustomerId: 0
      }
      getCommentList(postData).then(
        ({ code, data: { totalItems, totalPages, commentList } }) => {
          this.loading = false
          this.totalItems = totalItems
          this.commentList = this.operateData(commentList)
        }
      )
    },
    operateObj(obj) {
      const newObj = {}
      for (let o in obj) {
        if (obj[o] != '') {
          newObj[o] = obj[o]
        }
      }
      console.log(newObj)
      return newObj
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

    // 新增长评 （v3.2）
    addLongComment() {
      console.log(this.$route.query.productId)
      this.$router.push({
        path: '/addLongComment',
        query: { productId: this.$route.query.productId }
      })
    },
    addComment() {
      this.pCommentInfo = {
        content: '', // 内容
        customerId: 0, // 用户id
        productId: this.productId // 作品id
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
          deleteComment({
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
    setCommentHotFun({ commentId, isHot }) {
      const postData = {
        commentId,
        isHot
      }
      setCommentHot(postData).then(({ code }) => {
        if (code == '10000') {
          this.$Message.success(`${isHot == 1 ? '设置' : '取消'}热门成功！`)
          this.getCommentList()
        }
      })
    },
    onChage(pageNo) {
      this.pageNo = pageNo
      this.getCommentList()
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getCommentList()
      name
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
    setSearch() {
      const kw = this.kw
      this.customerName = ''
      this.productName = ''
      this.content = ''
      switch (this.condition) {
        case 0:
          this.customerName = kw
          break
        case 1:
          this.productName = kw
          break
        case 2:
          this.content = kw
          break
        default:
          customerName = kw
          break
      }
    },
    hanleSearch() {
      this.pageNo = 1
      this.getCommentList()
    },
    goToContent(productName) {
      this.$router.push({
        name: 'Base',
        params: {
          tab: '1',
          productName
        }
      })
    },

    // 查看长评
    showComment(content) {
      this.$Modal.info({
        title: '查看长评',
        content: content,
        width: 700,
        closable: true
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
