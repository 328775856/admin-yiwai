<template>
  <div class="eySelectsearch" :style="{width:width+'px'}">
    <div class="selWrp" @click="_show">
      <div class="mlr10 clearfix">
        <input class="fl iptDisabled" type="text" disabled="true" :placeHolder="placeHolder" v-model="showValue" />
        <i class="fl btnSel">▾</i>
      </div>
    </div>

    <div class="resultWrp" v-show="show" @click="_prevent">
      <div class="searchWrp mui-flex" style="align-items: center;">
        <div class="mlr10 cell">
          <input type="text" placeholder="请输入" class="cell" v-model="kw" @keyup.13="_search">
        </div>
        <Button type="primary" @click="_search" style="margin-right:10px;">搜索</Button>
      </div>
      <div class="ulWrp" ref="scrollWrp" :style="{'max-height':maxHeight+'px'}">
        <ul>
          <li v-for="(item,index) in list" :key="index" @click="_getItem(item)">
            {{item.value}}
          </li>
        </ul>
        <p class="ssNoDataWrp" v-if="noData">暂无数据</p>
      </div>
    </div>
  </div>

</template>

<script>

import request from '../../libs/js/request.js';
import { Button } from 'iview';
export default {
  name: 'EySelectsearch',
  props: {
    url: String,// 请求路径 https://xxx.com/getartistList
    postData: {
      type: Object,
      default() {
        return {};
      }
    }, // 请求参数
    resultList: String,// 返回参数名 例：artistList
    name: String, // 关键词参数名 artistName
    kv: Array, // 返回格式 ['key','value']
    maxHeight: {
      type: Number,
      default: 200 // 默认的一条item高度为30px,根据pageSize的大小来限制最高高度，item高度*pageSize>max-height(30*10=300>x), x小于400即可
    }, // 最高高度
    width: {
      type: Number,
      default: 200
    },
    // 编辑时候赋值的value
    pShowValue: {
      type: String,
      default: ''
    },
    placeHolder: {
      type: String,
      default: ''
    }
  },
  components: { Button },
  data() {
    return {
      kw: '',
      skw: '',
      show: false,
      list: [],
      spinShow: false,
      pageNo: 0,
      pageSize: 10,
      isLock: false,
      showValue: '',
      noData: false
    }
  },
  mounted() {
    const _this = this;
    _this.showValue = _this.pShowValue;

    this._getList();
    this.$refs.scrollWrp.addEventListener('scroll', function (e) {
      if (_this.list.length != 0 && this.scrollTop + this.offsetHeight >= this.scrollHeight) {
        _this._getList();
        // _this.sponShow = false;

      }
    });

    document.addEventListener('click', () => {
      this.show = false;
    });
  },
  watch: {
    show(newValue, oldValue) {
      // 监听是否显示,来禁用外部的滚动条滚动
      this.$emit('_isSsShow', newValue);
    },
    pShowValue(newValue, oldValue) {
      console.log(oldValue);
      this.showValue = newValue;
    }
  },
  methods: {
    reset() {
      this.showValue = '';
    },
    _getList() {
      const _this = this;
      if (!_this.isLock) {

        _this.isLock = true;
        _this.pageNo += 1;

        const { url, resultList, name, skw, postData, pageNo, pageSize } = _this;

        // 搜索在searchInfo里面
        const { searchInfo } = postData;
        // 获取需要搜索的字段
        const si = Object.assign(searchInfo, {
          [name]: skw
        });
        const pd = Object.assign({}, postData, {
          searchInfo: JSON.stringify(si),
          pageNo,
          pageSize
        });

        console.log(pd);

        request.post(url, pd).then(({ data }) => {
          const res = data[resultList];
          _this.isLock = false;
          if (res.length > 0) {
            _this.noData = false;
            _this.list = [..._this.list, ..._this._operateData(res)];
          } else {
            _this.noData = true;
            _this.pageNo -= 1;
          }
        });

      }

      // alert(_this.name)
    },
    _operateData(list) {
      const { kv } = this;
      const key = kv[0];
      const value = kv[1];
      let newArr = [];
      list.map((item) => {
        newArr.push({ key: this._getObjKey(item, key), value: this._getObjKey(item, value) })
      });
      return newArr;
    },
    _getObjKey(obj, name) {
      const arr = name && name.split('.');
      for (let i = 0, len = arr.length; i < len; i++) {
        obj = arr[i] && obj[arr[i]];
      }
      return obj;
    },
    _show(e) {
      this.show = this.show ? false : true;
      e.cancelBubble = true;
      this.kw = '';
      this.skw = '';
      this._getList();
    },
    _blur() {
      this.show = false;
    },
    _focus(e) {
      this.show = true;
    },
    _getItem(item) {
      this.showValue = item.value;
      this.show = false;
      this.$emit('getItem', item);
    },
    _search() {
      this.skw = this.kw;
      this.pageNo = 0;
      this.list = [];
      this._getList();
    },
    _prevent(e) {
      e.cancelBubble = true;
    }
  }
}
</script>

<style lang="less">
@import "../../libs/css/common.less";
.ivu-form-item-error .eySelectsearch {
  border: 1px solid #ed3f14;
}
.eySelectsearch {
  &.err {
    .selWrp {
      border-color: red;
    }
  }
  .btnSel {
    height: 30px;
    font-style: normal;
    line-height: 30px;
    width: 30px;
    text-align: center;
    font-size: 28px;
    position: absolute;
    right: 0;
    cursor: pointer;
    color: #929292;
  }
  position: relative;
  .selWrp {
    cursor: pointer;
    width: 100%;
    border: 1px solid #ededed;
    background: #fff;
    .mlr10 {
      margin: 0 30px 0 10px;
    }
    input {
      line-height: 30px;
      width: 100%;
      height: 30px;
      &[disabled] {
        color: #000000;
        background: transparent;
      }
    }
    .iptDisabled {
      border: 0;
      outline: none;
    }
  }
  .searchWrp {
    width: 100%;
    .mlr10 {
      margin: 0 10px 0 10px;
    }
    input {
      display: inline-block;
      width: 100%;
      height: 32px;
      line-height: 1.5;
      padding: 4px 7px;
      font-size: 12px;
      border: 1px solid #dddee1;
      border-radius: 4px;
      color: #495060;
      background-color: #fff;
      background-image: none;
      position: relative;
      cursor: text;
      transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
        box-shadow 0.2s ease-in-out;
      width: 100%;
      margin: 10px 0;
      // border: 1px solid #ededed;
      line-height: 30px;
      height: 30px;
      padding: 0 10px;
    }
  }
  .resultWrp {
    z-index: 9999;
    background-color: #fff;
    border: 1px solid #ededed;
    border-top: none;
    position: absolute;
    left: 0;
    width: 100%;
    .ulWrp {
      overflow-y: auto;
    }
    ul {
      li {
        padding: 5px 10px;
        line-height: normal;
        &:hover {
          background-color: #00a0e9;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
  .ssNoDataWrp {
    text-align: center;
    font-size: 12px;
  }
}
input::-webkit-input-placeholder {
  /* WebKit browsers */

  color: #bbbec4;
}

input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */

  color: #bbbec4;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */

  color: #bbbec4;
}

input:-ms-input-placeholder {
  /* Internet Explorer 10+ */

  color: #bbbec4;
}
</style>
