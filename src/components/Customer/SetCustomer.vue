<template>
  <div>
    <Modal id="setCustomer" :title="pIsLook?'查看用户':pIsAdd?'新增用户':'编辑用户'" v-model="isShowModel" width="400">
      <Form class="mt10" ref="formValidate" :model="customerInfo" :rules="ruleValidate" :label-width="80">
        <FormItem label="头像" prop="avatarUrl">
          <div class="headImgWrp">
            <img :src="customerInfo.avatarUrl" class="headImg">
          </div>
          <EyUpload v-if="!pIsLook" @upload-ok="uploadOk" @upload-error="uploadError" :maxSize="1024" accept="image/jpeg,image/jpg,image/png"/>
        </FormItem>

        <FormItem label="昵称" prop="nickName">
          <Input v-if="!pIsLook" v-model="customerInfo.nickName" placeholder="" />
          <p v-else>
            {{customerInfo.nickName}}
          </p>
        </FormItem>
        <FormItem label="性别" prop="gender">
          <RadioGroup v-if="!pIsLook" v-model="customerInfo.gender">
            <Radio :label="1">男</Radio>
            <Radio :label="2">女</Radio>
          </RadioGroup>
          <p v-else>
            {{customerInfo.gender==1?'男':customerInfo.gender==2?'女':'不详'}}
          </p>
        </FormItem>
        <FormItem label="年龄" prop="age">
          <Select v-if="!pIsLook" v-model="customerInfo.age" placeholder="">
            <Option value="60后">60后</Option>
            <Option value="70后">70后</Option>
            <Option value="80后">80后</Option>
            <Option value="90后">90后</Option>
            <Option value="00后">00后</Option>
          </Select>
          <p v-else>
            {{customerInfo.age||'无'}}
          </p>
        </FormItem>
        <FormItem label="签名" prop="signature">
          <Input v-if="!pIsLook" v-model="customerInfo.signature" placeholder="" />
          <p v-else>
            {{customerInfo.signature||'无'}}
          </p>
        </FormItem>
        <FormItem label="行业" prop="trade">
          <Input v-if="!pIsLook" v-model="customerInfo.trade" placeholder="" />
          <p v-else>
            {{customerInfo.trade||'无'}}
          </p>
        </FormItem>

        <FormItem label="公司" prop="company">
          <Input v-if="!pIsLook" v-model="customerInfo.company" placeholder="" />
          <p v-else>
            {{customerInfo.company||'无'}}
          </p>
        </FormItem>
        <FormItem label="职业" prop="job">
          <Input v-if="!pIsLook" v-model="customerInfo.job" placeholder="" />
          <p v-else>
            {{customerInfo.job||'无'}}
          </p>
        </FormItem>
        <FormItem label="国家" prop="country">
          <Input v-if="!pIsLook" v-model="customerInfo.country" placeholder="" />
          <p v-else>
            {{customerInfo.country||'无'}}
          </p>
        </FormItem>
        <FormItem label="省" prop="province">
          <Input v-if="!pIsLook" v-model="customerInfo.province" placeholder="" />
          <p v-else>
            {{customerInfo.province||'无'}}
          </p>
        </FormItem>
        <FormItem label="市" prop="city">
          <Input v-if="!pIsLook" v-model="customerInfo.city" placeholder="" />
          <p v-else>
            {{customerInfo.city||'无'}}
          </p>
        </FormItem>
        <!-- <FormItem label="是否官方" prop="isOfficial">
          <RadioGroup v-if="!pIsLook" v-model="customerInfo.isOfficial">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
          <p v-else>
            {{customerInfo.isOfficial==1?'是':'否'}}
          </p>
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button type="text" @click="()=>this.isShowModel=false">取消</Button>
        <Button v-if="pIsLook" type="primary" @click="()=>this.isShowModel=false">确定</Button>
        <Button v-else type="primary" @click="handleSubmit('formValidate')">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import EyUpload from '../Common/EyUpload/EyUpload';
import {
  setCustomer,
} from "./Customer.service";

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Select,
  Option,
  Input,
  Form,
  FormItem,
  Row,
  Col,
  RadioGroup,
  Radio,
  Modal,
} from 'iview';

