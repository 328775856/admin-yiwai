<template>
  <div id="page">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>页面发布</BreadcrumbItem>
      <BreadcrumbItem>小程序首页</BreadcrumbItem>
    </Breadcrumb>
    <Tabs type="card" @click="getName" class="tab">
      <!-- tab-1 开始 -->
      <TabPane :label="labelList[0]">
        <div class="table">
          <Button type="primary" icon="plus" @click="add('AddRecommed')">新增推荐</Button>
          <span style="color:red;">首页排序规则：先按推荐时间，在按序号从小到大</span>
          <div class="sort-wrap">
              <Form :label-width="80" inline>
                <Form-item prop="newpublicId" label="名称:">
                 <Input v-model="name" :maxlength="15" placeholder="输入名称"></Input>
                </Form-item>
                <Form-item label="类型:">
                  <Select v-model="itemType"  placeholder="全部">
                   <Option v-for="option in options" v-bind:value="option.value" :key="option.id">
                  {{option.text}}
                </Option>
                </Select>
                </Form-item>
              </Form>
              <Button type="primary" style="margin-left:40px;"  @click="getHomePageList" >筛选</Button>
              <Button type="default" style="margin-left:40px;" @click="reset">清空筛选条件</Button>
          </div>
          <Table :columns="publishColumns" :loading="tablePublicLoading" :data="publicList"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page class="paging tr mt10" :current.sync="currentPage" :total="totalItems" show-total show-elevator placement="top" @on-change="onChangeTab"></Page>
            </div>
          </div>
        </div>
      </TabPane>

      <TabPane :label="labelList[1]">
        <div class="table">
          <Row type="flex" justify="space-between" align="middle">
            <Col span="4"><h1>Banner</h1></Col>
            <Col span="3" style="text-align:right"><Button type="primary" icon="plus" class="add" @click="showModal">添加</Button></Col>
          </Row>
          <Table :columns="bannerColumns" :loading="tableBannerLoading" :data="bannerList" border></Table>
        </div>
      </TabPane>
    </Tabs>

    <Modal
        v-model="bannerModal"
        :loading="loading"
        >
        <p slot="header" style="text-align:center;"><span>添加banner</span></p>
        <p slot="close"><Icon type="ios-close-empty"></Icon></p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <Form-item label="banner图片:" prop="image">
                <EyUpload @upload-ok="getLitImgUrl" @upload-error="uploadError"  @upload-exceeded-size="uploadExceededSize" imgSizeText="图片规格：高400px,宽325px，不超过200K" :maxSize="200"  accept="image/gif,image/jpeg,image/jpg,image/png"/>
                <p v-show="isLitUploadOk">
                    <div class="imgWrp mt20" v-show="formValidate.image">
                      <img :src="formValidate.image+'?imageView2/1/w/135/h/165/q/50'"  class="img headImg">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                    </div>
                </p>
                <!-- <div style="color:#ed3f14;padding-top:6px; line-height:1;position:absolute;top:100%;left:0;" v-show="!formValidate.image">图片不能为空</div> -->
          </Form-item>
        <Form-item label="链接地址:" prop="linkUrl">
            <Input v-model.trim="formValidate.linkUrl"  placeholder="输入banner链接地址"></Input>
        </Form-item>

        <Form-item label="排序值:" prop="sortNo">
            <Select v-model="formValidate.sortNo" v-bind:placeholder="sortPlaceholder">
                <Option v-for="(option,index) in optionsSort" v-bind:value="option.value" :key="index">
                  {{option.text}}
                </Option>
            </Select>
        </Form-item>
          <Form-item label="备注:" prop="remark">
            <Input v-model="formValidate.remark" :maxlength="30" placeholder="输入备注"></Input>
        </Form-item>
        </Form>

        <div  slot="footer">
          <Button type="text" @click="()=>this.bannerModal=false">取消</Button>
          <Button type="primary" @click="validateForm">确定</Button>
        </div>
    </Modal>
    <!-- tab-1 结束 -->
  </div>
</template>

