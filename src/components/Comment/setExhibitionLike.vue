<template>

  <div id="setLike">
    <Modal id="setLike" class-name="vertical-center-modal" title="设置点赞数" v-model="isShowModel" width="400">
      <Form class="mt10" ref="formValidate" :model="likeInfo" :rules="ruleValidate" :label-width="80" @submit.native.prevent>
        <FormItem label="点赞数" prop="commentLikeNum">
          <Input v-model.trim="likeInfo.commentLikeNum" placeholder="" number autofocus></Input>
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
import { Button, Input, Form, FormItem, Modal } from 'iview'
import { setExhibitionCommentLikeNum } from './CommentExhibition.service.js'

export default {
  name: 'SetArtistLike',
  data() {
    const isPositiveInteger = s => {
      //是否为正整数
      const re = /^[0-9]+$/
      return re.test(s)
    }
    const validateLikeNum = (rule, value, callback) => {
      if (value + '' == '') {
        callback(new Error('点赞数不能为空'))
      } else {
        if ((value + '').indexOf(' ') != -1) {
          callback(new Error('点赞数不能有空格'))
        } else if (!isPositiveInteger(value)) {
          callback(new Error('点赞数不是正整数'))
        } else {
          callback()
        }
      }
    }
    return {
      isShowModel: this.pLikeIsShowModel,
      likeInfo: {
        commentLikeNum: 0
      },
      ruleValidate: {
        commentLikeNum: [{ validator: validateLikeNum, trigger: 'blur' }]
      }
    }
  },
  components: { Button, Input, Form, FormItem, Modal },
  props: {
    pLikeIsShowModel: {
      type: Boolean,
      default: false
    },
    pLikeInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    pLikeInfo(newValue) {
      console.log(newValue)
      this.likeInfo = newValue
    },
    pLikeIsShowModel(newValue) {
      this.isShowModel = newValue
    },
    isShowModel(newValue) {
      console.log(this.$refs)
      if (!newValue) {
        this.$refs['formValidate'].resetFields()
        this.$emit('updatepLikeInfo')
        // this.$emit('updatepIsAdd', true);
      }
      this.$emit('updatepLikeIsShowModel', newValue)
    }
  },
  mounted() {},
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const { commentId, commentLikeNum } = this.likeInfo
          const postData = {
            commentId,
            commentLikeNum
          }
          setExhibitionCommentLikeNum(postData).then(({ code }) => {
            if (+code == 10000) {
              this.$Message.success('设置点赞成功！')
              this.$parent.getCommentList()
              this.isShowModel = false
            } else {
              this.$Message.error('设置点赞失败！')
            }
          })
        } else {
          this.$Message.error('设置点赞失败！')
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
