<template>
  <div id="addVideo">
    <Modal title="上传素材" v-model="isShowModel" width="400">
        <div class="flex">
          <div style="width:80px; text-align:right;padding-right:12px;">素材类型</div>
          <div class="flex-item">
            <RadioGroup v-model="MaterialType" @on-change="changeMaterialType">
              <Radio label="视频"></Radio>
              <Radio label="音频"></Radio>
            </RadioGroup>
          </div>
        </div>
     <template v-if="MaterialType === '视频'">
        <Form class="mt10" ref="formValidate" :model="Material" :rules="ruleValidate" :label-width="80">
          <FormItem label="标题" prop="videoTitle">
            <Input v-model="Material.videoTitle" placeholder="" key="videoInfoTitle" />
          </FormItem>
          <FormItem label="上传视频" prop="videoUrl">
            <EyUpload @before-upload="beforeUpload" @upload-ok="uploadOk" @upload-error="uploadError" accept="video/mp4" />
            <span>目前格式只支持MP4</span>
            <Progress v-if="isProgressShow" :percent="percent" status="active"></Progress>
          </FormItem>
      </Form>
     </template>
     <template v-else>
        <Form class="mt10" ref="formValidate" :model="Material" :rules="ruleValidate" :label-width="80">
         <FormItem label="标题" prop="audioTitle">
            <Input v-model="Material.audioTitle" placeholder="" key="audioInfoTitle" />
          </FormItem>
          <FormItem label="上传音频" prop="audioUrl">
            <EyUpload @before-upload="beforeUpload" @upload-ok="uploadOk" @upload-error="uploadError" accept="audio/mp3" />
            <span>目前格式只支持MP3</span>
            <Progress v-if="isProgressShow" :percent="percent" status="active"></Progress>
          </FormItem>
      </Form>
     </template>
      <div slot="footer">
        <Button type="text" @click="()=>this.isShowModel=false">取消</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
      </div>
    </Modal>
    <div class="mask" v-show="isMask"></div>
  </div>
</template>

<script>
import EyUpload from '../Common/EyUpload/EyUpload';

import {
  setMaterial
} from "./Video.service";

import {
  Button,
  Input,
  Form,
  FormItem,
  Modal,
  Progress,
  RadioGroup,
  Radio
} from 'iview';
export default {
  name: "AddVideo",
  components: {
    Button,
    Input,
    Form,
    FormItem,
    Modal,
    Progress,
    EyUpload,
    RadioGroup,
    Radio
  },
  props: {
    pIsShowModel: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    pIsShowModel(newValue) {
      this.isShowModel = newValue;
    },
    isShowModel(newValue) {
      if (!newValue) {
        this.$refs['formValidate'].resetFields();
        this.isProgressShow = false;
      }
      this.$emit('updatepIsShowModel', newValue);
    }
  },
  data() {
    return {
      MaterialType:'视频',
      Material: {
        videoTitle: '',
        videoUrl: '',
        audioTitle:'',
        audioUrl:''

      },
      ruleValidate: {
        videoTitle: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        videoUrl: [
          { required: true, message: '视频不能为空', trigger: 'blur' }
        ],
        audioTitle: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        audioUrl: [
          { required: true, message: '音频不能为空', trigger: 'blur' }
        ]
      },
      isShowModel: this.pIsShowModel,
      percent: 0,
      timer: null,
      isProgressShow: false,
      isMask: false,
    };
  },
  mounted() {

  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate( async (valid) => {
        if (valid) {
          let postData;
          if(this.MaterialType ==='视频'){
            postData = {
              title:this.Material.videoTitle,
              materialType:1,
              materialUrl:this.Material.videoUrl
            }
          }else{
             postData = {
              title:this.Material.audioTitle,
              materialType:2,
              materialUrl:this.Material.audioUrl
            }
          }
          console.log(postData, 'postData');
          const {code} = await setMaterial(postData);
          if(code===10000 | code ==="10000"){
              this.$Message.success('新增视频成功!');
              this.isShowModel = false;
              this.$parent.pageNo = 1;
              this.$parent.currentPage =1;
              this.$parent.getMaterialList();
          }else{
              this.$Message.error('新增视频失败!');
          }
        }else{
          console.log("gg");
        }
      })
    },
    beforeUpload() {
      this.isMask = true;
      this.isProgressShow = false;
      setTimeout(() => {
        this.percent = 0;
        this.isProgressShow = true;
        this.timer = setInterval(() => {
          const n = parseInt(Math.random() * (3 - 1 + 1) + 1, 10);
          this.percent += n;
          if (this.percent >= 85) {
            clearInterval(this.timer);
          }
        }, 200);
      }, 300);
    },
    uploadOk({ url }) {
      this.$Message.success('上传成功!');
      if(this.MaterialType ==="视频"){
        this.Material.videoUrl = url;
      }else if(this.MaterialType === "音频"){
        this.Material.audioUrl = url;
      }
      clearInterval(this.timer);
      this.percent = 100;
      this.isMask = false;
    },
    uploadError(error) {
      this.isProgressShow = false;
      this.isMask = false;
      this.$Message.error('上传失败!请重新上传！');
    },
    changeMaterialType(){
      this.$refs["formValidate"].resetFields();
    }
  }
};
</script>

<style lang="less">
@import "../../libs/css/common.less";
#addVideo {
  .mask {
    z-index: 100001;
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
