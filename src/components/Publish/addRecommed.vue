<template>
  <div id="addRecommed">
        <div class="title">推荐类型 （请选择推荐类型）</div>
        <div class="flex">
              <div class="flex-item" >
                <button v-for="(item,index) in typeList" :key="item.id"  class="ey-button" @click="chooseType(index)" :class="{active:item.isActive}">{{item.name}}</button>
              </div>
        </div>
     <div class="title">基本信息</div>
     <template v-if="MaterialType === 0">
        <Form class="mt10"  ref="pictureForm" :model="pictureForm"  :rules="pictureRuleValidate" :label-width="100">
          <FormItem label="艺术品编号:" prop="pictureitemId">
            <Input v-model="pictureForm.pictureitemId" placeholder="" key="itemId" style="width:30%" />
            <router-link to="base?tab=1" target="_blank">查看艺术品列表</router-link>
          </FormItem>
          <FormItem label="名称:" prop="picturename">
            <Input v-model="pictureForm.picturename" placeholder="" key="name" style="width:30%" />
          </FormItem>
          <FormItem label="图片:" prop="pictureimageUrl">
              <EyUpload @upload-ok="getpictureImageUrl" @upload-error="uploadError" imgSizeText="图片尺寸：690 X 342" @upload-exceeded-size="uploadExceededSize"   accept="image/jpeg,image/jpg,image/png"/>
                <p v-show="isUploadOk">
                    <span class="headImg">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                        <img :src="pictureForm.pictureimageUrl+'?imageView2/1/w/135/h/165/q/50'" class="img">
                    </span>
                </p>
          </FormItem>
          <FormItem label="导语:" prop="picturelead">
            <Input type="textarea" v-model="pictureForm.picturelead" placeholder="请输入内容" style="width:30%"  />
          </FormItem>
           <FormItem label="推荐时间" prop="picturepublishTime" class="formItem45">
                <DatePicker :value="pictureForm.picturepublishTime" format="yyyy/MM/dd" type="date" placeholder="选择展期" style="width: 230px" ref="picturedata" @on-change="onPictureChange"></DatePicker>
            </FormItem>
      </Form>
      <div class="action">
        <Button type="primary" @click="handleSubmit('pictureForm')">保存</Button>
        <Button type="default" @click="cancel">取消</Button>
      </div>
     </template>
    <template v-else-if="MaterialType === 1">
        <Form class="mt10" ref="exhibitionForm" :model="exhibitionForm"  :rules="exhibitionRuleValidate" :label-width="100">
          <FormItem label="展览编号:" prop="exhibitionitemId">
            <Input v-model="exhibitionForm.exhibitionitemId" placeholder="" style="width:30%"  />
            <router-link to="content" target="_blank">查看展览列表</router-link>
          </FormItem>
          <FormItem label="名称:" prop="exhibitionname">
            <Input v-model="exhibitionForm.exhibitionname" placeholder="" style="width:30%"  />
          </FormItem>
          <FormItem label="图片:" prop="exhibitionimageUrl">
            <EyUpload @upload-ok="getexhibitionImageUrl" @upload-error="uploadError" @upload-exceeded-size="uploadExceededSize"   imgSizeText="图片尺寸：690 X 440"  accept="image/jpeg,image/jpg,image/png"/>
                <p v-show="isUploadOk">
                    <span class="headImg">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                        <img :src="exhibitionForm.exhibitionimageUrl+'?imageView2/1/w/135/h/165/q/50'" class="img">
                    </span>
                </p>
          </FormItem>
          <FormItem label="导语:" prop="exhibitionlead">
            <Input type="textarea" v-model="exhibitionForm.exhibitionlead" style="width:30%" placeholder="请输入内容"  />
          </FormItem>
          <FormItem label="推荐时间" prop="exhibitionpublishTime" class="formItem45">
              <DatePicker :value="exhibitionForm.exhibitionpublishTime" format="yyyy/MM/dd" type="date" placeholder="选择展期" style="width: 230px" ref="exhibitiondata" @on-change="onexhibitionChange"></DatePicker>
          </FormItem>
      </Form>
        <div class="action">
        <Button type="primary" @click="handleSubmit('exhibitionForm')">保存</Button>
        <Button type="default" @click="cancel">取消</Button>
      </div>
     </template>
     <template v-else>
        <Form class="mt10" ref="shoppingForm" :model="shoppingForm" :rules="shoppingRuleValidate" :label-width="100">
          <FormItem label="有赞商品路径:" prop="shoppinglinkUrl">
            <Input v-model="shoppingForm.shoppinglinkUrl" placeholder="" style="width:30%" />

            <a href="https://shimo.im/docs/opgk2R3wwnYphgrY" target="_black">查看帮助</a>
          </FormItem>
          <FormItem label="名称:" prop="shoppingname">
            <Input v-model="shoppingForm.shoppingname" placeholder="" style="width:30%"  />
          </FormItem>
          <FormItem label="图片:" prop="shoppingimageUrl">
            <EyUpload @upload-ok="getshoppingImageUrl" @upload-error="uploadError" imgSizeText="图片尺寸：690 X 440" @upload-exceeded-size="uploadExceededSize"   accept="image/jpeg,image/jpg,image/png"/>
                <p v-show="isUploadOk">
                    <span class="headImg">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                        <img :src="shoppingForm.shoppingimageUrl+'?imageView2/1/w/135/h/165/q/50'" class="img">
                    </span>
                </p>
          </FormItem>
          <FormItem label="导语:" prop="shoppinglead">
            <Input type="textarea" v-model="shoppingForm.shoppinglead" style="width:30%" placeholder="请输入内容"  />
          </FormItem>

          <FormItem label="推荐时间" prop="shoppingpublishTime" class="formItem45">
            <DatePicker :value="shoppingForm.shoppingpublishTime" format="yyyy/MM/dd" type="date" placeholder="选择展期" style="width: 230px" ref="shoppingdata" @on-change="onshoppingChange"></DatePicker>
          </FormItem>
      </Form>
            <div class="action">
        <Button type="primary" @click="handleSubmit('shoppingForm')">保存</Button>
        <Button type="default" @click="cancel">取消</Button>
      </div>
     </template>
  </div>
