<template>
  <div class="outterLoginWrp">
    <div class="login">
      <div class="innerWrp">
        <div class="logoWrp">
          <img src="../../assets/imgs/logo.png" alt="">
        </div>
        <p class="nameWrp">意外艺术管理后台 {{versions}}<img src="../../assets/imgs/beta.png" alt=""></p>
        <div class="errWrp">{{err}}</div>
        <input type="text" class="ipt" placeholder="用户名" v-model="userName">
        <input type="password" class="ipt last" placeholder="密码" v-model="password" @keyup.13="login">
        <div class="f-btn-wrapper tc">
          <Button type="primary" size="large" style="width:100%;" @click="login">登录</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Button
} from 'iview';
import { login } from './Login.service.js';
import util from 'libs/js/util.js';
export default {
  name: 'Login',
  components: {
    Button
  },
  data() {
    return {
      versions: util.versions(),
      userName: '',
      password: '',
      err: '',
      redirect: '/'
    }
  },
  mounted() {
    this.getRedirect();
  },
  watch: {
    '$route'(to, from) {
      this.getRedirect();
    }
  },
  methods: {
    getRedirect() {
      const { query } = this.$route;
      if (query && query.redirect) {
        this.redirect = query.redirect;
      }
    },
    login() {

      if (!this.check()) {
        return;
      }
      const { userName, password } = this;

      const postData = { userName, password };
      login(postData).then(({ code, msg }) => {
        if (+code == 10000) {
          // 存入cookie
          sessionStorage.setItem('isLogin', 1);
          sessionStorage.setItem('userName', userName);
          // 路由跳转
          this.$router.push({ path: `${this.redirect}` });
        } else if (+code == 10001) {
          // 登录失败
          this.err = msg;
        }
      });
    },
    check() {
      const { userName, password } = this;
      let flag = true;
      if (userName == '') {
        this.err = "你还没有输入用户名！"
        flag = false;
      } else {
        if (password == '') {
          this.err = "你还没有输入密码！"
          flag = false;
        }
      }
      return flag;
    }
  }
}
</script>


<style lang="less">
html,
body {
  height: 100%;
}
#app {
  height: 100%;
}
.outterLoginWrp {
  width: 100%;
  height: 100%;
  background: #e7e8eb;
}
.login {
  .ipt {
    border: 0;
    outline: none;
    padding: 0 5px;
  }
  .nameWrp {
    font-size: 20px;
    img {
      display: inline-block;
      width: 25px;
      vertical-align: middle;
    }
    text-align: center;
    padding: 10px 0;
  }
  .logoWrp {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    overflow: hidden;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
    }
  }
  background: #fff;
  border-radius: 10px;
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .innerWrp {
    padding: 20px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .errWrp {
      margin: 5px 0;
      color: #e15f63;
      font-size: 13px;
      margin-top: 5px;
    }
    input {
      width: 100%;
      border: 1px solid #e7e7eb;
      box-sizing: border-box;
      height: 50px;

      &.last {
        margin-top: -1px;
        margin-bottom: 20px;
      }
    }
    h1 {
      font-size: 20px;
      font-weight: 400;
      font-style: normal;
      margin-bottom: 20px;
    }
    .btnLogin {
      width: 100%;
      height: 35px;
      line-height: 35px;
    }
  }
}
</style>
