<template>
  <div>
    <div v-if="commentList.length>0">
      <Row class="expand-row" v-for="(item,index) in commentList" :key="item.id">
        <p class="expand-item">{{index + 1}}.{{item.content}}</p>
      </Row>
    </div>
    <div v-else>
      <p style="text-align:center;">暂无评论</p>
    </div>
  </div>
</template>
<style lang="less" scoped>
.expand-row {
	margin: 10px 0;
}
.expand-item{
  padding-left: 10px;
}
</style>

<script>
import { Row } from "iview";
export default {
	props: {
		commentList: Array
	},
	components: {
		Row
	}
};
</script>

