import Vue from 'vue'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'
Vue.use(Router)
const shopTitle = VueCookies.get('userInfo') ? VueCookies.get('userInfo').name : ''
// const userInfo = VueCookies.get('userInfo') ? VueCookies.get('userInfo') : ''
export default new Router({
  // mode: 'history',
  // base: '/web/mall-admin/',
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: '/home',
      component: reslove => { require(['../layout'], reslove) },
      children: [
        {
          path: '/home',
          name: 'home',
          meta: {
            roles: [1, 2],
            title: shopTitle + '商户管理系统 - 首页',
            breadname: '首页'
          },
          component: reslove => { require(['../pages/home'], reslove) }
        },
        {
          path: '/subvendor',
          name: 'subvendor',
          meta: {
            roles: [1],
            title: shopTitle + '商户管理系统 - 商户管理',
            breadname: '商户管理'
          },
          redirect: '/subvendor/list',
          component: reslove => { require(['../pages/product'], reslove) },
          children: [
            {
              path: '/subvendor/list',
              name: 'subvendorlist',
              meta: {
                roles: [1],
                title: shopTitle + '商户管理系统 - 商户列表',
                breadname: '商户列表'
              },
              component: reslove => { require(['../pages/subvendor/list'], reslove) }
            },
            {
              path: '/subvendor/prodlist',
              name: 'subvendorprodlist',
              meta: {
                roles: [1],
                title: shopTitle + '商户管理系统 - 商品审核',
                breadname: '商品审核'
              },
              component: reslove => { require(['../pages/subvendor/prodlist'], reslove) }
            }
          ]
        },
        {
          path: '/product',
          name: 'product',
          meta: {
            roles: [1, 2],
            title: shopTitle + '商户管理系统 - 商品管理',
            breadname: '商品管理'
          },
          redirect: '/product/list',
          component: reslove => { require(['../pages/product'], reslove) },
          children: [
            {
              path: '/product/list',
              name: 'productlist',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 - 商品列表',
                breadname: '商品列表'
              },
              component: reslove => { require(['../pages/product/list'], reslove) }
            },
            {
              path: '/product/addOrUpdate',
              name: 'productAddOrUpdate',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 - 发布商品',
                breadname: '发布商品'
              },
              component: reslove => { require(['../pages/product/addOrUpdate'], reslove) }
            },
            {
              path: '/product/category',
              name: 'category',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -商品分类',
                breadname: '商品分类'
              },
              component: reslove => { require(['../pages/category'], reslove) }
            },
            {
              path: '/product/spec',
              name: 'spec',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -商品规格',
                breadname: '商品规格'
              },
              component: reslove => { require(['../pages/spec'], reslove) }
            }
          ]
        },
        {
          path: '/banner',
          name: 'banner',
          meta: {
            roles: [1, 2],
            title: shopTitle + '商户管理系统 -轮播图',
            breadname: '广告图管理'
          },
          redirect: '/banner/list',
          component: reslove => { require(['../pages/banner'], reslove) },
          children: [
            {
              path: '/banner/list',
              name: 'bannerlist',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -广告图管理',
                breadname: '广告图管理'
              },
              component: reslove => { require(['../pages/banner/list'], reslove) }
            },
            {
              path: '/banner/active',
              name: 'banneractive',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -活动背景图',
                breadname: '活动背景图'
              },
              component: reslove => { require(['../pages/banner/active'], reslove) }
            }
          ]
        },
        {
          path: '/user',
          name: 'user',
          meta: {
            roles: [1, 2],
            title: shopTitle + '商户管理系统 -人员管理',
            breadname: '人员管理'
          },
          redirect: '/user/list',
          component: reslove => { require(['../pages/user'], reslove) },
          children: [
            {
              path: '/user/list',
              name: 'bannerlist',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -用户列表',
                breadname: '用户列表'
              },
              component: reslove => { require(['../pages/user/list'], reslove) }
            }
            // {
            //   path: '/user/role',
            //   name: 'banneractive',
            //   meta: {
            //     role:[1,2],
            //     title: shopTitle + '商户管理系统 -角色列表',
            //     breadname: '角色列表'
            //   },
            //   component: reslove => { require(['../pages/role'], reslove) }
            // }
          ]
        },
        {
          path: '/sign',
          name: 'sign',
          meta: {
            role: [1, 2],
            title: shopTitle + '商户管理系统 -积分签到',
            breadname: '积分签到'
          },
          redirect: '/sign/rule',
          component: reslove => { require(['../pages/sign'], reslove) },
          children: [
            {
              path: '/sign/rule',
              name: 'signrule',
              meta: {
                role: [1, 2],
                title: shopTitle + '商户管理系统 -签到规则',
                breadname: '签到规则'
              },
              component: reslove => { require(['../pages/sign/rule'], reslove) }
            },
            {
              path: '/sign/records',
              name: 'signrecords',
              meta: {
                role: [1, 2],
                title: shopTitle + '商户管理系统 -签到记录',
                breadname: '签到记录'
              },
              component: reslove => { require(['../pages/sign/records'], reslove) }
            }
          ]
        },
        {
          path: '/rebate',
          name: 'rebate',
          meta: {
            roles: [1, 2],
            title: shopTitle + '商户管理系统 -返利管理',
            breadname: '返利管理'
          },
          redirect: '/rebate/rule',
          component: reslove => { require(['../pages/rebate'], reslove) },
          children: [
            {
              path: '/rebate/rule',
              name: 'rebaterule',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -返利规则',
                breadname: '返利规则'
              },
              component: reslove => { require(['../pages/rebate/rule'], reslove) }
            },
            {
              path: '/rebate/records',
              name: 'rebaterecords',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -返利记录',
                breadname: '返利记录'
              },
              component: reslove => { require(['../pages/rebate/records'], reslove) }
            },
            {
              path: '/rebate/proxy',
              name: 'rebateproxy',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -分销管理',
                breadname: '分销管理'
              },
              component: reslove => { require(['../pages/rebate/proxy'], reslove) }
            }
          ]
        },
        {
          path: '/order',
          name: 'order',
          meta: {
            roles: [1, 2],
            title: shopTitle + '商户管理系统 -订单管理',
            breadname: '订单管理'
          },
          redirect: '/order/list',
          component: reslove => { require(['../pages/order'], reslove) },
          children: [
            {
              path: '/order/list',
              name: 'orderlist',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -订单列表',
                breadname: '订单列表'
              },
              component: reslove => { require(['../pages/order/list'], reslove) }
            },
            {
              path: '/order/send',
              name: 'ordersend',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -已发货订单',
                breadname: '已发货订单'
              },
              component: reslove => { require(['../pages/order/send'], reslove) }
            },
            {
              path: '/order/return',
              name: 'orderreturn',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -退款/货订单',
                breadname: '退款/货订单'
              },
              component: reslove => { require(['../pages/order/return'], reslove) }
            }
          ]
        },
        {
          path: '/gift',
          name: 'gift',
          meta: {
            roles: [1],
            title: shopTitle + '商户管理系统 - VIP礼包',
            breadname: 'VIP礼包'
          },
          redirect: '/gift/list',
          component: reslove => { require(['../pages/gift'], reslove) },
          children: [
            {
              path: '/gift/list',
              name: 'giftlist',
              meta: {
                roles: [1],
                title: shopTitle + '商户管理系统 - 礼包列表',
                breadname: '礼包列表'
              },
              component: reslove => { require(['../pages/gift/list'], reslove) }
            },
            {
              path: '/gift/addOrUpdate',
              name: 'giftAddOrUpdate',
              meta: {
                roles: [1],
                title: shopTitle + '商户管理系统 - 发布礼包',
                breadname: '发布礼包'
              },
              component: reslove => { require(['../pages/gift/addOrUpdate'], reslove) }
            }
          ]
        },
        {
          path: '/active',
          name: 'active',
          meta: {
            roles: [1, 2],
            title: shopTitle + '商户管理系统 -营销专区',
            breadname: '营销专区'
          },
          redirect: '/active/seckill',
          component: reslove => { require(['../pages/active'], reslove) },
          children: [
            {
              path: '/active/seckill',
              name: 'orderlist',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -秒杀专区',
                breadname: '秒杀专区'
              },
              component: reslove => { require(['../pages/seckill'], reslove) }
            },
            {
              path: '/active/assemble',
              name: 'orderlist',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -拼团专区',
                breadname: '拼团专区'
              },
              component: reslove => { require(['../pages/assemble'], reslove) }
            },
            {
              path: '/active/bargain',
              name: 'orderlist',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -砍价专区',
                breadname: '砍价专区'
              },
              component: reslove => { require(['../pages/bargain'], reslove) }
            },
            {
              path: '/active/coupon',
              name: 'orderlist',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -优惠券专区',
                breadname: '优惠券专区'
              },
              component: reslove => { require(['../pages/coupon'], reslove) }
            },
            {
              path: '/active/integral',
              name: 'orderlist',
              meta: {
                roles: [1, 2],
                title: shopTitle + '商户管理系统 -积分兑换专区',
                breadname: '积分兑换专区'
              },
              component: reslove => { require(['../pages/integral'], reslove) }
            }
          ]
        }
      ]

    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: reslove => { require(['../pages/login'], reslove) }
    },
    {
      path: '*',
      name: 'error',
      meta: {
        title: '页面不存在'
      },
      component: reslove => { require(['../pages/error'], reslove) }
    }
  ]
})
