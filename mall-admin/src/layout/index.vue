<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <menus :menuList="menuList" ></menus>
    </el-aside>
    <el-container>
      <el-header style="font-size: 12px">
        <myheader></myheader>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// import {mapActions, mapGetters} from 'vuex'
import menus from '../components/menus'
import myheader from '../components/myheader'
export default {
  // computed: {
  //   ...mapGetters(['user'])
  // },
  components: {
    menus,
    myheader
  },
  data () {
    return {
      levelList: [],
      menuList: [
        // {
        //   show: true,
        //   title: "首页",
        //   icon: "home",
        //   path: "/home"
        // },
        {
          roles: [1],
          title: '商户管理',
          icon: 'appstore',
          path: '/subvendor',
          children: [
            {
              roles: [1],
              title: '商户列表',
              icon: 'home',
              path: '/subvendor/list'
            },
            {
              roles: [1],
              title: '商户商品审核',
              icon: 'home',
              path: '/subvendor/prodlist'
            }
          ]
        },
        {
          roles: [1, 2],
          title: '商品管理',
          icon: 'appstore',
          path: '/product',
          children: [
            {
              roles: [1, 2],
              title: '商品分类',
              icon: 'home',
              path: '/product/category'
            },
            {
              roles: [1, 2],
              title: '商品规格',
              icon: 'home',
              path: '/product/spec'
            },
            {
              roles: [1, 2],
              title: '商品列表',
              icon: 'home',
              path: '/product/list'
            }
          ]
        },
        {
          roles: [1, 2],
          title: '订单管理',
          icon: 'appstore',
          path: '/order',
          children: [
            {
              roles: [1, 2],
              title: '商城订单',
              icon: 'home',
              path: '/order/list'
            },
            {
              roles: [1, 2],
              title: '已发货订单',
              icon: 'home',
              path: '/order/send'
            },
            {
              roles: [1, 2],
              title: '退货订单',
              icon: 'home',
              path: '/order/return'
            }
          ]
        },
        {
          roles: [1],
          title: 'VIP礼包',
          icon: 'appstore',
          path: '/gift',
          children: [
            {
              roles: [1],
              title: '礼包列表',
              icon: 'home',
              path: '/gift/list'
            }
          ]
        },
        {
          roles: [1, 2],
          title: '营销专区',
          icon: 'appstore',
          path: '/active',
          children: [
            {
              roles: [1, 2],
              title: '优惠券专区',
              icon: 'home',
              path: '/active/coupon'
            },
            {
              roles: [1, 2],
              title: '砍价专区',
              icon: 'home',
              path: '/active/bargain'
            },

            {
              roles: [1, 2],
              title: '拼团专区',
              icon: 'home',
              path: '/active/assemble'
            },
            {
              roles: [1, 2],
              title: '秒杀专区',
              icon: 'home',
              path: '/active/seckill'
            },
            {
              roles: [1, 2],
              title: '积分兑换专区',
              icon: 'home',
              path: '/active/integral'
            }
          ]
        },
        {
          roles: [1, 2],
          title: '返利管理',
          icon: 'appstore',
          path: '/rebate',
          children: [
            {
              roles: [1, 2],
              title: '返利规则',
              icon: 'home',
              path: '/rebate/rule'
            },
            {
              roles: [1, 2],
              title: '返利记录',
              icon: 'home',
              path: '/rebate/records'
            },
            {
              roles: [1, 2],
              title: '分销管理',
              icon: 'home',
              path: '/rebate/proxy'
            }
          ]
        },
        {
          roles: [1, 2],
          title: '签到管理',
          icon: 'appstore',
          path: '/sign',
          children: [
            {
              roles: [1, 2],
              title: '签到规则',
              icon: 'home',
              path: '/sign/rule'
            },
            {
              roles: [1, 2],
              title: '签到记录',
              icon: 'home',
              path: '/sign/records'
            }
          ]
        },
        {
          roles: [1, 2],
          title: '人员管理',
          icon: 'user',
          path: '/user',
          children: [
            {
              roles: [1, 2],
              title: '用户管理',
              icon: 'user',
              path: '/user/list'
            }
            // {
            //   roles: [1,2],
            //   title: '角色管理',
            //   icon: 'user',
            //   path: '/user/role'
            // }
          ]
        },

        {
          roles: [1, 2],
          title: '广告图管理',
          icon: 'user',
          path: '/banner',
          children: [
            {
              roles: [1, 2],
              title: '轮播图',
              icon: 'home',
              path: '/banner/list'
            },
            {
              roles: [1, 2],
              title: '活动背景图',
              icon: 'home',
              path: '/banner/active'
            }
          ]
        }
      ]
    }
  }
}
</script>
<style lang="scss">
.el-header {
  background-color: #fff;
  color: #333;
  // line-height: 60px;
  border-bottom: 2px solid #eee;
}

.el-aside {
  color: #333;
}
</style>
