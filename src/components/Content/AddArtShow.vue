<template>
    <div class="addArtShow">
        <Breadcrumb separator=">" class="breadCrumb">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>基础数据</BreadcrumbItem>
            <BreadcrumbItem>艺术品库</BreadcrumbItem>
            <BreadcrumbItem>新增展览</BreadcrumbItem>
        </Breadcrumb>
        <!-- <DatePicker  format="yyyy-MM-dd" type="daterange" placement="bottom-start" placeholder="Select date" style="width: 230px" ref="data"></DatePicker> -->
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
            <FormItem label="展览名称" prop="exhibitionName" class="formItem45">
                <Input v-model="formValidate.exhibitionName" placeholder="输入展览名称，50个汉字以内" clearable :maxlength="50" />
            </FormItem>
            <FormItem label="展览图片" prop="image" class="formItem45">
                <EyUpload @upload-ok="getImageUrl" @upload-error="uploadError" @upload-exceeded-size="uploadExceededSize" imgSizeText="图片规格：高270px、宽360px"  accept="image/jpeg,image/jpg,image/png"/>
                <p v-show="isUploadOk">
                    <span class="headImg">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                        <img :src="formValidate.image+'?imageView2/1/w/135/h/165/q/50'" class="img">
                    </span>
                </p>
            </FormItem>
            <FormItem label="展期" prop="date" class="formItem45">
                <DatePicker :value="formValidate.date" format="yyyy/MM/dd" type="daterange" placeholder="选择展期" style="width: 230px" ref="data" @on-clear="onClear" @on-change="onChange"></DatePicker>
            </FormItem>
            <FormItem label="展览地点" prop="place" class="formItem45">
                <Input v-model="formValidate.place" placeholder="输入展览地点" clearable  />
            </FormItem>
            <FormItem label="策展人" prop="curator" class="formItem45">
                <Input v-model="formValidate.curator" placeholder="输入策展人" clearable :maxlength="30" />
            </FormItem>
            <FormItem label="价格" prop="price" class="formItem45">
                <Input v-model="formValidate.price" placeholder="输入价格" clearable  />
            </FormItem>
            <FormItem label="原价" prop="primeCost" class="formItem45">
                <Input v-model="formValidate.primeCost" placeholder="输入价格" clearable  />
            </FormItem>
            <FormItem label="展览介绍" prop="description" class="formItem100">
                    <EyEditor id="editor1" ref="editor1" :content="exhibitionContent" :insertButton="['img','video']" :toolbars=" [[
                      'fullscreen',
                      'undo', 'redo', '|',
                      'paragraph', 'fontsize', '|',
                      'indent', '|',
                      'bold', 'italic', 'underline', '|',
                      'forecolor', 'backcolor', '|',
                      'justifyleft', 'justifycenter', 'justifyright', '|',
                      '|', 'removeformat'
                    ]]"></EyEditor>
              </FormItem>
          <div v-show="show">
            <div v-show="exhibitionTicketsShow">
              <FormItem label="展券介绍" class="formItem100">
              </FormItem>
              <FormItem label="展期" prop="exhibitionTicketsInfoDate" class="formItem45">
                <DatePicker :value="formValidate.exhibitionTicketsInfoDate" format="yyyy/MM/dd" type="daterange" placeholder="选择展期" style="width: 230px" ref="data2" @on-clear="onClear" @on-change="_onChange"></DatePicker>
              </FormItem>
              <FormItem label="展券折扣" prop="discount" class="formItem45">
                <Input v-model="formValidate.discount" placeholder="输入展券折扣" clearable  />
              </FormItem>
            </div>
            <Button style="margin-left: 150px " class="addTicket" type="primary" v-show="!exhibitionTicketsShow" @click="addNew">新增展券</Button>
            <Button style="margin-left: 150px " class="addTicket" type="warning" v-show="formValidate.discount && exhibitionTicketsShow && deleteShow" @click="exhibitionTicketsDelete">删除展券</Button>
          </div>
            <FormItem class="formItem100 btn">
                <Button type="primary" @click="save('formValidate')">保存</Button>
                <Button type="ghost" @click="goBack" style="margin-left: 8px">取消并返回</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  DatePicker,
  Icon
} from 'iview'
import EyUpload from '../Common/EyUpload/EyUpload'
import util from 'libs/js/util.js'
import {
  setExhibition,
  getExhibitionTickets,
  setExhibitionTicket,
  deleteExhibitionTickets
} from './Content.service'

