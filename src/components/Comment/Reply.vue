<template>
  <div class="reply" v-show="isOpen">
    <ul class="childWrp">
      <li v-for="(item,index) in replyList" :key="index">
        <div class="mui-flex">
          <div class="imgWrp">
            <img :src="item.customerImg" alt=":)">
          </div>

          <div class="cell">
            <p>{{item.customerName}}
              <span>{{item.createTime}}</span>
            </p>
            <div class="contentWrp bk">
              <span v-if="item.replyType==2" class="aLink">@{{item.toCustomerName}}</span>
              {{item.content}}
            </div>
            <!-- <div class="btmWrp">
              <span>点赞数：{{item.replyLikeNum}}
                <a href="javascript:;" class="aLink" @click="_setLike(item,2)">设置点赞数</a>
              </span>
            </div> -->
          </div>
          <div class="opeWrp">
            <a href="javascript:;" class="aLink" @click="addReply({commentId:commentId,replyType:2,toCustomerId:item.customerId, toReplyId:item.id })">回复</a>
            <span class="cededed">|</span>
            <a href="javascript:;" class="aLink" @click="deleteReply({replyId:[item.id]})">删除</a>
          </div>
        </div>
      </li>
    </ul>

    <div class="btnMore clearfix">
      <a href="javascript:;" class="aLink" @click="more" v-if="!isLoadFinish">查看更多 >></a>
      <span v-else>已全部加载完毕</span>
      <a href="javascript:;" class="aLink fr" @click="hide">收起↑</a>
    </div>

  </div>

</template>

<script>

import {
  getReplyList,
  deleteReply
} from './Comment.service';
export default {
  name: 'Reply',
  data() {
    return {
      pageNo: 0,
      pageSize: 5,
      isLoadFinish: false,
      isLock: false,
      replyList: [],
    }
  },
  props: {
    commentId: {
      type: Number,
      default: 0
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    reload: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    }
  },
  watch: {
    isOpen(newValue) {
      if (newValue && this.replyList.length == 0) {
        this.getReplyList();
      }
    },
    reload(newValue) {
      if (newValue) {
        this.pageNo = 0;
        this.isLoadFinish = false;
        this.replyList = [];
      }
    }
  },
  mounted() {
  },
  methods: {
    getReplyList() {
      if (!this.isLock) {
        this.pageNo += 1;
        this.isLock = true;
        const { commentId, pageNo, pageSize } = this;
        const postData = {
          commentId,
          customerId: 0,
          pageNo,
          pageSize
        };
        getReplyList(postData).then(({ data: { replyList } }) => {
          this.isLock = false;
          if (replyList && replyList.length == 0) {
            this.isLoadFinish = true;
          } else {
            this.replyList = [...this.replyList, ...replyList];
          }
        });
      }
    },
    more() {
      this.getReplyList();
    },
    hide() {
      this.$emit('updateIsOpen', false);
    },
    addReply({ commentId, replyType, toCustomerId, toReplyId }, index = this.index) {
      this.$parent.addReply({ commentId, replyType, toCustomerId, toReplyId }, index);
    },
    deleteReply({ replyId }) {
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除回复？</p>`,
        onOk: () => {
          deleteReply({ replyId }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success('删除成功！');
              // 刷新列表页
              this.$parent.getCommentList();
              this.$parent.commentList[this.index].reload = true;
            }
          });
        },
        onCancel: () => {
        }
      });
    },
  }
}

</script>

<style lang="less">

</style>
