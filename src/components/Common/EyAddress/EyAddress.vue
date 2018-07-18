<template>
  <!-- 
  —— 属性
  - ref String {非必填} 用来获取选择的省市 获取方法  get:this.$refs.eyAddress1.getInfo()
  - :value Array {非必填}  default:['全部','全部'] 在编辑场景可能用到 set:['xx省','xx市'] 
  - :width Array {非必填} default:[200,200] set:[200,200] 
  - :isSearch Boolean {非必填} default:false set:true/false 设置知否为查询状态 true：有'全部'的选项 false:'则没有'
  —— 方法
  on-province-change 省变动时候调用 return { province , city }
  on-city-change 城市变动时候调用 return { province , city }
  - eg:
    <EyAddress ref="eyAddress1"></EyAddress>
-->
  <div class="eyAddress">
    <Select v-model="p" @on-change="pOnChange" :style="{width:width[0]+'px'}">
      <Option v-for="(item,index) in provinces" :value="index" :key="index">{{ item }}</Option>
    </Select>
    <Select v-model="c" @on-change="cOnChange" :style="{width:width[1]+'px'}">
      <Option v-for="(item,index) in citys" :value="index" :key="index">{{ item }}</Option>
    </Select>
  </div>
</template>

<script>
import {
  Select,
  Option
} from 'iview';
import city from './city.js';
let provinces = [];
let citys = [];

export default {
  name: "EyAddress",
  components: {
    Select,
    Option
  },
  props: {
    value: {
      type: Array,
      default() {
        return ['全国', '全部'];
      },
    },
    width: {
      type: Array,
      default() {
        return [200, 200];
      }
    },
    isSearch: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      provinces: [],
      citys: [],
      p: 0,
      c: 0
    };
  },
  created() {

  },
  watch: {
    value(newValue) {
      this.init();
      console.log(newValue);
    }
  },
  mounted() {
    const obj = city(this.isSearch);
    provinces = obj.provinces;
    citys = obj.citys;
    this.provinces = provinces;
    this.init();
  },
  methods: {
    init() {
      // 编辑状态下赋值,用文本逆向取数组索引
      const p = provinces.indexOf(this.value[0]);
      this.p = p == -1 ? 0 : p;
      const city = citys[this.isSearch ? this.p - 1 : this.p];
      this.citys = city;
      this.$nextTick(() => {
        const c = city.indexOf(this.value[1]);
        this.c = c == -1 ? 0 : c;
      });
    },
    linkageCity(index) {
      index = this.isSearch ? index - 1 : index;
      this.citys = citys[index];

      // 解决相同长度的数组时候 二级v-model不会被改变
      this.citys.splice(this.citys.length, 1, '');
      this.$nextTick(() => {
        this.citys.splice(this.citys.length - 1, 1);
      });
    },
    pOnChange(index) {
      this.linkageCity(index);
      this.c = 0;
      const {
          province,
        city
        } = this.getInfo();
      this.$emit('on-province-change', {
        province,
        city
      });
    },
    cOnChange(index) {
      const {
          province,
        city
        } = this.getInfo();
      this.$emit('on-city-change', {
        province,
        city
      });
    },
    /**
     * 获取省-市
     */
    getInfo() {
      const {
          p,
        c,
        isSearch
        } = this;
      const province = provinces[p];
      const city = citys[isSearch ? p - 1 : p][c];
      if (province != '' && city != '')
        return {
          province,
          city
        };
      else
        return {
          province: '',
          city: ''
        };
    },
    show() {
      console.log(this.getInfo());
    }
  }
};

</script>

<style lang="less">
.eyAddress {
}
</style>
