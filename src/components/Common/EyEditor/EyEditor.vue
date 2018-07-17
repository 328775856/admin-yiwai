<template>
  <!-- 
  - 使用方法
  - id String {必填} 唯一标识
  - ref String {必填} 用来获取富文本内容 获取方法  this.$refs.editor1.getContent()
  - :content String {非必填} 在修改场景可能用到
  - :insertButton Arrary {非必填} 配置可以用来插入图片/视频
  - :toolbars Arrary {非必填} 用来配置富文本操作项

  - eg:
    <EyEditor id="editor1" ref="editor1" :content="'<p>test</p>'" :insertButton="['img','video']" :toolbars=" [[
          'fullscreen',
          'undo', 'redo', '|',
          'paragraph', 'fontsize', '|',
          'indent', '|',
          'bold', 'italic', 'underline', '|',
          'forecolor', 'backcolor', '|',
          'insertorderedlist', 'insertunorderedlist', '|',
          'justifyleft', 'justifycenter', 'justifyright', '|',
          'link', 'unlink',
          '|', 'removeformat'
        ]]"></EyEditor>
-->

  <div class="eyEditor">
    <div class="btnWrp">
      <!-- <Button type="primary" @click="insertImg('https://img.kanhua.yiwaiart.com/eyadmin/008d7cd3-8a70-48d5-8dc1-4c074feb6c0a.jpg')">插入图片</Button>
      <Button type="primary" @click="insertVideo('https://img.kanhua.yiwaiart.com/eyadmin/aa908a05-cba6-4f97-ba51-c679cc6fda02.mp4')">插入视频</Button> -->

      <EyUpload v-if="this.insertButtonObj['img']" @before-upload="beforeUpload_img" @upload-ok="uploadOk_img" @upload-error="uploadError_img"
        accept="image/jpeg,image/jpg,image/png" text="插入图片" />
      <Button v-if="this.insertButtonObj['video']" type="ghost" icon="plus" @click="()=>this.isShowModel=true">插入视频</Button>
    </div>
    <div class="mt5" :id="id" type="text/plain" style="width:95%;height:500px;"></div>

    <Modal v-if="this.insertButtonObj['video']" title="插入视频" v-model="isShowModel" :mask-closable="false" :closable="false" width="400">
      <Form class="mt10" ref="formValidate" :model="videoInfo" :rules="ruleValidate" :label-width="80">
        <FormItem label="视频链接" prop="videoUrl">
          <Input v-model.trim="videoInfo.videoUrl" placeholder="请输入有效的视频链接" />
          <span>目前格式只支持MP4</span>
        </FormItem>
      </Form>
      <div slot="footer">
        <div class="clearfix">
          <EyUpload class="fl" @before-upload="beforeUpload_video" @upload-ok="uploadOk_video" @upload-error="uploadError_video" accept="video/mp4"
            text="上传视频文件" />
          <div class="fr">
            <Button type="primary" icon="plus" @click="handleSubmit('formValidate')">插入视频</Button>
            <Button type="text" @click="()=>this.isShowModel=false">取消</Button>
          </div>
        </div>

      </div>
    </Modal>

    <div class="mask" v-show="isMask">
      <div class="progressWrp">
        <Progress :percent="percent" status="active"></Progress>
        <div class="sUpload">正在上传,请等待...</div>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../../../static/utf8-jsp/ueditor.config';
  import '../../../../static/utf8-jsp/ueditor.all';
  import '../../../../static/utf8-jsp/lang/zh-cn/zh-cn';
  import {
    Button,
    Progress,
    Modal,
    Form,
    FormItem,
    Input,
  } from 'iview';
  import EyUpload from '../EyUpload/EyUpload'

  export default {
    name: "EyEditor",
    components: {
      Button,
      Progress,
      Modal,
      Form,
      FormItem,
      Input,
      EyUpload
    },
    props: {
      id: {
        required: true,
        type: String,
        default: '',
      },
      content: {
        type: String,
        default: '',
      },
      insertButton: {
        type: Array,
        default () {
          return [
            'img',
            'video'
          ]
        }
      },
      toolbars: {
        type: Array,
        default () {
          return [
            [
              'fullscreen',
              'undo', 'redo', '|',
              'paragraph', 'fontsize', '|',
              'indent', '|',
              'bold', 'italic', 'underline', '|',
              'forecolor', 'backcolor', '|',
              'insertorderedlist', 'insertunorderedlist', '|',
              'justifyleft', 'justifycenter', 'justifyright', '|',
              'link', 'unlink',
              '|', 'removeformat'
            ]
          ]
        },
      }
    },
    data() {
      return {
        insertButtonObj: null,
        ue: null,
        timer: null,
        percent: 0,
        isProgressShow: false,
        isMask: false,

        isShowModel: false,
        videoInfo: {
          videoUrl: ''
        },
        ruleValidate: {
          videoUrl: [{
            required: true,
            message: '视频链接不能为空',
            trigger: 'blur'
          }]
        },
      };
    },
    watch: {
      ue(ue) {
        ue.addListener('ready', () => {
          const {
            content
          } = this;
          if (content != '')
            ue.setContent(this.regReplace(content, 2));
        });
      },
      isShowModel(newValue) {
        if (!newValue) {
          this.$refs['formValidate'].resetFields();
        }
      }
    },
    created() {
      const {
        insertButton
      } = this;
      const obj = {};
      insertButton.map((item, i) => {
        obj[item] = true;
      });
      this.insertButtonObj = obj;
      console.log(this.insertButtonObj);
    },
    mounted() {
      console.log(this.id, 'id');
      this.ue = UE.getEditor(this.id, {
        BaseUrl: '',
        UEDITOR_HOME_URL: 'static/utf8-jsp/',
        toolbars: this.toolbars
      })
    },
    methods: {
      beforeUpload_img() {
        this.beforeUploadUI();
      },
      uploadOk_img({
        url
      }) {
        console.log(url, '图片路径');
        this.completeUI();
        this.$Message.success('插入图片成功！');
        this.insertImg(url);
      },
      uploadError_img() {
        this.completeUI();
        this.$Message.warning('插入图片失败，请重新添加！');
      },


      beforeUpload_video() {
        this.beforeUploadUI();
      },
      uploadOk_video({
        url
      }) {
        this.completeUI();

        this.isShowModel = false;
        this.$Message.success('插入视频成功！');
        this.insertVideo(url);
      },
      uploadError_video() {
        this.completeUI();
        this.$Message.warning('插入视频失败，请重新添加！');
      },
      insertImg(url) {
        this.ue.execCommand('inserthtml', '<p style="text-align: center"><img style="max-width:80%;" src="' + url +
          '" /></p>', true);
      },
      insertVideo(url) {
        this.ue.execCommand('inserthtml', '<p style="text-align: center"><video style="max-width:80%;" src="' + url +
          '" controls="controls">不支持视频！</video></p>', true);
      },
      beforeUploadUI() {
        this.isMask = true;
        this.percent = 0;

        setTimeout(() => {
          this.timer = setInterval(() => {
            const n = parseInt(Math.random() * 4, 10);
            this.percent += n;
            if (this.percent >= 85) {
              clearInterval(this.timer);
            }
          }, 200);
        }, 300);
      },
      completeUI() {
        clearInterval(this.timer);
        this.percent = 100;
        setTimeout(() => {
          this.isMask = false;
        }, 1500);
      },
      getContent() {
        return this.regReplace(this.ue.getContent(), 1);
      },

      /**
       * 正则表达式替换 max-width:80%; 为 max-width:100%;
       */
      regReplace(str, mode) {
        let s = str;
        if (mode == 1) {
          s = str.replace(/max-width:80%/g, 'max-width:100%');
        } else if (mode == 2) {
          s = str.replace(/max-width:100%/g, 'max-width:80%');
        }
        console.log(s,'富文本内容');
        return s;
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.insertVideo(this.videoInfo.videoUrl);
            this.$Message.success('插入视频成功！');
            this.isShowModel = false;
          } else {
            this.$Message.error('插入视频失败！');
          }

        })
      }
    },
    destroyed() {
      this.ue && this.ue.destroy();
    }
  };

</script>

<style lang="less">
  .eyEditor {
    line-height: normal !important;
    .mask {
      z-index: 100001;
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);

      .progressWrp {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 400px;
        transform: translate(-50%, -50%);
        .ivu-progress-text {
          color: #fff;
          .ivu-icon-ios-checkmark {
            color: #19be6b !important;
          }
        }
        .sUpload {
          text-align: center;
          padding: 3px 0;
          color: #fff;
        }
      }
    }
    .btnWrp {
      .eyUpload {
        display: inline-block;
      }
    }
    .mt5 {
      margin-top: 5px;
    }
    .mt10 {
      margin-top: 10px;
    } // 如果需要显示到页面，则需引入一下class，才能与编辑器编写的格式保持一致
    .eyEditor {
      .list-paddingleft-2 {
        padding-left: 30px;
      }
      .f16 {
        font-size: 16px;
      }
    }
  }

</style>
