<template>
  <div id="customerList">

    <fieldset class="fieldset">
      <legend>查询条件</legend>
      <div class="search">
        <div>
          <label for="">用户名称：</label>
          <Input v-model.trim="nickName" @on-enter="hanleSearch" placeholder="输入用户名称" style="width: 180px" />
        </div>
        <Button type="primary" icon="ios-search" @click="hanleSearch">查询</Button>
      </div>
    </fieldset>

    <Button v-if="isVirtual==1" type="primary" icon="plus" class="mt10" @click="goToSetCustomer">新增虚拟用户</Button>
    <Table class="mt10" border :loading="loading" :columns="columns" :data="data" @on-sort-change="onSortChange"></Table>
    <Page class="paging tr mt10" :current="pageNo" :total="totalItems" show-total show-elevator :page-size-opts="[10,20,30]" placement="top" @on-change="onChage" @on-page-size-change="onPageSizeChange"></Page>
    <SetCustomer :pIsShowModel="pIsShowModel" :pIsAdd="pIsAdd" :pIsLook="pIsLook" :pCustomerInfo="pCustomerInfo" @updatepCustomerInfo="()=>pCustomerInfo={}" @updatepIsShowModel="val=>pIsShowModel=val"></SetCustomer>
    <Modal
      title="设置认证"
      v-model="modal1">
      <div>
        认证类型：
        <RadioGroup v-model="customerType">
          <Radio label="艺术家"></Radio>
          <Radio label="机构"></Radio>
          <Radio label="个人"></Radio>
        </RadioGroup>
      </div>
      <div class="flex-row">
        <div v-show="customerType !== '个人'">选择{{customerType}}：</div>
        <EySelectsearch v-show="customerType == '机构'" ref="eySelectsearch" url="/getOrganStatisticsList/v1" name="name" resultList="data" :postData="{searchInfo: {  name: '' },pageNo: 0,pageSize: 10,sortField: '',sort: ''}" :kv="['id','name']" placeHolder="请选择" @getItem="getItem">
        </EySelectsearch>
        <EySelectsearch  v-show="customerType == '艺术家'" ref="eySelectsearch" url="/getArtistStatisticsList/v1" name="artistName" resultList="artistList" :postData="{searchInfo: { artistName: '' },pageNo: 0,pageSize: 10,sortField: '',sort: ''}" :kv="['artistId','artistDto.name']" placeHolder="请选择" @getItem="getItem">
        </EySelectsearch>
      </div>
      <div slot="footer">
        <Button type="primary" @click="ok">确定</Button>
        <Button type="text" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Table, Page, Button, Input, Modal, Radio, RadioGroup } from 'iview'
import SetCustomer from './SetCustomer.vue'
import EySelectsearch from '../Common/EySelectsearch.vue'

