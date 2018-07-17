<template>
  <div id="eyFilter">
    <span class="label">
      {{label}}
    </span>
    <span class="item" v-for="(item,index) in list" :key="index" :class="{ active: item.isActive }" @click="getItem(index)">
      {{item.value}}
    </span>
  </div>
</template>

<script>
export default {
  name: "EyFilter",
  props: {
    label: {
      type: String,
      default: '筛选：',
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      list: this.data
    };
  },
  mounted() {

  },
  methods: {
    getItem(index) {
      this.list.map((item, i) => {
        this.$set(item, 'isActive', false);
      });
      this.$set(this.list[index], 'isActive', true);
      this.$emit('get-item', this.list[index]);
    }
  }
};
</script>

<style lang="less">
#eyFilter {
  .label {
    font-weight: bold;
    font-size: 20px;
    height: 30px;
    line-height: 30px;
  }
  .item {
    border-radius: 4px;
    margin: 0 5px;
    cursor: pointer;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 0 25px;
    background: #fff;
    border: 1px solid #000;
    &.active {
      color: #fff;
      background: #2d8cf0;
      border: 1px solid #2d8cf0;
    }
  }
}
</style>