</template>

<script>
import EyUpload from '../Common/EyUpload/EyUpload'
import util from 'libs/js/util.js'
import { setHomePage } from './Publish.service'

import {
  Button,
  Input,
  Form,
  FormItem,
  Progress,
  RadioGroup,
  Radio,
  Icon,
  DatePicker
} from 'iview'
export default {
  name: 'addRecommed',
  components: {
    Button,
    Input,
    Form,
    FormItem,
    Progress,
    EyUpload,
    RadioGroup,
    Radio,
    Icon,
    DatePicker
  },

  // {
  // "itemId":"关联项目Id",
  // "itemType":"类型",
  // "name":"标题",
  // "imageUrl":"图片",
  // "linkUrl":"链接",
  // "lead":"导语",
  // "publishTime":"推荐时间",
  // "sortNum":"排序"，
  // “clickNum”:"点击数"
  // }
  data() {
    return {
      MaterialType: 0,
      isUploadOk: false,
      typeList: [
        { name: '品画', isActive: true, index: 0 },
        { name: '展览', isActive: false, index: 1 },
        { name: '商品', isActive: false, index: 2 }
      ],

      pictureForm: {
        pictureid: 0,
        pictureitemId: '',
        pictureitemType: 1,
        picturename: '',
        pictureimageUrl: '',
        picturelead: '',
        picturepublishTime: ''
      },

      exhibitionForm: {
        exhibitionid: 0,
        exhibitionitemId: '',
        exhibitionitemType: 2,
        exhibitionname: '',
        exhibitionimageUrl: '',
        exhibitionlead: '',
        exhibitionpublishTime: ''
      },

      shoppingForm: {
        shoppingid: 0,
        shoppingitemType: 3,
        shoppingname: '',
        shoppingimageUrl: '',
        shoppinglead: '',
        shoppinglinkUrl: '',
        shoppingpublishTime: ''
      },

      pictureRuleValidate: {
        pictureitemId: [
          { required: true, message: '编号不能为空', trigger: 'blur' }
        ],
        picturename: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        pictureimageUrl: [
          { required: true, message: '图片不能为空', trigger: 'blur' }
        ],
        picturelead: [
          { required: true, message: '导语不能为空', trigger: 'blur' }
        ],
        picturepublishTime: [
          {
            required: true,
            message: '推荐时间不能为空',
            trigger: 'blur'
          }
        ]
      },

      exhibitionRuleValidate: {
        exhibitionitemId: [
          { required: true, message: '编号不能为空', trigger: 'blur' }
        ],
        exhibitionname: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        exhibitionimageUrl: [
          { required: true, message: '图片不能为空', trigger: 'blur' }
        ],
        exhibitionlead: [
          { required: true, message: '导语不能为空', trigger: 'blur' }
        ],
        exhibitionpublishTime: [
          {
            required: true,
            message: '请选择推荐日期',
            trigger: 'change'
          }
        ]
      },

      shoppingRuleValidate: {
        shoppingname: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        shoppingimageUrl: [
          { required: true, message: '图片不能为空', trigger: 'blur' }
        ],
        shoppinglinkUrl: [
          { required: true, message: '商品链接不能为空', trigger: 'blur' }
        ],
        shoppinglead: [
          { required: true, message: '导语不能为空', trigger: 'blur' }
        ],
        shoppingpublishTime: [
          {
            required: true,
            message: '推荐时间不能为空',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    console.log(this.$route.params)
    if (this.$route.params.data) {
      console.log(this.$route.params.data)
      const { itemType } = this.$route.params.data
      const data = this.$route.params.data

      if (itemType == 1) {
        for (let item in data) {
          this.pictureForm['picture' + item] = data[item]
        }

        this.setIndex(itemType - 1)
        this.MaterialType = 0
        console.log(this.pictureForm)
      }
      if (itemType == 2) {
        for (let item in data) {
          this.exhibitionForm['exhibition' + item] = data[item]
        }

        this.setIndex(itemType - 1)
        this.MaterialType = 1
      }
      if (itemType == 3) {
        for (let item in data) {
          this.shoppingForm['shopping' + item] = data[item]
        }
        this.setIndex(itemType - 1)
        this.MaterialType = 2
      }
    }
  },
  mounted() {},
  methods: {
    getpictureImageUrl(file) {
      console.log(file)
      this.isUploadOk = true
      this.pictureForm.pictureimageUrl = file.url
    },
    getexhibitionImageUrl(file) {
      this.isUploadOk = true
      this.exhibitionForm.exhibitionimageUrl = file.url
    },
    getshoppingImageUrl(file) {
      this.isUploadOk = true
      this.shoppingForm.shoppingimageUrl = file.url
    },
    uploadError(error) {
      this.isUploadOk = false
      console.log(error)
    },
    uploadExceededSize() {
      this.$Message.error('文件超出大小限制!')
    },
    resetImg() {
      this.isUploadOk = false
      this.pictureForm.image = ''
    },
    chooseType(index) {
      this.typeList.map(item => {
        item.isActive = false
      })
      this.typeList[index].isActive = true
      this.MaterialType = this.typeList[index].index
      this.changeMaterialType()
    },
    onPictureChange() {
      //this.pictureForm.picturepublishTime = this.$refs.picturedata.visualValue
      this.pictureForm.picturepublishTime = util.getNowFormatDate(
        this.$refs.picturedata.internalValue[0],
        'ymd'
      )
      console.log(this.pictureForm.picturepublishTime)
    },
    onexhibitionChange() {
      this.exhibitionForm.exhibitionpublishTime = util.getNowFormatDate(
        this.$refs.exhibitiondata.internalValue[0],
        'ymd'
      )
    },
    onshoppingChange() {
      this.shoppingForm.shoppingpublishTime = util.getNowFormatDate(
        this.$refs.shoppingdata.internalValue[0],
        'ymd'
      )
    },
    setIndex(index) {
      this.typeList.map(item => {
        item.isActive = false
      })
      this.typeList[index].isActive = true
    },
    handleSubmit(name) {
      if (name == 'pictureForm') {
        this.pictureForm.pictureitemId = this.pictureForm.pictureitemId.toString()
      }
      if (name == 'exhibitionForm') {
        this.exhibitionForm.exhibitionitemId = this.exhibitionForm.exhibitionitemId.toString()
      }
      this.$refs[name].validate(async valid => {
        if (valid) {
          let tempData = ''
          let postData = {}
          if (name == 'pictureForm') {
            tempData = this.pictureForm
            for (let item in tempData) {
              postData[item.substr(7, item.length - 6)] = tempData[item]
            }
          }
          if (name == 'exhibitionForm') {
            tempData = this.exhibitionForm
            for (let item in tempData) {
              postData[item.substr(10, item.length - 9)] = tempData[item]
            }
          }
          if (name == 'shoppingForm') {
            tempData = this.shoppingForm
            for (let item in tempData) {
              postData[item.substr(8, item.length - 7)] = tempData[item]
            }
          }
          // let postData = JSON.stringify()
          console.log(postData)
          const { code } = await setHomePage({
            homePageInfo: JSON.stringify(postData)
          })
          if ((code === 10000) | (code === '10000')) {
            this.$Message.success('新增成功!')
            setTimeout(() => {
              this.$router.push({ name: 'Publish' })
            }, 2000)
          } else {
            this.$Message.error('新增失败!')
          }
        } else {
        }
      })
    },

    cancel() {
      this.$router.push({ name: 'Publish' })
    },

    changeMaterialType() {
      if (this.$refs['pictureForm']) {
        this.$refs['pictureForm'].resetFields()
      }

      if (this.$refs['shoppingForm']) {
        this.$refs['shoppingForm'].resetFields()
      }

      if (this.$refs['exhibitionForm']) {
        this.$refs['exhibitionForm'].resetFields()
      }
    }
  }
}
</script>

<style lang="less">
.ey-button {
  display: inline-block;
  margin-bottom: 30px;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  white-space: nowrap;
  line-height: 1.5;
  user-select: none;
  padding: 15px 45px;
  font-size: 14px;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #ccc;
  outline: none;
  &:not(:last-child) {
    margin-right: 30px;
  }
  &.active {
    background-color: #2d8cf0;
    border-color: #2d8cf0;
    color: #fff;
  }
}
.title {
  background-color: #eee;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 700;
}

.action {
  margin-left: 100px;
}
</style>
