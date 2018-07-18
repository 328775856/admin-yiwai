<template>
  <Layout>
    <Header>

      <div id="header">
        <div class="inner mui-flex alc">
          <router-link to="/" style="display:flex;">
            <img src="../assets/imgs/logo.png" alt="">
          </router-link>
          <div class="logoWrp cell">
            <router-link to="/">
              <span style="margin-left:20px;" class="">意外艺术管理后台
                <span class="versions">{{versions}}</span>
              </span>
              <img class="betaImg" src="../assets/imgs/beta.png" alt="">
            </router-link>
          </div>
          <div>
            <span style="margin-right:10px;">
              <Icon type="help-circled" color="#fff"></Icon>
              <a href="https://shimo.im/docs/4f0fKoFwgooY7G0C" target="_blank">帮助</a>
            </span>
            <span class="nameWrp">欢迎您，{{userName}}
              <a href="javascript:;" class="alink" @click="signOut">退出</a>
            </span>
          </div>
        </div>
      </div>

    </Header>
    <Layout :style="!isNativeOvh?{position: 'absolute', top: '64px',bottom:'0',left:0,right:0}:{}">
      <!--<Sider collapsible :collapsed-width="78" v-model="isCollapsed">-->
      <Sider>
        <Menu :active-name="active" theme="dark" width="auto" :open-names="['1']" @on-select="onSelect">
          <MenuItem name="1-1">
          <Icon type="document"></Icon>
          <span>首页</span>
          </MenuItem>

          <MenuItem name="1-2">
          <Icon type="stats-bars"></Icon>
          <span>基础数据</span>
          </MenuItem>

          <MenuItem name="1-3">
          <Icon type="ios-book"></Icon>
          <span>内容管理</span>
          </MenuItem>

          <MenuItem name="1-4">
          <Icon type="edit"></Icon>
          <span>首页管理</span>
          </MenuItem>

          <MenuItem name="1-5">
          <Icon type="quote"></Icon>
          <span>评论管理</span>
          </MenuItem>

          <MenuItem name="1-6">
          <Icon type="person"></Icon>
          <span>用户管理</span>
          </MenuItem>

          <MenuItem name="1-8">
          <Icon type="ios-videocam"></Icon>
          <span>素材管理</span>
          </MenuItem>

          <MenuItem name="1-7">
          <Icon type="settings"></Icon>
          <span>系统设置</span>
          </MenuItem>

          <!-- <Submenu name="2">
            <template slot="title">
              <Icon type="ios-location"></Icon>
              艺术地图
            </template>
            <MenuItem name="2-1">一级城市管理</MenuItem>
            <MenuItem name="2-2">二级画派管理</MenuItem>
            <MenuItem name="2-3">三级人物管理</MenuItem>
            <MenuItem name="2-4">四级作品管理</MenuItem>
          </Submenu>

          <Submenu name="3">
            <template slot="title">
              <Icon type="ios-location"></Icon>
              家乡博物馆
            </template>
            <MenuItem name="3-1">家乡文物管理</MenuItem>
            <MenuItem name="3-2">合作品牌管理</MenuItem>
          </Submenu> -->
        </Menu>
      </Sider>

      <Layout :style="{margin: '20px',}">
        <!--<Breadcrumb :style="{margin: '0 0 24px 0'}">-->
        <!--<BreadcrumbItem>Home</BreadcrumbItem>-->
        <!--<BreadcrumbItem>Components</BreadcrumbItem>-->
        <!--<BreadcrumbItem>Layout</BreadcrumbItem>-->
        <!--</Breadcrumb>-->
        <Content>
          <router-view/>
        </Content>
      </Layout>

    </Layout>
    <!-- <Footer class="layout-footer">Copyright &copy; 2018 yiwaiart.com All Rights Reserved.</Footer> -->
  </Layout>
</template>

<script>
import {
  Layout,
  Header,
  Sider,
  Menu,
  MenuItem,
  Icon,
  Footer,
  Submenu,
  Content
} from 'iview'
import util from 'libs/js/util.js'

