// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'libs/js/fixIE10.js'
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import { Message,Modal } from 'iview';//全局提示组件


/* 全局css样式 要在App.vue引入 不然webpakc打包就不会自动添加前缀了*/
// import 'iview/dist/styles/iview.css';
// import 'libs/css/my-theme/index.less';
import VueClipboards from 'vue-clipboards';
Vue.use(VueClipboards);
Vue.config.productionTip = false;
Vue.prototype.$Message = Message;
Vue.prototype.$Modal = Modal;

/* 公用组件引入---S */
// import EyUpload from '@/components/Common/EyUpload/EyUpload.vue';
// import EyQuill from '@/components/Common/EyQuill/EyQuill.vue';

/* 公用组件引入---E */

/* 公用组件注册---S */
// Vue.component('EyUpload', EyUpload);
// Vue.component('EyQuill', EyQuill);
/* 公用组件注册---E */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