<script>
import util from 'libs/js/util.js'
import EyUpload from '../Common/EyUpload/EyUpload'
import {
  getHomePageList,
  setHomePage,
  deleteHomePage,
  getBannerList,
  setBanner,
  deleteBanner
} from './Publish.service'
import {
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabPane,
  Button,
  Input,
  Form,
  Row,
  Col,
  Modal,
  Option,
  FormItem,
  Select,
  Icon,
  Table,
  Page,
  Poptip,
  InputNumber
} from 'iview'

export default {
  name: 'Publish',
  components: {
    Breadcrumb,
    BreadcrumbItem,
    Tabs,
    TabPane,
    Button,
    EyUpload,
    Modal,
    Input,
    Icon,
    Select,
    Form,
    Row,
    Col,
    FormItem,
    Table,
    Option,
    Page,
    Poptip,
    InputNumber
  },
  data() {
    let _this = this
    return {
      visible: false,
      labelList: ['小程序首页', '首页banner'],
      sortPlaceholder: '请选择排序值',
      publicList: [],
      bannerList: [],
      bannerModal: false,
      tableBannerLoading: true,
      isLitUploadOk: false,
      tablePublicLoading: true,
      pageNo: 1,
      pageSize: 10,
      newCustomerId: '',
      newCustomerNo: '',
      currentPage: 1,
      totalItems: 0,
      itemType: '',
      name: '',
      options: [
        { text: '品画', value: '1' },
        { text: '展览', value: '2' },
        { text: '商品', value: '3' }
      ],
      optionsSort: [
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },
        { text: '4', value: '4' },
        { text: '5', value: '5' }
      ],

      formValidate: {
        id: 0,
        image: '',
        linkUrl: '',
        sortNo: '',
        remark: ''
      },
      ruleValidate: {
        image: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
        linkUrl: [
          {
            required: false,
            message: 'banner链接地址不能为空',
            trigger: 'blur'
          }
        ],
        sortNo: [
          { required: true, message: '排序不能为空', trigger: 'change' }
        ],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
      },
      bannerModal: false,
      loading: true,
      tableBannerLoading: true,
      bannerColumns: [
        {
          title: '链接地址',
          align: 'center',
          render(h, params) {
            const { linkUrl } = params.row
            return <p class="ellipsisLn">{linkUrl}</p>
          }
        },
        {
          title: '图片',
          align: 'center',
          key: 'image',
          render(h, params) {
            const imageUrl = params.row.image
            return (
              <div
                class="headImg"
                style={`background:url(${imageUrl}) no-repeat center;background-size: contain;`}
              />
            )
          }
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center'
        },
        {
          title: '排序',
          width: 100,
          key: 'sortNo',
          align: 'center'
        },
        {
          title: '发布时间',
          key: 'gmtCreate',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render(h, params) {
            const data = params.row
            return (
              <div>
                <span onClick={() => _this.editBanner(data)} class="edit">
                  编辑
                </span>
                <span
                  class="edit"
                  onClick={() => _this.deleteBannerModal(data.id)}
                >
                  删除
                </span>
              </div>
            )
          }
        }
      ],
      publishColumns: [
        {
          title: '编号',
          key: 'itemId',
          align: 'center'
        },
        {
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '图片',
          key: '',
          align: 'center',
          render(h, params) {
            let { imageUrl } = params.row
            return (
              <div class="">
                <span
                  class="headImg"
                  style={`background:url(${imageUrl}?imageView2/1/w/175/h/100/q/50) no-repeat center;background-size: contain;`}
                />
              </div>
            )
          }
        },
        {
          title: '类型',
          align: 'center',
          width: 100,
          render(h, params) {
            let { itemType } = params.row
            let linkPro
            if (itemType == 1) {
              linkPro = '品画'
            } else if (itemType == 2) {
              linkPro = '展览'
            } else if (itemType == 3) {
              linkPro = '商品'
            }
            return <p>{linkPro}</p>
          }
        },
        {
          title: '推荐时间',
          key: 'publishTime',
          align: 'center',
          sortable: true
        },
        {
          title: '序号',
          key: 'sortNum',
          align: 'center',
          render(h, params) {
            let { id, sortNum } = params.row
            let oldValue = parseInt(sortNum)
            return (
              <Poptip placement="right">
                <a>
                  {sortNum} <Icon type="ios-compose-outline" />
                </a>
                <div slot="content">
                  <input
                    class="input"
                    min="1"
                    type="number"
                    value={sortNum}
                    onInput={e => {
                      sortNum = parseInt(e.target.value)
                    }}
                  />
                  <span
                    class="input-save"
                    onClick={e => {
                      let postData = params.row

                      delete postData.gmtModified

                      postData.sortNum = sortNum
                      _this.setsortNum(postData)
                    }}
                  >
                    保存
                  </span>／
                  <span
                    class="input-cancel"
                    onClick={e => {
                      _this.getHomePageList()
                    }}
                  >
                    取消
                  </span>
                </div>
              </Poptip>
              // <div>
              //   <input
              //     class="input"
              //     min="1"
              //     type="number"
              //     value={sortNum}
              //     onInput={e => {
              //       sortNum = parseInt(e.target.value)
              //     }}
              //     onKeydown={e => {
              //       if (e.keyCode == '13' && oldValue != sortNum) {
              //         console.log(params.row)
              //         let postData = params.row

              //         postData.sortNum = sortNum
              //         _this.setsortNum(postData)
              //       }
              //     }}
              //   />
              // </div>
            )
          }
        },
        {
          title: '点击数',
          key: 'clickNum',
          align: 'center',
          sortable: true
        },
        {
          title: '创建时间',
          key: 'gmtCreate',
          align: 'center',
          sortable: true
        },
        {
          title: '操作',
          align: 'center',
          render(h, params) {
            let copyData, id, data
            id = parseInt(params.row.id)
            data = params.row
            return (
              <div>
                <a
                  href="javascript:void(0)"
                  class="edit"
                  onClick={() =>
                    _this.$router.push({
                      name: 'AddRecommed',
                      params: { data: data }
                    })
                  }
                >
                  修改
                </a>
                <span class="edit" onClick={() => _this.deleteOK(id)}>
                  删除
                </span>
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {},
  created() {
    this.getHomePageList()
    this.getBannerList()
  },
  mounted() {},
  methods: {
    getName(name) {
      this.index = name
    },

    showModal() {
      this.formValidate = {
        id: 0,
        image: '',
        linkUrl: '',
        sortNo: '',
        remark: ''
      }
      this.$refs['formValidate'].resetFields()
      this.bannerModal = true
    },

    getImageUrl(file) {
      this.isArtImgUploadOk = true
      this.formValidate.image = file.url
    },
    getLitImgUrl(file) {
      this.isLitUploadOk = true
      this.formValidate.image = file.url
    },
    uploadExceededSize() {
      this.$Message.error('文件超出大小限制!')
    },
    uploadError(error) {
      this.isUploadOk = false
    },
    resetImg() {
      this.isUploadOk = false
      this.formValidate.image = ''
    },
    uploadOk() {
      this.isUploadOk = true
    },

    reset() {
      this.name = ''
      this.itemType = ''
    },

    add(name) {
      this.$router.push({ name })
    },

    close() {
      this.visible = false
    },

    async setsortNum(obj) {
      const { code, msg } = await setHomePage({
        homePageInfo: JSON.stringify(obj)
      })
      if (code === 10000) {
        this.$Message.success('更新排序成功')
        this.getHomePageList()
      } else {
        this.$Message.error(msg)
      }
    },

    onChangeTab(pageNo) {
      this.pageNo = pageNo
      this.getHomePageList()
    },

    deleteOK(id) {
      let _this = this
      this.$Modal.confirm({
        title: '系统提示',
        content: '确定删除？',
        onOk: function() {
          _this.deleteHomePage(id)
        }
      })
    },

    deleteBannerModal(bannerId) {
      let _this = this
      this.$Modal.confirm({
        title: '系统提示',
        content: '确定删除？',
        onOk: function() {
          _this.deleteBanner(bannerId)
        }
      })
    },

    //获取展览列表
    async getHomePageList() {
      const { code, msg, data } = await getHomePageList({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sortField: 'gmtCreate',
        sort: 'DESC',
        searchInfo: JSON.stringify({
          itemType: this.itemType,
          name: this.name
        })
      })
      if (code == 10000) {
        this.publicList = data.data
        console.log(data)
        this.totalItems = data.totalItems
        this.tablePublicLoading = false
      } else {
        this.$Message.error(msg)
        this.tablePublicLoading = false
      }
    },

    // 删除首页推荐
    async deleteHomePage(id) {
      const { code, msg } = await deleteHomePage({
        id: id
      })
      if (code === 10000 || code === '10000') {
        this.getHomePageList()
        this.$Message.success(msg)
      } else {
        this.$Message.error(msg)
      }
    },

    validateForm() {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          if (this.formValidate.id == 0) {
            if (this.bannerList.length < 5) {
              this.setBanner()
            } else {
              this.$Message.warning('最多只能添加5项')
            }
          } else {
            this.setBanner()
          }
        } else {
          this.loading = false
        }
      })
    },

    editBanner(item) {
      this.$refs['formValidate'].resetFields()
      this.isLitUploadOk = true
      this.sortPlaceholder = item.sortNo.toString()
      this.formValidate = {
        id: item.id,
        image: item.image,
        linkUrl: item.linkUrl !== undefined ? item.linkUrl : '',
        sortNo: item.sortNo.toString(),
        remark: item.remark
      }
      this.bannerModal = true
    },

    //获取banner列表
    async getBannerList() {
      const { code, msg, data } = await getBannerList({})
      if (+code == 10000) {
        this.bannerList = data.bannerList
        this.tableBannerLoading = false
      } else {
        this.$Message.error(msg)
        this.tableBannerLoading = false
      }
    },

    async deleteBanner(bannerId) {
      const { code, msg } = await deleteBanner({
        bannerId: bannerId
      })
      if (code === 10000 || code === '10000') {
        this.getBannerList()
      } else {
        this.$Message.error(msg)
      }
    },

    //  设置banner
    async setBanner() {
      const { code, msg } = await setBanner({
        bannerInfo: JSON.stringify(this.formValidate)
      })
      if (code === 10000) {
        this.getBannerList()
        this.bannerModal = false
        this.$Message.success(msg)
      } else {
        this.$Message.error(msg)
      }
    }
  }
}
</script>

<style lang="less">
@import '../../libs/css/constant.less';
@import '../../libs/css/common.less';

#page {
  .tab {
    .table {
      padding: 50px;
      border-bottom: 1px dotted #ccc;
      // p {
      // 	padding-bottom: 20px;
      // }
    }
  }
  .ellipsisLn {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .input {
    display: inline-block;
    width: 60px;
    height: 32px;
    line-height: 1.5;
    text-align: center;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #57a3f3;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
    &:focus {
      border-color: #57a3f3;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    }
    &.normal {
      border-color: #dddee1;
      text-align: left;
      &:focus {
        border-color: #57a3f3;
        outline: 0;
        box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
      }
    }
  }
  .headImg {
    height: 60px;
    width: 60px;
    display: inline-block;
  }
  .flex {
    display: flex;
    .flex-item {
      flex: 1;
      p {
        padding-top: 10px;
      }
    }
  }
}
.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-save {
  color: #57a3f3;
  display: inline-block;
  margin-left: 5px;
}
.input-cancel {
  display: inline-block;
}

.imgWrp {
  .closeIcon {
    cursor: pointer;
    position: absolute;
    top: -8px;
    right: -8px;
    background: #fff;
  }
  border: 1px solid @GRAY-50;
  height: 200px;
  width: 200px;
  position: relative;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
  }
}

//v3

.sort-wrap {
  padding: 30px 10px;
  background-color: #eee;
  border-radius: 10p;
  margin: 20px 0;
}
</style>
