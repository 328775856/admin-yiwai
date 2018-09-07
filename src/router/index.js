import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: () => import('@/components/Login/Login')
    },
    {
      path: '/Error',
      name: 'Error',
      component: () => import('@/components/Error')
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/components/Home'),
      redirect: '/Index',
      children: [
        {
          path: '/Index',
          name: 'Index',
          component: () => import('@/components/Index/Index'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Base',
          name: 'Base',
          component: () => import('@/components/Base/Base'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Base/AddArt',
          name: 'AddArt',
          component: () => import('@/components/Base/AddArt'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Base/AddOrgan',
          name: 'AddOrgan',
          component: () => import('@/components/Base/AddOrgan'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Base/AddArtProduct',
          name: 'AddArtProduct',
          component: () => import('@/components/Base/AddArtProduct'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Base/RelateArtist',
          name: 'RelateArtist',
          component: () => import('@/components/Base/RelateArtist'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Base/RelateArticle',
          name: 'RelateArticle',
          component: () => import('@/components/Base/RelateArticle'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Base/RelateSignedArtist',
          name: 'RelateSignedArtist',
          component: () => import('@/components/Base/RelateSignedArtist'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Base/RelateArtistExhibition',
          name: 'RelateArtistExhibition',
          component: () => import('@/components/Base/RelateArtistExhibition'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Content/RelateExhibitionArtist',
          name: 'RelateExhibitionArtist',
          component: () =>
            import('@/components/Content/RelateExhibitionArtist'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Base/RelateCollect',
          name: 'RelateCollect',
          component: () => import('@/components/Base/RelateCollect'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Base/RelateExhibition',
          name: 'RelateExhibition',
          component: () => import('@/components/Base/RelateExhibition'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Base/RelateProduct',
          name: 'RelateProduct',
          component: () => import('@/components/Base/RelateProduct'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Publish',
          name: 'Publish',
          component: () => import('@/components/Publish/Publish'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/AddRecommed',
          name: 'AddRecommed',
          component: () => import('@/components/Publish/addRecommed'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Comment',
          name: 'Comment',
          component: () => import('@/components/Comment/CommentTab'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Content',
          name: 'Content',
          component: () => import('@/components/Content/Content'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/AddContent',
          name: 'AddContent',
          component: () => import('@/components/Content/AddContent'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/AddArticle',
          name: 'AddArticle',
          component: () => import('@/components/Content/AddArticle'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/AddArtShow',
          name: 'AddArtShow',
          component: () => import('@/components/Content/AddArtShow'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/SetExhibition',
          name: 'SetExhibition',
          component: () => import('@/components/Content/SetExhibition'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Customer',
          name: 'Customer',
          component: () => import('@/components/Customer/Customer'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/System',
          name: 'System',
          component: () => import('@/components/System/System'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Video',
          name: 'Video',
          component: () => import('@/components/Video/Video'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/City',
          name: 'City',
          component: () => import('@/components/Map/City/City'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/City/SetCity',
          name: 'SetCity',
          component: () => import('@/components/Map/City/SetCity'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/City/RepCityFaction',
          name: 'RepCityFaction',
          component: () => import('@/components/Map/City/RepCityFaction'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/City/RepCityPerson',
          name: 'RepCityPerson',
          component: () => import('@/components/Map/City/RepCityPerson'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Faction',
          name: 'Faction',
          component: () => import('@/components/Map/Faction/Faction'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Faction/SetFaction',
          name: 'SetFaction',
          component: () => import('@/components/Map/Faction/SetFaction'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Faction/RepFactionPerson',
          name: 'RepFactionPerson',
          component: () => import('@/components/Map/Faction/RepFactionPerson'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Faction/RepFactionProduct',
          name: 'RepFactionProduct',
          component: () => import('@/components/Map/Faction/RepFactionProduct'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Person',
          name: 'Person',
          component: () => import('@/components/Map/Person/RepProduct'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Culture',
          name: 'Culture',
          component: () => import('@/components/Museum/Culture/Culture'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/AddCulture',
          name: 'AddCulture',
          component: () => import('@/components/Museum/Culture/AddCulture'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/AddCultureDetail',
          name: 'AddCultureDetail',
          component: () =>
            import('@/components/Museum/Culture/AddCultureDetail'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/CultureContent',
          name: 'CultureContent',
          component: () => import('@/components/Museum/Culture/CultureContent'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Brand',
          name: 'Brand',
          component: () => import('@/components/Museum/Brand/Brand'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Youth',
          name: 'Youth',
          component: () => import('@/components/Activity/Youth/Youth'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/addLongComment',
          name: 'addLongComment',
          component: () => import('@/components/Comment/AddLongComment'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/Fall',
          name: 'Fall',
          component: () => import('@/components/Activity/Fall/Fall')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isLogIn = sessionStorage.getItem('isLogin')
    if (isLogIn !== '1') {
      next({
        path: '/Login',
        // query: {
        //   redirect: to.fullPath
        // }
      })
    } else {
      next()
      // 获取登录后的角色信息
      const role = sessionStorage.getItem('role')
      // 注册后传入相关权限数组
      let arr = ['Index', 'Base', 'Video', 'System', 'Museum', 'Youth', 'Fall', 'Person', 'AddArt']
      // 拦截跳转路由
      if (arr.indexOf(to.name) === -1 && role === '1') {
        // 判断hash值控制刷新后hash重复返回时返回到上一页
        let url = window.location.hash.replace('#', '')
        let reg = new RegExp(`^\/${url}$`)
        if (reg.test(`/${url}`)) {
          router.push({path: '/Error'})
        } else {
          router.replace({path: '/Error'})
        }
        url = null
      }
    }
  } else {
    next()
  }
})

export default router
