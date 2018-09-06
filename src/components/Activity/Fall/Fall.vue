<template>
  <div>
    <h2 style="margin-bottom:10px;">上传活动照片</h2>
    <div class="demo-upload-list"
         v-for="item in uploadList"
         :key="item.id">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline"
                @click.native="handleView(item)"></Icon>
          <Icon type="ios-trash-outline"
                @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress"
                  :percent="item.percentage"
                  hide-info></Progress>
      </template>
    </div>
    <Upload ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :accept="'image/gif,image/jpeg,image/jpg,image/png'"
            :format="['jpg','jpeg','png']"
            :max-size="6144"
            :data="data"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            action="https://up-z2.qbox.me"
            style="width:98px;margin-bottom:20px;">
      <div style="width:98px;height:98px;line-height:98px;text-align:center;">
        <Icon type="ios-camera"
              size="20"></Icon>
      </div>
    </Upload>
    <Button type="success"
            ghost
            @click="handleSubmit()"
            style="width:100px;"
            :loading="loading"
            :disabled="disabled">保存</Button>
    <Modal title="View Image"
           v-model="visible">
      <img :src="imgSrc"
           v-if="visible"
           style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import { Modal, Upload, Progress, Icon, Button } from 'iview'
import config from '../../../libs/js/config.js'
import util from '../../../libs/js/util.js'
import {
  batchSetResourceInfo,
  getResourceInfoPage
} from '../Activity.service.js'
export default {
  name: 'fall',
  data() {
    return {
      loading: false,
      disabled: true,
      defaultList: [],
      pageNo: 1,
      pageSize: 10,
      imgName: '',
      imgSrc: '',
      visible: false,
      uploadList: [],
      text: '上传图片',
      data: {
        file: 'file',
        token: '',
        key: ''
      },
      prdfix: 'eyadmin',
      imgHost: config.imgHost
    }
  },
  components: {
    Modal,
    Upload,
    Progress,
    Icon,
    Button
  },
  methods: {
    async getQNToken() {
      this.data.token = await util.getQNToken()
    },
    handleView(item) {
      this.imgSrc = item.url
      this.visible = true
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      if (fileList.length === 0) {
        this.disabled = true
      }
    },
    handleSuccess(res, file, fileList) {
      file.url = `${config.imgHost}${res.key}`
      this.disabled = false
    },
    handleFormatError(file) {
      this.$Message.warning({
        title: 'The file format is incorrect',
        desc:
          'File format of ' +
          file.name +
          ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize(file) {
      this.$Message.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload(file) {
      if (file) {
        this.data.key = `${this.prdfix}/${util._guid()}${file.name.slice(
          file.name.lastIndexOf('.')
        )}`
      }
    },
    opearateList(list) {
      list.map(item => {
        item.type = 99
        delete item.response
        delete item.percentage
        delete item.size
        delete item.showProgress
      })
      return list
    },
    async addImages() {
      this.uploadList = this.opearateList(this.uploadList)
      const { code, msg, data } = await batchSetResourceInfo({
        resourceInfos: JSON.stringify(this.uploadList)
      })
      if (+code === 10000) {
        this.loading = false
        this.disabled = true
        this.$Message.success('上传图片成功')
      }
    },

    async getDataList() {
      const param = {
        type: 99,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }

      const { data, code, msg } = await getResourceInfoPage(param)
      if (code === 10000) {
        console.log(data)
      }
    },

    handleSubmit() {
      this.loading = true
      this.disabled = false
      this.addImages()
    }
  },
  mounted() {
    this.getQNToken()
    this.getDataList()
    this.uploadList = this.opearateList(this.$refs.upload.fileList)
  }
}
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>

