<template>
    <!-- 新增页start -->
    <div class="form">
        <Breadcrumb separator=">" class="breadCrumb">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>基础数据</BreadcrumbItem>
            <BreadcrumbItem>艺术家库</BreadcrumbItem>
            <BreadcrumbItem>新增艺术家</BreadcrumbItem>
        </Breadcrumb>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" :inline="true">
            <FormItem label="艺术家姓名" prop="name" class="formItem45">
                <Input v-model="formValidate.name" placeholder="输入艺术家姓名。如：列奥纳多· 达·芬奇" clearable :maxlength="30" />
            </FormItem>
            <FormItem label="姓名简称" prop="abbreviation" class="formItem45">
                <Input v-model="formValidate.abbreviation" placeholder="如：达芬奇" clearable :maxlength="10" />
            </FormItem>
            <FormItem label="出生日期" prop="birthDate" class="formItem45">
                <Input v-model="formValidate.birthDate" placeholder="如：1900-03-28，未知日期请输入问号" clearable :maxlength="15" />
            </FormItem>
            <FormItem label="去世日期" class="formItem45">
                <Input v-model="formValidate.deathDate" placeholder="如：1970-01-01，未知日期请输入问号" clearable :maxlength="15" />
            </FormItem>
            <FormItem label="国籍" prop="nationality" class="formItem45">
                <Input v-model="formValidate.nationality" placeholder="输入艺术家国籍" clearable :maxlength="10" />
            </FormItem>
            <FormItem label="认证信息" class="formItem45">
                <Input v-model="formValidate.identityInfo" placeholder="输入认证信息，无认证信息请留空" clearable :maxlength="15" />
            </FormItem>
            <FormItem label="性格坐标" class="formItem45">
                <Input  @on-enter="generateCharacterTags" placeholder="输入性格坐标，按回车键添加标签"/>
                <div style="" v-if="charactertags.length>0">
                  <Tag v-for="(tag,index) in charactertags" type="border" closable @on-close="deleteCharacterTag(index)" :key="tag">{{tag}}</Tag>
                </div>
            </FormItem>
            <FormItem label="人物标签"  class="formItem45" style="display:block;">
                <Input  @on-enter="generatefigureTags" placeholder="输入人物标签，按回车键添加标签"/>
                <div style="" v-if="figureTags.length>0">
                  <Tag v-for="(tag,index) in figureTags" type="border" closable @on-close="deletefigureTag(index)" :key="tag">{{tag}}</Tag>
                </div>
            </FormItem>
            <FormItem label="中西" prop="region">
                <RadioGroup v-model="formValidate.region">
                    <Radio label="中国" >中国</Radio>
                    <Radio label="西方" >西方</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="艺术家头像" prop="imageUrl" class="formItem100">
                <EyUpload @upload-ok="getImgUrl" @upload-error="uploadError" @upload-exceeded-size="uploadExceededSize"  accept="image/jpeg,image/jpg,image/png"  imgSizeText="图片规格：高100px,宽100px" />
                <p v-show="isUploadOk">
                    <span class="headImg">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                        <img :src="formValidate.imageUrl" class="img">
                    </span>
                </p>
            </FormItem>
            <FormItem label="艺术家星座" class="formItem45" >
                <Select v-model="formValidate.constellation">
                    <Option v-for="item in constellationList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="音频链接" class="formItem100">
                <Input v-model="formValidate.voiceUrl" placeholder="输入音频链接地址" clearable :maxlength="200" style="width:60%;"/>点击
                 <router-link :to="{ path: '/Video'}"  target="_blank">上传音频,</router-link>获取链接
            </FormItem>
            <FormItem label="视频链接" class="formItem100">
                <Input v-model="formValidate.videoUrl" placeholder="输入视频链接地址" clearable :maxlength="200" style="width:60%;"/>点击
                 <router-link :to="{ path: '/Video'}"  target="_blank">上传视频,</router-link>获取链接
            </FormItem>
            <FormItem label="艺术家介绍" prop="artDescription" class="formItem100">
                <EyQuill @content-change="contentChange" :editContent="formValidate.artDescription"/>
            </FormItem>
            <FormItem class="formItem100 btn">
                <Button type="primary" @click="save('formValidate')">保存</Button>
                <Button type="ghost" @click="goBack('0')" style="margin-left: 8px">取消并返回</Button>
            </FormItem>
        </Form>
    </div>
    <!-- 新增页end -->
</template>

<script>
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Row,
  Col,
  Icon,
  RadioGroup,
  Radio,
  Tag,
  Select
} from 'iview'
import EyQuill from '../Common/EyQuill/EyQuill'
import EyUpload from '../Common/EyUpload/EyUpload'
import { setArtist } from './Base.service.js'

