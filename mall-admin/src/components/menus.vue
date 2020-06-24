<template>
  <div class="menu-box">
    <img class="logo" :src="user.vendorLogo?user.vendorLogo:''" alt />
    <el-menu router :default-active="$route.path" :unique-opened="true">
      <div v-for="(item,index) in menuList" :key="index">
        <el-submenu :index="item.path" v-if="item.children&&item.children.length>0&&item.roles.includes(role)" >
          <template slot="title">
            <i class="el-icon-message"></i>
            {{item.title}}
          </template>
          <el-menu-item
          v-if="children.roles.includes(role)"
            v-for="(children,idx) in item.children"
            :key="idx"
            :index="children.path"
          >{{children.title}}</el-menu-item>
        </el-submenu>
        <el-menu-item v-if="!item.children&&item.roles.includes(role)" :index="item.path">{{item.title}}</el-menu-item>
      </div>
    </el-menu>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  props: {
    menuList: {
      type: Array,
      value: []
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  data () {
    return {
      role: null
    }
  },
  created () {
    this.role = this.user.parentVendorId === '0' ? 1 : 2
  },
  mounted () {
    console.log(this.$route)
    console.log(this.role)
  }
}
</script>
<style lang="scss" scoped>
.menu-box {
  border-right: 1px solid #eee;
  box-sizing: border-box;
  background: #fff;
  .logo {
    display: block;
    margin: 0 auto;
    width: 90%;
    height: 90px;
  }
}
</style>
