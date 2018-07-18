<template>

  <div id="setLike">
    <Modal id="setLike" class-name="vertical-center-modal" title="设置投票数" v-model="isShowModel" width="400">
      <Form class="mt10" ref="formValidate" :model="likeInfo" :rules="ruleValidate" :label-width="80" @submit.native.prevent>
        <FormItem label="投票数" prop="voteNum">
          <Input v-model.trim="likeInfo.voteNum" placeholder="" number autofocus></Input>
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
import { setAntiqueVoteNum } from './Culture.service.js';

export default {
  name: 'SetVote',
  data() {
    const isPositiveInteger = s => {//是否为正整数
      const re = /^[0-9]+$/;
      return re.test(s);
    };
    const validateLikeNum = (rule, value, callback) => {
      if ((value + '') == '') {
        callback(new Error('投票数不能为空'));
      } else {
        if ((value + '').indexOf(" ") != -1) {
          callback(new Error('投票数不能有空格'));
        } else if (!isPositiveInteger(value)) {
          callback(new Error('投票数不是正整数'));
        } else {
          callback();
        }
      }
    };
    return {
      isShowModel: this.pVoteIsShowModel,
      likeInfo: {
        voteNum: 0,
      },
      ruleValidate: {
        voteNum: [
          { validator: validateLikeNum, trigger: 'blur' }
        ]
      }

    }
  },
  components: { Button, Input, Form, FormItem, Modal },
  props: {
    pVoteIsShowModel: {
      type: Boolean,
      default: false,
    },
    pVoteInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    pVoteInfo(newValue) {
      console.log(newValue);
      this.likeInfo = newValue;
    },
    pVoteIsShowModel(newValue) {
      this.isShowModel = newValue;
    },
    isShowModel(newValue) {
      console.log(this.$refs);
      if (!newValue) {
        this.$refs['formValidate'].resetFields();
        this.$emit('updatepLikeInfo');
        // this.$emit('updatepIsAdd', true);
      }
      this.$emit('updatepLikeIsShowModel', newValue);
    }
  },
  mounted() {
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const { antiqueId, voteNum } = this.likeInfo;
          const postData = {
            antiqueId,
            voteNum
          };
          setAntiqueVoteNum(postData).then(({ code }) => {
            if (+code == 10000) {
              this.$Message.success('设置投票成功！');
              this.$parent.getDataList();
              this.isShowModel = false;
            } else {
              this.$Message.error('设置投票失败！');
            }
          });

        } else {
          this.$Message.error('设置投票失败！');
        }
      })
    },
  }
}
</script>

<style lang="less">

</style>
