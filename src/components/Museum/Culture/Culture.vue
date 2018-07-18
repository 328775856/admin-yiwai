<template>
  <div id="museum">

        <Row type="flex"  align="middle">
            筛选<EyAddress ref="eyAddress1" :value="addressValue" @on-province-change="handleSearch" @on-city-change="handleSearch" :width="[150,150]" style="margin-left:10px;"></EyAddress>
              <div style="display:inline-block;width:100px;margin-left:10px;margin-right:30px;">
                <Select v-model="userType" placeholder="全部" @on-change="changField">
                    <Option v-for="item in userTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </div>
                排序
              <div style="display:inline-block;width:100px;margin-left:10px;">
              <Select v-model="sortField" @on-change="changField" placeholder="按时间">
                  <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              </div>
      </Row>

      <Row type="flex" align="middle" class="mt20" style="position:relative;">
         搜索
          <div style="display:inline-block;width:100px;margin-left:10px;">
              <Select v-model="searchType" placeholder="国宝名称">
                  <Option v-for="item in searchList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
          </div>
          <div><Input v-model="searchValue" placeholder="请输入"></Input></div>
          <Button type="primary" style="margin-left:10px;" @click="handleSearch">搜索</Button>
          <div  style="text-align:right;" >
           <Button type="primary" icon="plus" style="margin-left:10px;position:absolute;right:0;bottom:0;" @click="addCulture">添加内容</Button>
          </div>
      </Row>

    <div class="ey_ullis mt10">
      <div class="ivu-spin ivu-spin-large ivu-spin-fix" v-if="loading">
        <div class="ivu-spin-main">
          <span class="ivu-spin-dot"></span>
          <div class="ivu-spin-text"></div>
        </div>
      </div>
      <ul>
        <li v-for="(item,index) in dataList" :key="index">
          <div class="mui-flex alc">
            <div class="commentIdWrp">
              编号: {{item.hometownAntiqueDto.id}}
            </div>
            <div class="imgWrp">
              <img :src="item.hometownAntiqueDto.customerImg">
            </div>
            <div class="cell">
              <p>
                <router-link :to="{ name: 'Customer',params:{customerName:item.hometownAntiqueDto.customerName,tab:item.hometownAntiqueDto.customerType==1 ? 1 : 0}}" class="aLink">
                {{item.hometownAntiqueDto.customerName}}
                </router-link>
                <span>{{item.hometownAntiqueDto.gmtCreate}}</span>
              </p>
              <div class="contentWrp bk">{{item.hometownAntiqueDto.content}}</div>
              <div class="btmWrp">
                <span>点赞数：{{item.likeNum}}
                  <a href="javascript:;" class="aLink" @click="setLike({antiqueId:item.antiqueId,likeNum:item.likeNum})">设置点赞数</a>
                </span>
                <span class="ml15">投票数：{{item.voteNum}}
                    <a href="javascript:;" class="aLink" @click="setVote({antiqueId:item.antiqueId,voteNum:item.voteNum})" >设置投票数</a>
                </span>
              </div>
            </div>
            <div class="opeWrp" style="text-align:center;">
              <a v-if="item.hometownAntiqueDto.customerType==1" style="display:block;" href="javascript:void(0)" @click="goEdit(item.hometownAntiqueDto)" class="aLink">编辑</a>
              <router-link style="display:block;" :to="{ name: 'AddCultureDetail',params:{data:item.hometownAntiqueDto}}"  class="aLink">补充详情</router-link>
              <a href="javascript:;" style="display:block;" class="aLink" @click="deleteItem(item.antiqueId)">删除</a>
            </div>
          </div>

          <div class="commentTypeWrp">
           排名:
           <span>{{item.rank !==undefined ? item.rank : "未上榜"}}</span>
           文物名称:
           <span>{{item.hometownAntiqueDto.name}}  <a href="javascript:void(0)" @click="goContent(item.hometownAntiqueDto.id,item.hometownAntiqueDto.name)"  class="aLink">查看相关内容</a></span>
           文物配图:
           <span>{{item.hometownAntiqueDto.imageList !== undefined ? item.hometownAntiqueDto.imageList.length : 0}}图 <a href="javascript:void(0);" @click="lookImage(item.hometownAntiqueDto.imageList)">查看图片</a></span>
           地域:
           <a href="javascript:void(0)" @click="setAddress(item.hometownAntiqueDto.province,item.hometownAntiqueDto.city)">{{item.hometownAntiqueDto.province}},{{item.hometownAntiqueDto.city}}</a>
          </div>
        </li>
      </ul>
    </div>

    <Page class="paging tr mt10" :current.sync="currentPage" :total="totalItems" show-total show-elevator :page-size-opts="[10,20,30]" placement="top" @on-change="onChage" @on-page-size-change="onPageSizeChange" v-if="dataList.length!=0"></Page>

    <div class="noDataWrp" v-if="dataList.length==0&&loading==false">
      暂无数据！
    </div>
  <div>
    <VueGallery :images="imageList" :index="index2" @close="index2 = null"></VueGallery>
  </div>
    <SetLike :pLikeIsShowModel="pLikeIsShowModel" :pLikeInfo="pLikeInfo" @updatepLikeIsShowModel="val=>pLikeIsShowModel=val" @updatepLikeInfo="()=>pLikeInfo={}"></SetLike>
    <SetVote :pVoteIsShowModel="pVoteIsShowModel" :pVoteInfo="pVoteInfo" @updatepLikeIsShowModel="val=>pVoteIsShowModel=val" @updatepLikeInfo="()=>pVoteInfo={}"></SetVote>
  </div>
