<template>
  <div id="page">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>页面发布</BreadcrumbItem>
      <BreadcrumbItem>小程序首页</BreadcrumbItem>
    </Breadcrumb>
    <Tabs type="card" @on-click="getName" class="tab">
      <!-- tab-1 开始 -->
      <TabPane :label="labelList[0]">
        <div class="table">
          <Button type="primary" icon="plus" @click="add('AddRecommed')">新增推荐</Button>
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
          <Table  :columns="publishColumns" :loading="tablePublicLoading" :data="publicList" border></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page class="paging tr mt10" :current.sync="currentPage" :total="totalItems" show-total show-elevator :page-size-opts="[10,20,30]" placement="top" @on-change="onChangeTab"></Page>
            </div>
          </div>
        </div>
      </TabPane>
    </Tabs>
    <!-- tab-1 结束 -->
  </div>
</template>

<script>
import util from 'libs/js/util.js'
import EyUpload from '../Common/EyUpload/EyUpload'
import { getHomePageList, setHomePage, deleteHomePage } from './Publish.service'
import {
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabPane,
  Button,
  Input,
  Row,
  Col,
  Modal,
  Form,
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
    Input,
    Row,
    Col,
    Icon,
    Select,
    Form,
    FormItem,
    Table,
    Option,
    EyUpload,
    Page,
    Poptip,
    InputNumber
  },
  data() {
    let _this = this
    return {
      visible: false,
      labelList: ['小程序首页'],
      sortPlaceholder: '请选择排序值',
      publicList: [],
      isLitUploadOk: false,
      tablePublicLoading: false,
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
      publishColumns: [
        {
          title: '编号',
          key: 'itemId',
          align: 'center'
        },
        {
          title: '名称/图片',
          key: 'productDto',
          align: 'center',
          render(h, params) {
            let { name, imageUrl } = params.row
            return (
              <div>
                <span
                  class="headImg"
                  style={`background:url(${imageUrl}?imageView2/1/w/175/h/100/q/50) no-repeat center;background-size: contain;`}
                />
                <span class="edit">{name}</span>
              </div>
            )
          }
        },
        {
          title: '类型',
          align: 'center',
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
          key: 'sortNo',
          align: 'center',
          render(h, params) {
            let { id, sortNum } = params.row
            let oldValue = parseInt(sortNum)
            return (
              // <Poptip placement="right" v-model="visible">
              //   <a>
              //     {sortNum} <Icon type="ios-compose-outline" />
              //   </a>
              //   <div class="" slot="content">
              //     <input
              //       class="input"
              //       min="1"
              //       type="number"
              //       value={sortNum}
              //       onInput={e => {
              //         sortNum = parseInt(e.target.value)
              //       }}
              //     />
              //     <span
              //       class="input-save"
              //       onClick={e => {
              //         console.log(params.row)
              //         let postData = params.row
              //         delete postData._index
              //         delete postData.gmtModified
              //         delete postData._rowKey
              //         postData.sortNum = sortNum
              //         _this.setsortNum(postData)
              //       }}
              //     >
              //       保存
              //     </span>／
              //     <span
              //       class="input-cancel"
              //       onClick={e => {
              //         _this.visible = false
              //       }}
              //     >
              //       取消
              //     </span>
              //   </div>
              // </Poptip>
              <div>
                <input
                  class="input"
                  min="1"
                  type="number"
                  value={sortNum}
                  onInput={e => {
                    sortNum = parseInt(e.target.value)
                  }}
                  onKeydown={e => {
                    if (e.keyCode == '13' && oldValue != sortNum) {
                      console.log(params.row)
                      let postData = params.row
                      delete postData._index
                      delete postData._rowKey
                      postData.sortNum = sortNum
                      _this.setsortNum(postData)
                    }
                  }}
                />
              </div>
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
          key: 'action',
          align: 'center',
          render(h, params) {
            let copyData, id, data
            id = parseInt(params.row.id)
            data = params.row
            delete data._index
            delete data._rowKey
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
  computed: {
    publicBtnIsActive: function() {
      if (this.newpublicId && this.publicSortNo) {
        return true
      } else {
        return false
      }
    },
    exhibitionBtnIsActive: function() {
      if (this.newexhibitionId && this.exhibitionSortNo) {
        return true
      } else {
        return false
      }
    },
    expertBtnIsActive: function() {
      if (this.newCustomerId && this.newCustomerNo) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.getHomePageList()
  },
  methods: {
    getName(name) {
      this.index = name
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

    //获取展览列表
    async getHomePageList() {
      const { code, msg, data } = await getHomePageList({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sortField: 'sortNum',
        sort: 'ASC',
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
    }

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

.input-save {
  color: #57a3f3;
  display: inline-block;
  margin-left: 5px;
}
.input-cancel {
  display: inline-block;
}

//v3

.sort-wrap {
  padding: 30px 10px;
  background-color: #eee;
  border-radius: 10p;
  margin: 20px 0;
}
</style>