export default {
  name: 'SetCustomer',
  components: {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Select,
    Option,
    Input,
    Form,
    FormItem,
    Row,
    Col,
    RadioGroup,
    Radio,
    Modal,
    EyUpload
  },
  props: {
    pIsLook: {
      default: true
    },
    pIsAdd: {
      default: true
    },
    pIsShowModel: {
      default: false,
    },
    pCustomerInfo: {
      default: () => { return {} },
    }
  },

  data() {
    return {

      isShowModel: this.pIsShowModel,
      labelList: ['真实用户', '虚拟用户'],
      breadName: '',

      customerInfo: {
        // avatarUrl: '',
        // nickName: '',
        // gender: 1,
        // age: '',
        // signature: '',
        // trade: '',
        // company: '',
        // job: '',
        // country: '',
        // province: '',
        // city: '',
        // isOfficial: 0
      },
      ruleValidate: {
        avatarUrl: [
          { required: true, message: '头像不能为空', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // this.$router.push({ name: 'Comment', params: { productId: 111 }})
    // this.$router.push({path: `/Comment`, query: {productId: 111}});
    // console.log(this.ppIsAdd);
    // console.log('我显示了');
    this.mergeData();
    // this.isShowModel=this.pIsShowModel;
    // console.log(this.isShowModel);
  },
  computed: {
    // // 计算属性的 getter
    // isShowModel:{
    //   get() {
    //     return this.pIsShowModel;
    //   },
    //   // setter
    //   set(newValue) {
    //     this.isShowModel=newValue;
    //   }
    // }
  },
  // beforeCreate() {
  //   console.log('beforeCreate');
  // },
  // beforeUpdate() {

  //   console.log('beforeUpdate');
  // },
  // updated() {
  //   console.log('updated');
  // },
  watch: {
    pCustomerInfo(newValue) {
      this.mergeData();
    },
    pIsShowModel(newValue) {
      this.isShowModel = newValue;
    },
    isShowModel(newValue) {
      if (!newValue) {
        this.$refs['formValidate'].resetFields();
        this.$emit('updatepCustomerInfo');
        // this.$emit('updateppIsAdd', true);
      }
      this.$emit('updatepIsShowModel', newValue);
    }
  },
  methods: {
    mergeData() {
      this.customerInfo = Object.assign({
        id: 0,
        mobile: '',
        isVip: 0,
        vipInfo: '',
        isVirtual: 1,
        // 分割
        avatarUrl: '',
        nickName: '',
        gender: 1,
        age: '',
        signature: '',
        trade: '',
        company: '',
        job: '',
        country: '',
        province: '',
        city: '',
        isOfficial: 0
      }, this.pCustomerInfo);
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // id
          // nickName,
          // avatarUrl,
          // country,
          // province,
          // city,
          // gender,
          // signature,
          // trade,
          // company,
          // job,
          // mobile,
          // isVip,
          // vipInfo,
          // isVirtual,
          // isOfficial,
          // age
          // const obj = Object.assign({
          //   id: 0,
          //   mobile: '',
          //   isVip: 0,
          //   vipInfo: '',
          //   isVirtual: 1,
          // }, this.customerInfo);
          console.log(this.customerInfo, '提交数据');
          setCustomer({ customerInfo: JSON.stringify(this.customerInfo) }).then(({ code }) => {
            if (code == '10000') {

              this.$Message.success(`${this.pIsAdd ? '新增' : '修改'}虚拟用户成功!`);

              // 用户为添加状态跳转第一页
              if (this.pIsAdd) {
                this.$parent.pageNo = 1;
              }
              // 刷新列表页
              this.$parent.getCustomerList();
              this.isShowModel = false;
            } else {
              this.$Message.error(`${this.pIsAdd ? '新增' : '修改'}虚拟用户失败!`);
            }
          });
        } else {
          this.$Message.error(`${this.pIsAdd ? '新增' : '修改'}虚拟用户失败!`);
        }
      })
    },
    // handleReset(name) {
    //   this.$refs[name].resetFields();
    // },
    uploadOk({ url }) {
      this.customerInfo.avatarUrl = url;
    },
    uploadError(error) {
      console.log(error);
    }
  }
}

</script>

<style lang="less">
@import "../../libs/css/constant.less";
@import "../../libs/css/common.less";

#setCustomer {
  .headImgWrp {
    position: relative;
    border: 1px solid @GRAY-50;
    width: 60px;
    height: 60px;
    overflow: hidden;
    margin-bottom: 10px;
    .headImg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
    }
  }
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
      top: 0;
    }
  }
}
</style>
