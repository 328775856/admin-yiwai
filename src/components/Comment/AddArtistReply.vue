<template>
  <div>
    <Modal id="addReply" class-name="vertical-center-modal" :title="commentType==1?'添加评论':'添加回复'" v-model="isShowModel" width="400">
      <Form class="mt10" ref="formValidate" :model="replyInfo" :rules="ruleValidate" :label-width="80">
        <FormItem label="虚拟用户" prop="nickName">

          <EySelectsearch ref="eySelectsearch" url="/getCustomerStatisticsList/v1" name="nickName" resultList="customerList" :postData="{searchInfo: { isVirtual: 1, nickName: '' },pageNo: 0,pageSize: 10,sortField: '',sort: ''}" :kv="['customerId','customerDto.nickName']" placeHolder="请选择虚拟用户" @getItem="getItem">
          </EySelectsearch>

          <!-- <Input v-model="replyInfo.nickName" placeholder=""></Input> -->
        </FormItem>

        <FormItem label="回复内容" prop="content">
          <Input v-model.trim="replyInfo.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="()=>this.isShowModel=false">取消</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Button, Input, Form, FormItem, Modal } from 'iview';
import { addArtistComment, addArtistReply } from './CommentArtist.service';
import EySelectsearch from '../Common/EySelectsearch.vue';
export default {
  name: 'AddArtistReply',
  data() {
    return {
      isShowModel: this.pIsShowModel,
      index: this.pIndex,
      pShowValue: '',
      customerId: 0,
      artistId:Number(this.$route.query.artistId),
      replyInfo: {
        nickName: '',
        content: ''
      },
      ruleValidate: {
        nickName: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: { Button, Input, Form, FormItem, Modal, EySelectsearch },
  props: {
    pIsShowModel: {
      default: false,
    },
    pReplyInfo: {
      default() {
        return {};
      }
    },
    pCommentInfo: {
      default() {
        return {};
      }
    },
    pIndex: {
      type: Number,
      default: 0
    },
    commentType: {
      type: Number,
      default: 1
    }
  },
  mounted() {
    // console.log(this.pIndex, 'pIndex');
    // console.log(this.index, 'index');
    // console.log(this.pReplyInfo);
  },
  watch: {
    pIsShowModel(newValue) {
      this.isShowModel = newValue;
    },
    isShowModel(newValue) {
      if (!newValue) {
        this.$refs['formValidate'].resetFields();
        this.$refs['eySelectsearch'].reset();
      }
      this.$emit('updatepIsShowModel', newValue);
    },
    pIndex(newValue) {
      this.index = newValue;
    }
  },
  methods: {
    getItem(item) {
      console.log(item);
      this.customerId = item.key;
      this.replyInfo.nickName = item.value;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addReply();
        } else {
          this.$Message.error('添加评论失败！');
        }
      })
    },

    /**
     * 添加回复:1.添加作品评论，2.添加回复，3.添加回复回复
     * @param {Object} postData 请求参数
     * @param {Int} commentType 1:添加作品评论 2.其他
     */
    addReply() {
      console.log(this.commentType, 'commentType');
      if (this.commentType == 1) {
        console.log(this.artistId);
        const postData = Object.assign({}, this.pCommentInfo, {
          customerId: this.customerId,
          content: this.replyInfo.content,
          artistId:this.artistId
        });
        addArtistComment(postData).then(({ code }) => {
          if (code == '10000') {
            this.$Message.success('添加评论成功！');
            // 刷新列表页
            this.$parent.getCommentList();
            this.isShowModel = false;
          } else {
            this.$Message.error('添加评论失败！');
          }
        });
      } else {
        const postData = Object.assign({}, this.pReplyInfo, {
          customerId: this.customerId,
          content: this.replyInfo.content
        });
        addArtistReply(postData).then(({ code }) => {
          if (code == '10000') {
            this.$Message.success('添加回复成功！');
            // 刷新列表页
            this.$parent.getCommentList();
            this.$emit('resetReplyList', this.index);
            this.isShowModel = false;
          } else {
            this.$Message.error('添加回复失败！');
          }
        });
      }
    }


  }
}

</script>

<style lang="less">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>