import {
  getCustomerList,
  getCustomerInfo,
  setCustomer,
  setVip,
  deleteCustomer,
  setCustomerType
} from './Customer.service'
export default {
  name: 'CustomerList',
  components: {
    Table,
    Page,
    Button,
    Input,
    SetCustomer,
    Modal,
    Radio,
    RadioGroup,
    EySelectsearch
  },
  props: {
    isVirtual: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pIsAdd: true,
      pIsLook: true,
      pCustomerInfo: {},
      nickName: '',
      searchInfo: '',
      pageNo: 1,
      pageSize: 10,
      sortField: '',
      sort: '',
      totalItems: 0,
      pIsShowModel: false,
      loading: true,
      modal1: false,
      customerType: '艺术家',
      customerTypeList: ['个人', '艺术家', '机构'],
      rowData: null,
      itemName: [],
      columns: [
        {
          title: '编号',
          key: 'customerId',
          align: 'center',
          width: 100
        },
        {
          title: '用户',
          key: '',
          align: 'center',
          render: (h, params) => {
            const { customerDto } = params.row
            return (
              <div class="headImgWrp">
                <div class="headImg">
                  <img src={customerDto.avatarUrl2} />
                </div>
                <p>{customerDto.nickName}</p>
              </div>
            )
          }
        },
        {
          title: '创建时间',
          key: 'gmtCreate',
          sortable: 'custom',
          align: 'center',
          render: (h, params) => {
            const { customerDto } = params.row
            return <div>{customerDto.gmtCreate}</div>
          }
        },
        {
          title: '信息',
          key: '',
          align: 'center',
          render: (h, params) => {
            const { customerDto } = params.row
            return (
              <div>
                <p>国家：{customerDto.country || '无'}</p>
                <p>省份：{customerDto.province || '无'}</p>
                <p>城市：{customerDto.city || '无'}</p>
                <p>
                  性别：{customerDto.gender == 1
                    ? '男'
                    : customerDto.gender == 2 ? '女' : '不详'}
                </p>
              </div>
            )
          }
        },
        {
          title: '浏览作品数',
          key: 'readNum',
          sortable: 'custom',
          align: 'center'
        },
        {
          title: '收获点赞数',
          key: 'harvestLikeNum',
          sortable: 'custom',
          align: 'center'
        },
        {
          title: '评论数',
          key: 'commentNum',
          sortable: 'custom',
          align: 'center',
          render: (h, params) => {
            const { customerDto, commentNum } = params.row
            return (
              <div>
                <p>{commentNum}</p>
                <p
                  class="edit"
                  onClick={() =>
                    this.$router.push({
                      path: '/Comment',
                      query: { customerId: customerDto.id }
                    })
                  }
                >
                  查看评论
                </p>
              </div>
            )
          }
        },
        {
          title: '收藏作品数',
          key: 'collectNum',
          sortable: 'custom',
          align: 'center'
        },
        {
          title: '认证类型',
          key: '',
          align: 'center',
          render: (h, params) => {
            const { customerDto, commentNum } = params.row

            return (
              <div>
                <p>{this.customerTypeList[customerDto.type - 1]}</p>
              </div>
            )
          }
        },
        {
          title: '操作',
          key: '',
          align: 'center',
          render: (h, params) => {
            const { row } = params
            const isOperate = () =>
              this.isVirtual == 1 && (
                <div>
                  <p>
                    <span class="edit" onClick={() => this.editCustomer(row)}>
                      编辑
                    </span>
                  </p>
                  <p>
                    <span class="edit" onClick={() => this.deleteCustomer(row)}>
                      删除
                    </span>
                  </p>
                </div>
              )
            return (
              <div class="operateWrp">
                <p>
                  <span class="edit" onClick={() => this.selectCustomer(row)}>
                    查看
                  </span>
                </p>
                <p>
                  <span class="edit" onClick={() => this._customerType(row)}>
                    设置认证
                  </span>
                </p>
                {isOperate()}
              </div>
            )
          }
        }
      ],

      data: []
    }
  },
  created() {
    const { params } = this.$route
    if (params.customerName) {
      this.nickName = params.customerName
    }
    this.getCustomerList()
  },
  mounted() {
    // 设置searchInfo
    this.getCustomerList()
  },
  watch:{
    customerType(val){
      this.artistId = undefined
    }
  },
  methods: {
    getCustomerList() {
      const postData = {
        searchInfo: JSON.stringify({
          isVirtual: this.isVirtual,
          nickName: this.nickName
        }),
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sort: this.sort
      }
      getCustomerList(postData).then(
        ({ code, data: { customerList, totalPages, totalItems } }) => {
          this.loading = false
          this.totalItems = totalItems
          this.data = this.operateData(customerList)
        }
      )
    },
    operateData(list) {
      list.map((item, i) => {
        // 判断头像图片资源是否为七牛云的，如果是的话进行压缩
        const { avatarUrl: customerImg } = item.customerDto
        if (
          customerImg &&
          customerImg.indexOf('https://img.kanhua.yiwaiart.com') != -1
        ) {
          const str = customerImg.split(customerImg.indexOf('?imageView2')[0])
          item.customerDto.avatarUrl2 = `${str}?imageView2/1/w/80/h/80/q/35`
        } else {
          item.customerDto.avatarUrl2 = item.customerDto.avatarUrl
        }
        item.isOpen = false
        // item.checked = false;
        item.reload = false
      })
      return list
    },
    goToSetCustomer() {
      this.pIsAdd = true
      this.pIsLook = false
      this.pIsShowModel = true
    },
    onChage(pageNo) {
      this.pageNo = pageNo
      this.getCustomerList()
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getCustomerList()
    },
    hanleSearch() {
      this.pageNo = 1
      this.getCustomerList()
    },
    p2Js(obj) {
      return JSON.stringify(obj)
    },
    editCustomer(row) {
      // 获取需要传送的对象
      const { customerDto } = row
      this.pCustomerInfo = customerDto
      // this.pCustomerInfo=;
      this.pIsAdd = false
      this.pIsLook = false
      this.pIsShowModel = true
    },
    deleteCustomer(row) {
      const { customerDto } = row
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除用户 [ ${customerDto.nickName} ] 吗？</p>`,
        onOk: () => {
          deleteCustomer({ customerId: customerDto.id }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success('删除成功！')
              this.getCustomerList()
            }
          })
        },
        onCancel: () => {}
      })
    },
    selectCustomer(row) {
      const { customerDto } = row
      this.pCustomerInfo = customerDto
      this.pIsAdd = false
      this.pIsLook = true
      this.pIsShowModel = true
    },
    onSortChange({ column, key, order }) {
      const k = key == 'gmtCreate' ? 'id' : key
      if ('normal' == order) {
        this.sortField = ''
        this.sort = ''
      } else {
        this.sortField = k
        this.sort = (order + '').toUpperCase()
      }
      this.getCustomerList()
    },
    _customerType(row) {
      // 1
      //  this.artistId = row.id;
      this.modal1 = true
      this.rowData = row
    },
    getItem(item) {
      // 1
      this.artistId = item.key
      this.itemName[this.artistId] = item.value
    },
    ok () {
      if(this.customerType === '个人'){
        this.artistId = 0
      }
      if(this.artistId === undefined){
        this.$Message.info(`请选择具体或其他${this.customerType}`)
        return
      }
      const postData = {
        bindId: this.artistId,
        customerId: this.rowData.customerDto.id,
        type: this.customerTypeList.indexOf(this.customerType)+1
      };
      setCustomerType(postData).then((res)=>{
        if(res.code === 10000) {
          this.getCustomerList();
          this.modal1 = false
          this.$Message.info('设置成功');
        }
      })
    },
    cancel () {
      this.modal1 = false
    }
  }
}
</script>

<style lang="less">
@import '../../libs/css/common.less';
#customerList {
}

#customerList {
  .headImgWrp {
    margin: 10px 0;
  }
  .headImg {
    overflow: hidden;
    display: inline-block;
    width: 50px;
    height: 50px;
    img {
      position: relative;
      max-width: 100%;
      max-height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .operateWrp {
    line-height: 1.8em;
  }
}
</style>
<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  padding-top: 30px;
  align-items: center;
}
.flex-row > div:first-child {
  width: 72px;
}
.ivu-radio-group {
  padding-left: 10px;
}
</style>