</template>

<script>
import {
  Table,
  Page,
  Button,
  Input,
  Row,
  Col,
  Select,
  Option,
  Carousel,
  CarouselItem,
  Modal
} from 'iview'
import CityPicker from '../../Common/CityPicker/CityPicker'
import EyFilter from '../../Common/EyFilter/EyFilter'
import SetLike from './SetLike'
import SetVote from './SetVote'
import VueGallery from 'vue-gallery'
import EyAddress from '../../Common/EyAddress/EyAddress'
import {
  getAntiqueStatisticsList,
  deleteHometownAntique
} from './Culture.service'
export default {
  name: 'Culture',
  components: {
    EyAddress,
    Table,
    Page,
    VueGallery,
    Button,
    Input,
    EyFilter,
    Row,
    Col,
    CityPicker,
    Select,
    Option,
    Carousel,
    CarouselItem,
    Modal,
    SetLike,
    SetVote
  },
  props: {
    isVirtual: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      valueIndex: 0,
      imageList: [],
      index2: null,
      storage: true,
      userTypeList: [
        {
          label: '全部',
          value: 2
        },
        {
          label: '真实用户',
          value: 0
        },
        {
          label: '虚拟用户',
          value: 1
        }
      ],
      customerId: 0,
      imgModal: false,
      userType: '',
      searchValue: '',
      province: '',
      city: '',
      searchType: 0,
      pageNo: 1,
      currentPage: 1,
      pageSize: 10,
      sortField: '',
      sort: '',
      addressValue: [],
      totalItems: 0,
      pIsShowModel: false,
      pLikeIsShowModel: false,
      pVoteIsShowModel: false,
      pLikeInfo: {},
      pVoteInfo: {},
      loading: true,
      sortList: [
        { value: 'gmtCreate', label: '按时间' },
        { value: 'voteNum', label: '按得票数' },
        { value: 'likeNum', label: '按点赞数' }
      ],
      searchList: [
        { value: 0, label: '国宝名称' },
        { value: 1, label: '用户名称' }
      ],
      dataList: []
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    async getDataList() {
      const postData = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sort: this.sort,
        sortField: this.sortField,
        customerId: this.customerId,
        searchInfo: JSON.stringify({
          province: this.province,
          city: this.city,
          customerType: this.userType === 2 ? '' : this.userType,
          name: this.searchType === 0 ? this.searchValue : '',
          customerName: this.searchType === 1 ? this.searchValue : ''
        })
      }
      const { code, msg, data } = await getAntiqueStatisticsList(postData)
      if ((code === 10000) | (code === '10000')) {
        this.loading = false
        this.totalItems = data.totalItems
        this.dataList = data.antiqueList
      }
    },
    handleSearch() {
      this.pageNo = 1
      this.currentPage = 1
      const { province, city } = this.$refs.eyAddress1.getInfo()
      this.city = city
      this.province = province
      if (province == '全国') {
        this.province = ''
      }
      if (city == '全部') {
        this.city = ''
      }
      this.getDataList()
    },
    changField() {
      this.getDataList()
    },
    onChage(pageNo) {
      this.pageNo = pageNo
      this.getDataList()
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getDataList()
    },
    deleteItem(antiqueId) {
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除该文物吗？</p>`,
        onOk: () => {
          deleteHometownAntique({ antiqueId: antiqueId }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success('删除成功！')
              this.getDataList()
            }
          })
        },
        onCancel: () => {}
      })
    },
    onSortChange({ column, key, order }) {
      this.sort = 'normal' == order ? '' : (order + '').toUpperCase()
      this.getDataList()
    },
    lookImage(images) {
      this.imageList = []
      if (images && images.length) {
        for (let i = 0; i < images.length; i++) {
          this.imageList.push(images[i].imageUrl)
        }
        this.index2 = 0
      }
    },
    getItem({ key, value }) {
      this.pageNo = 0
      this.currentPage = 1
      if (key) {
        this.materialType = key
      } else {
        this.materialType = 0
      }
      this.getDataList()
    },
    addCulture() {
      this.$router.push({ name: 'AddCulture' })
    },
    setAddress(provide, city) {
      this.pageNo = 1
      this.addressValue = []
      if (provide) {
        this.addressValue.push(provide)
        this.province = provide
      }
      if (city) {
        this.addressValue.push(city)
        this.city = city
      }

      this.getDataList()
    },
    //{ name: 'CultureContent',params:{antiqueId:item.antiqueId,customerId:item.hometownAntiqueDto.customerId}}
    goEdit(data) {
      this.$router.push({ name: 'AddCulture', params: { data: data } })
    },
    goContent(antiqueId, name) {
      this.$router.push({
        path: '/CultureContent',
        query: { antiqueId: antiqueId, antiqueName: name }
      })
    },

    setLike({ antiqueId, likeNum }) {
      this.pLikeInfo = {
        antiqueId,
        likeNum
      }
      console.log(this.pLikeInfo)
      this.pLikeIsShowModel = true
    },
    setVote({ antiqueId, voteNum }) {
      this.pVoteInfo = {
        antiqueId,
        voteNum
      }
      console.log(this.pVoteInfo)
      this.pVoteIsShowModel = true
    }
  }
}
</script>

<style lang="less">
@import './../../Comment/comment.less';

.commentTypeWrp {
  span {
    display: inline-block;
    margin-right: 30px;
  }
}
.image {
  float: left;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid #ebebeb;
  margin: 5px;
}
.noDataWrp {
  text-align: center;
}
</style>
