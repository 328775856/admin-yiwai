<template>
  <div id="setCity">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem to="/City">一级城市管理</BreadcrumbItem>
      <BreadcrumbItem>添加城市</BreadcrumbItem>
    </Breadcrumb>

    <h1 class="mt10">基本资料</h1>
    
    <Form ref="formValidate" :model="cityInfo" :rules="ruleValidate" :label-width="150" :inline="false" class="mt20">
      <FormItem label="封面" prop="cover">
        <EyUpload @upload-ok="uploadOk" @upload-error="uploadError" accept="image/jpeg,image/jpg,image/png" />
        <div class="imgWrp mt20" v-if="cityInfo.cover!=''">
          <img :src="cityInfo.cover" class="headImg">
          <Icon type="close-circled" size="20" class="closeIcon" @click.native="resetImg()"></Icon>
        </div>
      </FormItem>
      <FormItem label="中西" prop="region">
        <RadioGroup v-model="cityInfo.region">
          <Radio :label="1">中国</Radio>
          <Radio :label="2">西方</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="城市名称" prop="name">
        <Input v-model.trim="cityInfo.name" placeholder="" style="width:300px;" />
      </FormItem>
      <FormItem label="地理坐标" prop="coordinate">
        <Input v-model.trim="cityInfo.coordinate" placeholder="" style="width:300px;" />
      </FormItem>
    </Form>

    <div class="tc">
      <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
      <Button type="ghost" style="margin-left: 8px" @click="()=>this.$router.push({ name: 'City' })">取消并返回</Button>
    </div>
  </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Button, Form, FormItem, Input, RadioGroup, Radio, Icon } from 'iview';
import EyUpload from '../../Common/EyUpload/EyUpload';
import {
  setCity,
} from "./City.service";

export default {
  name: 'SetCity',
  components: { Breadcrumb, BreadcrumbItem, Button, Form, FormItem, Input, RadioGroup, Radio, Icon, EyUpload },
  data() {
    return {
      cityInfo: {
        cover: '',
        region: 1,
        name: '',
        coordinate: ''
      },
      ruleValidate: {
        cover: [
          { required: true, message: '封面不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '城市名称不能为空', trigger: 'blur' }
        ],
        coordinate: [
          { required: true, message: '地理坐标不能为空', trigger: 'blur' }
        ],
      },
      isAdd: true
    }
  },

  mounted() {
    const { params } = this.$route;
    console.log(params);
    if (params.cityInfo) {
      this.cityInfo = Object.assign({}, {
        id: 0,
        cover: '',
        region: 1,
        name: '',
        coordinate: '',
      }, { ...params.cityInfo });
      this.isAdd = false;
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        const postData = Object.assign({}, {
          id: 0,
          cover: '',
          region: 1,
          name: '',
          coordinate: '',
        }, { ...this.cityInfo });
        console.log(postData, 'postData');
        if (valid) {
          setCity({ mapCityInfo: JSON.stringify(postData) }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success(`${this.isAdd ? '新增' : '修改'}城市成功!`);
              setTimeout(() => {
                this.$router.push({ name: 'City' });
              }, 1500);
            } else {
              this.$Message.error(`${this.isAdd ? '新增' : '修改'}城市失败!`);
            }
          });
        } else {
          this.$Message.error(`${this.isAdd ? '新增' : '修改'}城市失败!`);
        }
      })
    },
    uploadOk({ url }) {
      this.cityInfo.cover = url;
    },
    uploadError(error) {
      this.$Message.error('上传图片失败，请重新上传！');
    },
    resetImg() {
      this.cityInfo.cover = '';
      console.log(this.cityInfo);
    }
  }
}
</script>
<style lang="less">
@import "../../../libs/css/common.less";
#setCity {
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
}
</style>