export default {
  name: 'AddArtShow',
  components: {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Form,
    FormItem,
    Input,
    Select,
    Option,
    DatePicker,
    Icon,
    EyUpload,
    EyEditor: () =>
      import(/* webpackChunkName: "EyEditor" */ '@/components/Common/EyEditor/EyEditor')
  },
  data() {
    return {
      editorOption: {
        placeholder: '输入艺术品介绍，不超过10000个字符'
      },
      isUploadOk: false,
      articleList: [],
      authorList: [],
      exhibitionContent: '',
      formValidate: {
        id: 0,
        exhibitionName: '',
        description: '',
        date: [],
        exhibitionStartTime: '',
        exhibitionEndTime: '',
        curator: '',
        image: '',
        place: '',
        price: '',
        primeCost: '',
        discount: '',
        exhibitionTicketsInfo: {},
        exhibitionTicketsInfoDate: []
      },
      ruleValidate: {
        exhibitionName: [
          { required: true, message: '展览名称不能为空', trigger: 'blur' }
        ],
        date: [
          {
            type: 'array',
            required: true,
            message: '展期不能为空',
            trigger: 'change'
          }
        ],
        exhibitionTicketsInfoDate: [
          {
            type: 'array',
            required: true,
            message: '展期不能为空',
            trigger: 'change'
          }
        ],
        curator: [
          { required: true, message: '策展人不能为空', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '展览图片不能为空', trigger: 'blur' }
        ],
        place: [
          { required: true, message: '展览地址不能为空', trigger: 'blur' }
        ],
        price: [
          {
            type: 'string',
            required: true,
            message: '价格不能为空',
            trigger: 'blur'
          }
        ],
        discount: [
          {
            type: 'string',
            required: true,
            message: '折扣不能为空',
            trigger: 'blur'
          }
        ]
      },
      exhibitionTicketsShow: false,
      show: true,
      deleteShow: false
    }
  },
  created() {
    // 判断是新增or编辑页面（有参数为编辑，否则为新增）
    const data = this.$route.params.data
    if (data) {
      for (let item in data) {
        if (
          data.hasOwnProperty(item) &&
          this.formValidate.hasOwnProperty(item)
        ) {
          //筛选过滤赋值formValidate
          this.formValidate[item] = data[item].toString()
        }
      }

      if (data.description) {
        this.exhibitionContent = data.description
        console.log(data.description)
      }
      if (data.image) {
        this.isUploadOk = true
      }
      this.formValidate.date = [
        data.exhibitionStartTime,
        data.exhibitionEndTime
      ]
      this.formValidate.exhibitionStartTime = `${
        data.exhibitionStartTime
      } 00:00:00`
      this.formValidate.exhibitionEndTime = `${data.exhibitionEndTime} 00:00:00`

      if (data.id) {
        getExhibitionTickets({ exhibitionId: data.id }).then(res => {
          if (res.code === 10000) {
            this.exhibitionTicketsShow = true
            this.deleteShow = true
            this.formValidate.discount = res.data.discount.toString()
            this.formValidate.exhibitionTicketsInfo = res.data
            this.formValidate.exhibitionTicketsInfoDate = [
              res.data.ticketStartTime,
              res.data.ticketEndTime
            ]
          }
        })
      }
    } else {
      //this.exhibitionTicketsShow = flase
      //this.formValidate.discount = false
      this.show = false
    }
    // 获取展券数据
  },
  mounted() {},
  methods: {
    getImageUrl(file) {
      this.isUploadOk = true
      this.formValidate.image = file.url
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
      this.formValidate.image = ''
    },

    onClear() {
      this.formValidate.date = []
    },
    onChange() {
      this.formValidate.date = this.$refs.data.internalValue //时间控件选择时触发赋值给this.formValidate.date,消除表单验证
      this.formValidate.exhibitionStartTime = util.getNowFormatDate(
        this.$refs.data.internalValue[0]
      ) //开始时间
      this.formValidate.exhibitionEndTime = util.getNowFormatDate(
        this.$refs.data.internalValue[1]
      ) //截至时间
    },
    _onChange() {
      this.formValidate.exhibitionTicketsInfoDate = this.$refs.data2.internalValue //时间控件选择时触发赋值给this.formValidate.exhibitionTicketsInfoDate,消除表单验证
      this.formValidate.exhibitionTicketsInfoDate.exhibitionStartTime = util.getNowFormatDate(
        this.$refs.data2.internalValue[0]
      ) //开始时间
      this.formValidate.exhibitionTicketsInfoDate.exhibitionEndTime = util.getNowFormatDate(
        this.$refs.data2.internalValue[1]
      ) //截至时间
    },
    goBack() {
      this.$router.push({ name: 'Content', params: { tab: '2' } })
    },

    save(name) {
      if (this.exhibitionTicketsShow === true) {
        this.setExhibitionTicket()
      } else {
        this.ruleValidate.discount[0].required = false
        this.ruleValidate.exhibitionTicketsInfoDate[0].required = false
      }
      this.formValidate.description = this.$refs.editor1.getContent()
      this.formValidate.price = this.formValidate.price.toString()

      this.$refs[name].validate(async valid => {
        if (valid) {
          const data = this.formValidate
          console.log(data.date)
          //delete data.date //删除date属性json
          const { code, msg } = await setExhibition({
            exhibitionInfo: JSON.stringify(data)
          })
          if (code === 10000 || code === '10000') {
            this.$Message.success(msg)
            setTimeout(() => {
              this.$router.push({ name: 'Content', params: { tab: 2 } })
            }, 1000)
          } else {
            this.$Message.error(msg)
          }
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    },
    setExhibitionTicket() {
      // 插入展券数据
      const postData = {
        id: this.formValidate.exhibitionTicketsInfo.id,
        exhibitionId: this.$route.params.data.id,
        discount: this.formValidate.discount,
        ticketStartTime: this.formValidate.exhibitionTicketsInfoDate
          .exhibitionStartTime,
        ticketEndTime: this.formValidate.exhibitionTicketsInfoDate
          .exhibitionEndTime
      }
      setExhibitionTicket({
        exhibitionTicketsInfo: JSON.stringify(postData)
      }).then(res => {
        // alert(res.code)
        getExhibitionTickets({ exhibitionId: this.$route.params.data.id }).then(
          res => {
            if (res.code === 10000) {
              this.formValidate.exhibitionTicketsInfo = res.data
              this.formValidate.exhibitionTicketsInfoDate = [
                res.data.ticketStartTime,
                res.data.ticketEndTime
              ]
            }
          }
        )
      })
    },
    exhibitionTicketsDelete() {
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除吗？</p>`,
        onOk: async () => {
          const { code, msg } = await deleteExhibitionTickets({
            id: this.formValidate.exhibitionTicketsInfo.id
          })
          if (code === 10000 || code === '10000') {
            this.$Message.success(msg)
            this.$router.push({ name: 'Content', params: { tab: 2 } })
          } else if (code === 10001 || code === '10001') {
            this.$Message.error(msg)
          }
        }
      })
    },
    addNew() {
      this.exhibitionTicketsShow = true
    }
  }
}
</script>

<style lang="less">
@import '../../libs/css/constant.less';
@import '../../libs/css/common.less';
.addArtShow {
  .formItem45,
  .formItem100 {
    width: 45%;
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
        width: 135px;
        height: 165px;
      }
    }
  }
  .formItem100 {
    width: 100%;
  }
}
</style>
