<template>
  <div id="setFaction">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem to="/Faction">二级画派管理</BreadcrumbItem>
      <BreadcrumbItem>添加画派</BreadcrumbItem>
    </Breadcrumb>
    <h1 class="mt10">基本资料</h1>

    <Form ref="formValidate" :model="factionInfo" :rules="ruleValidate" :label-width="150" :inline="false" class="mt20">

      <FormItem label="封面" prop="cover">
        <EyUpload @upload-ok="uploadOk" @upload-error="uploadError" accept="image/jpeg,image/jpg,image/png" />
        <div class="imgWrp mt20" v-if="factionInfo.cover!=''">
          <img :src="factionInfo.cover" class="headImg">
          <Icon type="close-circled" size="20" class="closeIcon" @click.native="resetImg()"></Icon>
        </div>
      </FormItem>

      <FormItem label="中西" prop="region">
        <RadioGroup v-model="factionInfo.region">
          <Radio :label="1">中国</Radio>
          <Radio :label="2">西方</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="画派名称" prop="name">
        <Input v-model.trim="factionInfo.name" placeholder="" style="width:300px;" />
      </FormItem>
      <FormItem label="地理坐标" prop="coordinate">
        <Input v-model.trim="factionInfo.coordinate" placeholder="" style="width:300px;" />
      </FormItem>
    </Form>

    <div class="tc">
      <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
      <Button type="ghost" style="margin-left: 8px" @click="()=>this.$router.push({ name: 'Faction' })">取消并返回</Button>
    </div>
  </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Button, Form, FormItem, Input, RadioGroup, Radio, Icon } from 'iview';
import EyUpload from '../../Common/EyUpload/EyUpload';
import {
  setFaction,
} from "./Faction.service";

export default {
  name: 'SetFaction',
  components: { Breadcrumb, BreadcrumbItem, Button, Form, FormItem, Input, RadioGroup, Radio, Icon, EyUpload },
  data() {
    return {
      factionInfo: {
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
          { required: true, message: '画派名称不能为空', trigger: 'blur' }
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
    if (params.factionInfo) {
      this.factionInfo = Object.assign({}, {
        id: 0,
        cover: '',
        region: 1,
        name: '',
        coordinate: '',
      }, { ...params.factionInfo });
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
        }, { ...this.factionInfo });
        console.log(postData, 'postData');
        if (valid) {
          setFaction({ mapPaintingFactionInfo: JSON.stringify(postData) }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success(`${this.isAdd ? '新增' : '修改'}画派成功!`);
              setTimeout(() => {
                this.$router.push({ name: 'Faction' });
              }, 1500);
            } else {
              this.$Message.error(`${this.isAdd ? '新增' : '修改'}画派失败!`);
            }
          });
        } else {
          this.$Message.error(`${this.isAdd ? '新增' : '修改'}画派失败!`);
        }
      })
    },
    uploadOk({ url }) {
      this.factionInfo.cover = url;
    },
    uploadError(error) {
      this.$Message.error('上传图片失败，请重新上传！');
    },
    resetImg() {
      this.factionInfo.cover = '';
    }
  }
}
</script>
<style lang="less">
@import "../../../libs/css/common.less";
#setFaction {
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
