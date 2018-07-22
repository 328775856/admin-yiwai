<template>
  <!-- 新增页start -->
  <div class="addArtProduct">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>基础数据</BreadcrumbItem>
      <BreadcrumbItem>艺术品库</BreadcrumbItem>
      <BreadcrumbItem>新增艺术品</BreadcrumbItem>
    </Breadcrumb>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" :inline="true">
      <FormItem label="问题" prop="question" class="formItem100">
        <Input v-model="formValidate.proQuestion" placeholder="输入作品问题" clearable :maxlength="30"/>
      </FormItem>
      <FormItem label="艺术品名称" prop="name" class="formItem100">
        <Input v-model="formValidate.name" placeholder="输入艺术品名称" clearable :maxlength="30"/>
      </FormItem>
      <FormItem label="艺术品图片" prop="imageUrl" class="formItem45">
        <EyUpload @upload-ok="getImageUrl" @upload-error="uploadError" @upload-exceeded-size="uploadExceededSize"
                  imgSizeText="图片规格：不超过2M" :maxSize="2048" accept="image/jpeg,image/jpg,image/png"/>
        <p v-show="isArtImgUploadOk">
                    <span class="headImg">
                        <Icon type="close-circled" size="18" class="closeIcon"
                              @click.native="resetImg('imageUrl')"></Icon>
                        <img :src="formValidate.imageUrl+'?imageView2/1/w/135/h/165/q/50'" class="img">
                    </span>
        </p>
      </FormItem>
      <!-- <FormItem label="列表缩略图" prop="litimg" class="formItem45">
          <EyUpload @upload-ok="getLitImgUrl" @upload-error="uploadError" @upload-exceeded-size="uploadExceededSize" imgSizeText="图片规格：高400px,宽325px，不超过100K" :maxSize="100" accept="image/jpeg,image/jpg,image/png"/>
          <p v-show="isLitUploadOk">
              <span class="headImg">
                  <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg('litimg')"></Icon>
                  <img :src="formValidate.litimg+'?imageView2/1/w/135/h/165/q/50'" class="img">
              </span>
          </p>
      </FormItem> -->
      <FormItem label="作者" prop="artistName" class="formItem100">
        <EySelectsearch :pShowValue="formValidate.artistName" placeHolder="搜索并添加作者" url="/getArtistList/v1"
                        name="artistName" resultList="artistList"
                        :postData="{searchInfo: {artistName:'' },pageNo: 0,pageSize: 10}" :kv="['id','name']"
                        @getItem="getItem"></EySelectsearch>
        <span>如搜索不到作者，请点击
                    <router-link to="/Base/AddArt">新增艺术家</router-link>
                </span>
      </FormItem>
      <FormItem label="作品类型" prop="proTypeId" class="formItem45">
        <Select v-model="one" style="width:45%">
          <Option v-for="(item,index) in proTypeData" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        <Select v-model="two" style="width:45%">
          <Option v-for="(jtem,idx) in childrenProTypeList" :value="jtem.value" :key="idx">{{ jtem.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="尺寸规格" class="formItem45">
        <Input v-model="formValidate.proSize" placeholder="输入作品规格，如长宽高、重量..." clearable :maxlength="50"/>
      </FormItem>
      <FormItem label="创作年代" class="formItem45">
        <Input v-model="formValidate.proYears" placeholder="如：1893年、商超..." clearable :maxlength="20"/>
      </FormItem>
      <FormItem label="收藏地点" prop="collectPlace" class="formItem45">
        <Input v-model="formValidate.collectPlace" placeholder="搜索并添加收藏地点" clearable :maxlength="30"/>
      </FormItem>
      <!-- <FormItem label="作品影响区域" class="formItem45">
          <Input v-model="formValidate.influenceRegion" placeholder="影响区域" clearable :maxlength="20" />
      </FormItem>
      <FormItem label="作品喜好人群" class="formItem45">
          <Input v-model="formValidate.preferGroup" placeholder="作品喜好人群" clearable :maxlength="20" />
      </FormItem>
      <FormItem label="作品历史状态" class="formItem45">
          <Input v-model="formValidate.historyState" placeholder="作品历史状态" clearable :maxlength="20" />
      </FormItem> -->
      <FormItem label="发布状态" prop="status" class="formItem100">
        <RadioGroup v-model="formValidate.status" v-for="(item,index) in releaseStatus" :key="index">
          <Radio :label="item.value">{{item.name}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="作品标签" class="formItem45">
        <Input @on-enter="generateproTags" placeholder="输入作品标签，按回车键添加标签"/>
        <div style="" v-if="proTags.length>0">
          <Tag v-for="(tag,index) in proTags" type="border" closable @on-close="deleteproTag(index)" :key="tag">
            {{tag}}
          </Tag>
        </div>
      </FormItem>
      <FormItem label="艺术品介绍" prop="proDescription" class="formItem100">
        <EyQuill @content-change="contentChange" :editContent="formValidate.proDescription"/>
      </FormItem>
      <FormItem label="艺术品介绍" prop="proDescription" class="formItem100">
      </FormItem>
      <Modal v-model="modal1"
             title="对话框"
             @on-ok="ok"
             @on-cancel="cancel">
        <FormItem label="" class="formItem45">
          <RadioGroup v-model="type">
            <Radio label="音频"></Radio>
            <Radio label="视频"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="相关视频" class="formItem100">
          <EyUpload @upload-ok="getVideoImgUrl" @upload-error="uploadError" @upload-exceeded-size="uploadExceededSize"
                    imgSizeText="封面图片规格：高422px,宽750px" accept="image/jpeg,image/jpg,image/png"/>
          <p v-show="isVideoUploadOk">
          <span class="headImg">
          <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg('videoImage')"></Icon>
          <img :src="formValidate.videoImage+'?imageView2/1/w/135/h/165/q/50'" class="img">
          </span>
          </p>
        </FormItem>
        <FormItem label="相关视频" class="formItem100 upload" v-show="type ==='视频'">
          <Input v-model="formValidate.videoUrl" placeholder="输入视频链接地址" clearable :maxlength="200"/>
          <router-link :to="{ path: '/Video'}" target="_blank">上传视频</router-link>
        </FormItem>
        <FormItem label="相关音频" class="formItem100 upload" v-show="type ==='音频'">
          <Input v-model="formValidate.voiceUrl" placeholder="输入音频链接地址" clearable :maxlength="200"/>
          <router-link :to="{ path: '/Video'}" target="_blank">上传音频</router-link>
        </FormItem>
        <FormItem label="标题" class="formItem45">
          <Input v-model="mediaTitle"  placeholder="输入作品标签，按回车键添加标签"/>
        </FormItem>
      </Modal>
      <Button style="margin-left: 150px " class="addTicket" type="primary" @click="addNew">新增</Button>
        <Table :data="ProductMediaData.mediaList" :columns="ProductMediacolumns" border></Table>
      <FormItem class="formItem100 btn">
        <Button type="primary" @click="save('formValidate')">保存</Button>
        <Button type="ghost" @click="goBack('1')" style="margin-left: 8px">取消并返回</Button>
      </FormItem>
    </Form>
  </div>
  <!-- 新增页end -->
</template>

<script>
  import {
    Table,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Form,
    FormItem,
    Input,
    Row,
    Col,
    Icon,
    RadioGroup,
    Radio,
    Select,
    Option,
    Tag,
    Modal
  } from 'iview';
  import {getProductTypeList} from 'libs/js/api.js';
  import {setProduct, getProductMediaList, setProductMedia, deleteProductMedia} from './Base.service.js';
  import EySelectsearch from '../Common/EySelectsearch.vue';
  import EyQuill from '../Common/EyQuill/EyQuill.vue';
  import EyUpload from '../Common/EyUpload/EyUpload';

  let that = ''
  export default {
    name: 'AddArtProduct',
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
      RadioGroup,
      Radio,
      Select,
      EyUpload,
      EySelectsearch,
      EyQuill,
      Tag,
      Table,
      Modal
    },
    data() {
      return {
        one: '',
        two: '',
        childrenProTypeList: [],
        releaseStatus: [{value: 1, name: '已发布'}, {value: 0, name: '未发布'}],
        artData: [],
        isArtImgUploadOk: false,
        isLitUploadOk: false,
        isVideoUploadOk: false,
        editFormValidate: [],
        proTags: [],
        formValidate: {
          id: 0,
          proQuestion: '',
          name: '',
          imageUrl: '',
          litimg: '',
          artistId: 0,
          artistName: '',
          proTypeId: '',
          proSize: '',
          proYears: '',
          collectPlace: '',
          videoImage: '',
          videoUrl: '',
          status: 1,
          proTag: '',
          voiceUrl: '',
          // influenceRegion: '',
          // preferGroup: '',
          // historyState: '',
          proDescription: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '艺术品名称不能为空', trigger: 'blur'}
          ],
          imageUrl: [
            {required: true, message: '艺术品图片不能为空', trigger: 'blur'},
          ],
          litimg: [
            {required: false, message: '艺术品列表缩略图不能为空', trigger: 'blur'},
          ],
          artistName: [
            {required: true, message: '艺术品作者不能为空', trigger: 'change'},
          ],
          proTypeId: [
            {type: 'number', required: true, message: '艺术品类型不能为空', trigger: 'blur'},
          ],
          collectPlace: [
            {required: true, message: '艺术品收藏地点不能为空', trigger: 'blur'},
          ],
          status: [
            {type: 'number', required: true, message: '艺术品发布状态不能为空', trigger: 'change'},
          ],
          proDescription: [
            {required: true, message: '艺术品介绍不能为空', trigger: 'blur'},
          ],
        },
        proTypeData: [],
        productTypeList: [],
        mediaTitle: '',
        type: '音频',
        typeList: ['音频','视频'],
        ProductMediaData: {},
        ProductMediacolumns: [
          {
            title: '编号',
            key: 'id',
            width: 70,
            align: 'center',
            render(h, params) {
              return <div>{params.row.id}</div>
            }
          },
          {
            title: '文件地址',
            key: 'id',
            width: 700,
            align: 'center',
            render(h, params) {
              return <div>{params.row.mediaUrl}</div>
            }
          },
          {
            title: '图片地址',
            key: 'id',
            width: 600,
            align: 'center',
            render(h, params) {
              return <img class='img' src={params.row.mediaImage}/>
            }
          },
          {
            title: '文件标题',
            key: 'id',
            width: 70,
            align: 'center',
            render(h, params) {
              return <div>{params.row.mediaTitle}</div>
            }
          },
          {
            title: '文件类型',
            key: 'id',
            width: 70,
            align: 'center',
            render(h, params) {
              return <div>{['音频','视频'][params.row.type-1]}</div>
            }
          },
          {
            title: '操作',
            key: 'id',
            width: 70,
            align: 'center',
            render(h, params) {
              return <div>
              <span
              onClick={() =>{
                    that.modal1 = true;
                    that.isNew = false;
                    that.rowId = params.row.id
              }
            }
            class="edit"
                >
                修改
                </span>
                <span
              onClick={() =>{
                that.$Modal.confirm({
                  title: '系统提示',
                  content: `<p>确定要删除吗？</p>`,
                  onOk: async () => {
                    const { code, msg } = await deleteProductMedia({mediaId: params.row.id})
                    if (code === 10000 || code === '10000') {
                      that.$Message.success(msg)
                      getProductMediaList({productId: that.productTypeList[0].id}).then((res)=>{
                        if(res.code === 10000){
                          that.ProductMediaData = res.data
                        }
                      })
                    } else if (code === 10001 || code === '10001') {
                      that.$Message.error(msg)
                    }
                  }
                })
              }
            }
            class="edit"
                >
                删除
                </span>
              </div>
            }
          }
        ],
        modal1: false,
        rowId: '',
        isNew: false
      }
    },
    created() {
      that = this
      this.getProductTypeList({})
      // 判断是新增or编辑页面（有参数为编辑，否则为新增）
      const data = this.$route.params.data;
      if (data) {
        for (let item in data) {
          if (data.hasOwnProperty(item) && this.formValidate.hasOwnProperty(item)) {//筛选过滤赋值formValidate
            this.formValidate[item] = data[item]
          }
        }
        if (data.imageUrl) {
          this.isArtImgUploadOk = true;
        }
        if (data.litimg) {
          this.isLitUploadOk = true;
        }
        if (data.videoImage) {
          this.isVideoUploadOk = true;
        }
        if (data.proTypeId != 0) {
          this.two = data.proTypeId;
        } else {
          this.formValidate.proTypeId = '';
        }
        if (data.proTag) {
          this.proTags = data.proTag.split(',');
        }
      }
      ;

    },
    watch: {
      'one'(nv, ov) {
        this.childrenProTypeList = [];//节流函数
        clearTimeout(t)
        let t = setTimeout(() => {
          const findData = this.productTypeList.find(item => item.id === nv)//通过one找出对应id的obj
          if (findData.children && findData.children.length != 0) {
            const d = findData.children.map((jtem, idx) => {
              const d =
                {
                  value: jtem.id,
                  label: jtem.name
                }
              return d;
            })
            this.childrenProTypeList = d;
          }
        }, 300);
      },
      'two'(nv, ov) {
        if (nv) {
          this.formValidate.proTypeId = nv;
          this.two = nv
        }
      },
    },
    mounted() {
    },
    methods: {
      generateproTags(e) {
        if (this.proTags.indexOf(e.target.value) > -1) {
          return;
        }
        this.proTags.push(e.target.value);
        console.log(this.proTags.toString());
        e.target.value = '';
      },
      deleteproTag(index) {
        this.proTags.splice(index, 1);
        console.log(this.proTags.toString());
      },
      contentChange({content}) {
        // 接收子组件的content赋值
        this.formValidate.proDescription = content;
      },
      getItem(e) {
        console.log(e)
        this.formValidate.artistId = e.key;
        this.formValidate.artistName = e.value;
      },
      getImageUrl(file) {
        this.isArtImgUploadOk = true;
        this.formValidate.imageUrl = file.url;
      },
      getLitImgUrl(file) {
        this.isLitUploadOk = true;
        this.formValidate.litimg = file.url;
      },
      getVideoImgUrl(file) {
        this.isVideoUploadOk = true;
        this.formValidate.videoImage = file.url;
      },
      uploadError(error) {
        this.isUploadOk = false;
        console.log(error)
      },
      uploadExceededSize() {
        this.$Message.error('文件超出大小限制!');
      },
      resetImg(img) {
        if (img == 'imageUrl') {
          this.isArtImgUploadOk = false;
          this.formValidate.imageUrl = '';
        } else if (img == 'litimg') {
          this.isLitUploadOk = false;
          this.formValidate.litimg = '';
        } else if (img == 'videoImage') {
          this.isVideoUploadOk = false;
          this.formValidate.videoImage = '';
        }

      },
      uploadOk() {
        this.isUploadOk = true;
      },
      add(name) {
        this.$router.push({name});
      },
      goBack(tab) {
        this.$router.push({name: 'Base', params: {tab}});
      },
      filterMethod(value, option) {
        return value;
      },
      getProTypeId(value, selectedData) {
        this.formValidate.proTypeId = value[1];
      },
      async getProductTypeList({level = 0}) {
        const {data: {productTypeList}} = await getProductTypeList({level});
        getProductMediaList({productId: productTypeList[0].id}).then((res)=>{
          if(res.code === 10000){
            this.ProductMediaData = res.data
          }
        })
        this.productTypeList = productTypeList;//产品类型总数据
        this.proTypeData = productTypeList.map((item, index) => {
          const proTypeData =
            {
              value: item.id,
              label: item.name,
            }
          return proTypeData;
        })
        if (this.two) {//当为编辑状态时，this.two不为空
          var one = productTypeList.find((item) => {
            if (item.children && item.children.length != 0) {
              var b = item.children.find((jtem) => {
                return jtem.id == this.two;
              })
              return b
            }
          })
          this.one = one.id;
        }
      },
      save(name) {
        this.$refs[name].validate(async (valid) => {
          if (valid) {
            // 提交前将富文本图片上传至七牛云
            // this.formValidate.proDescription
            this.formValidate.proTag = this.proTags.toString();
            console.log('详情页传递数据', this.formValidate);
            const {code, msg} = await setProduct({
              productInfo: JSON.stringify(this.formValidate)
            })
            if (code === 10000 || code === '10000') {
              this.$Message.success(msg);
              setTimeout(() => {
                this.$router.push({path: "/Base?tab=1"})
              }, 1000)
            } else {
              this.$Message.error(msg);
            }
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      setProductMedia(id) {
        const postData = {
          id: id || 0,
          productId: this.productTypeList[0].id,
          mediaUrl: this.formValidate.videoUrl || this.formValidate.voiceUrl,
          mediaImage: this.formValidate.videoImage,
          mediaTitle: this.mediaTitle,
          type: this.typeList.indexOf(this.type)+1
        };
        setProductMedia({mediaInfo: JSON.stringify(postData)}).then((res) => {
          if (res.code === 10000) {
            getProductMediaList({productId: this.productTypeList[0].id}).then((res)=>{
              if(res.code === 10000){
                this.ProductMediaData = res.data
              }
            })
          }
        })
      },
      ok () {
        if(this.isNew === true){
          this.setProductMedia(0)
        }else{
          this.setProductMedia(this.rowId)
        }
        this.$Message.info('Clicked ok');
      },
      cancel () {
        this.$Message.info('Clicked cancel');
      },
      addNew(){
        this.modal1 = true
        this.isNew = true
      }
    },
  }
</script>

<style lang="less">
  @import "../../libs/css/constant.less";
  @import "../../libs/css/common.less";

  .upload {
    .ivu-input-wrapper {
      width: 80%;
    }
  }

  .addArtProduct {
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
<style>
  .ivu-table-cell .img{
    width: 77px;
    height: 100px;
  }

</style>