export default {
  name: 'AddArt',
  components: {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Form,
    FormItem,
    Input,
    Option,
    Row,
    Col,
    Icon,
    EyQuill,
    EyUpload,
    RadioGroup,
    Radio,
    Tag,
    Select
  },
  data() {
    return {
      isUploadOk: false,
      editFormValidate: [],
      charactertags: [],
      figureTags: [],
      regionFilter: '',
      formValidate: {
        name: '',
        abbreviation: '',
        characterTag: '',
        figureTag: '',
        region: '',
        id: '',
        birthDate: '',
        deathDate: '',
        nationality: '',
        identityInfo: '',
        imageUrl: '',
        constellation: '',
        videoUrl: '',
        voiceUrl: '',
        artDescription: '',
        customerId: ''
      },
      constellationList: [
        {
          value: '白羊座',
          label: '白羊座'
        },
        {
          value: '金牛座',
          label: '金牛座'
        },
        {
          value: '双子座',
          label: '双子座'
        },
        {
          value: '巨蟹座',
          label: '巨蟹座'
        },
        {
          value: '狮子座',
          label: '狮子座'
        },
        {
          value: '处女座',
          label: '处女座'
        },
        {
          value: '天秤座',
          label: '天秤座'
        },
        {
          value: '天蝎座',
          label: '天蝎座'
        },
        {
          value: '射手座',
          label: '射手座'
        },
        {
          value: '摩羯座',
          label: '摩羯座'
        },
        {
          value: '水瓶座',
          label: '水瓶座'
        },
        {
          value: '双鱼座',
          label: '双鱼座'
        }
      ],
      ruleValidate: {
        name: [
          { required: true, message: '艺术家姓名不能为空', trigger: 'blur' }
        ],
        abbreviation: [
          { required: true, message: '艺术家姓名简称不能为空', trigger: 'blur' }
        ],
        region: [{ required: true, message: '请选择', trigger: 'change' }],
        birthDate: [
          { required: true, message: '艺术家出生日期不能为空', trigger: 'blur' }
        ],
        nationality: [
          { required: true, message: '艺术家国籍不能为空', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '艺术家头像不能为空', trigger: 'blur' }
        ],
        artDescription: [
          { required: true, message: '艺术家介绍不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 判断是新增or编辑页面（有参数为编辑，否则为新增）
    if (
      this.$route.params.data !== undefined &&
      this.$route.params.data.artistDto
    ) {
      const data = this.$route.params.data.artistDto
      if (data) {
        for (let item in data) {
          if (
            data.hasOwnProperty(item) &&
            this.formValidate.hasOwnProperty(item)
          ) {
            //筛选过滤赋值formValidate
            this.formValidate[item] = data[item]
          }
        }
        if (data.imageUrl) {
          this.isUploadOk = true
        }
        if (data.characterTag) {
          this.charactertags = data.characterTag.split(',')
        }
        if (data.figureTag) {
          this.figureTags = data.figureTag.split(',')
        }
        if (data.customerId) {
          this.formValidate.customerId = data.customerId
        }
        if (data.region === 1) {
          this.formValidate.region = '中国'
        } else if (data.region === 2) {
          this.formValidate.region = '西方'
        }
      }
    }
  },
  mounted() {},
  methods: {
    generateCharacterTags(e) {
      if (this.charactertags.indexOf(e.target.value) > -1) {
        return
      }
      if (e.target.value.trim().length > 0) {
        this.charactertags.push(e.target.value)
      }

      console.log(this.charactertags.toString())
      e.target.value = ''
    },
    deleteCharacterTag(index) {
      this.charactertags.splice(index, 1)
      console.log(this.charactertags.toString())
    },
    generatefigureTags(e) {
      if (this.figureTags.indexOf(e.target.value) > -1) {
        return
      }
      if (e.target.value.trim().length > 0) {
        this.figureTags.push(e.target.value)
      }

      console.log(this.figureTags.toString())
      e.target.value = ''
    },
    deletefigureTag(index) {
      this.figureTags.splice(index, 1)
      console.log(this.figureTags.toString())
    },
    contentChange({ content }) {
      // 接收子组件的content赋值
      this.formValidate.artDescription = content
    },
    getImgUrl(file) {
      this.isUploadOk = true
      this.formValidate.imageUrl = file.url
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
      this.formValidate.imageUrl = ''
    },
    uploadOk() {
      this.isUploadOk = true
    },
    goBack(tab) {
      this.$router.push({ name: 'Base', params: { tab } })
    },
    save(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formValidate.characterTag = this.charactertags.toString()
          this.formValidate.figureTag = this.figureTags.toString()
          this.formValidate.region = this.formValidate.region === '中国' ? 1 : 2
          const { code, msg } = await setArtist({
            artistInfo: JSON.stringify(this.formValidate)
          })
          if (code === 10000 || code === '10000') {
            // this.handleReset('formValidate');
            this.$Message.success(msg)
            setTimeout(() => {
              this.goBack('0')
            }, 1500)
          } else {
            this.$Message.error(msg)
          }
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style lang="less">
@import '../../libs/css/constant.less';
@import '../../libs/css/common.less';
.form {
  .formItem45 {
    width: 45%;
  }
  .formItem100 {
    width: 100%;
    .headImg {
      position: relative;
      margin-top: 20px;
      display: inline-block;
      .closeIcon {
        position: absolute;
        right: -18px;
        top: -10px;
      }
      .img {
        width: 100px;
        height: 100px;
      }
    }
  }
  .btn {
    margin-top: 100px;
  }
}
</style>