export default {
  name: 'Home',
  data() {
    return {
      versions: util.versions(),
      routerObj: {
        '1-1': '/Index',
        '1-2': '/Base',
        '1-3': '/Content',
        '1-4': '/Publish',
        '1-5': '/Comment',
        '1-6': '/Customer',
        '1-8': '/Video',
        '1-7': '/System',
        // 艺术地图
        '2-1': '/City',
        '2-2': '/Faction',
        '2-3': '/Base?tab=0',
        '2-4': '/Base?tab=1',

        // 博物馆
        '3-1': '/Culture',
        '3-2': '/Brand'
      },
      haveEyEditorRoute: ['/AddArticle', '/AddCultureDetail'],
      isNativeOvh: false,
      userName: '',
      active: '',
      isCollapsed: false
    }
  },

  mounted() {
    this.userName = sessionStorage.getItem('userName')
    this.isHaveEyEditor()
    this.activeMenu()
  },
  watch: {
    $route(newValue, oldValue) {
      this.isHaveEyEditor()
      this.activeMenu()
    }
  },
  methods: {
    isHaveEyEditor() {
      this.isNativeOvh = false
      const { fullPath } = this.$route
      const { haveEyEditorRoute } = this
      for (let i = 0, len = haveEyEditorRoute.length; i < len; i++) {
        if (fullPath.indexOf(haveEyEditorRoute[i]) != -1) {
          this.isNativeOvh = true
          break
        }
      }
    },
    activeMenu() {
      const { fullPath } = this.$route
      console.log(fullPath, 'fullPath')
      const routerObj = this.routerObj

      let flag = false
      for (let o in routerObj) {
        if (fullPath == '/Base?tab=0') {
          flag = true
          this.active = '2-3'
          console.log(this.active, 'active')
          break
        }
        if (fullPath == '/Base?tab=1') {
          flag = true
          this.active = '2-4'
          console.log(this.active, 'active')
          break
        }

        if (fullPath.indexOf(routerObj[o]) != -1) {
          flag = true
          this.active = o
          break
        }
      }
      if (!flag) {
        this.active = ''
      }
    },
    onSelect(name) {
      const path = this.routerObj[name] || '/Index'
      this.$router.push({ path })
    },
    signOut() {
      sessionStorage.clear()
      this.$router.push({ path: '/Login' })
    }
  },
  components: {
    Layout,
    Header,
    Sider,
    Menu,
    MenuItem,
    Icon,
    Footer,
    Submenu,
    Content
  }
}
</script>

<style lang="less">
@import '../libs/css/common.less';
.ivu-layout-sider {
  overflow: auto !important;
}
.ivu-layout-header {
  padding: 0 24px !important;
}
#header {
  img {
    vertical-align: middle;
    border-radius: 50%;
  }
  .betaImg {
    display: inline-block;
    width: 25px;
    vertical-align: middle;
    margin-left: 5px;
    position: relative;
    // top: 3px;
  }
  position: relative;
  // background-color: #fff;
  // border-top: 4px solid #44b549;
  // border-bottom: 1px solid #d9dadc;
  .inner {
    height: 64px;
    // width: 1200px;
    // margin: 0 auto;
  }
  .logoWrp {
    color: #222;
    line-height: 64px;
    img {
      vertical-align: middle;
      margin-right: 15px;
    }
    span {
      letter-spacing: 0.15em;
      font-size: 25px;
      .versions {
        font-size: 12px;
        color: #8d8d8d;
      }
    }
  }
  .headImgWrp {
    margin-top: 5px;
    width: 50px;
    height: 50px;
    overflow: hidden;
    border-radius: 100%;
    img {
      max-height: 100%;
      max-width: 100%;
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .nameWrp {
    line-height: 64px;
    margin: 0 7px;
    color: #fff;
  }
}

.layout-footer {
  text-align: center;
  position: fixed;
  bottom: 0;
  height: 60px;
  padding: 0 !important;
  width: 100%;
  line-height: 60px;
}

.ivu-layout-sider-trigger {
  bottom: 60px;
}

.layout-con {
  height: 100%;
  width: 100%;
}

.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}

.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}

.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}

.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
