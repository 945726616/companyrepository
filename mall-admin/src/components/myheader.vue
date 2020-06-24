<template>
  <el-row >
     <el-col  :span="12" class="left">
          <el-breadcrumb class="breadcrumb-box" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              class="breadcrumb"
              v-for="item in levelList"
              :key="item.path"
              :to="item.path"
            >{{item.meta.breadname}}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col :span="12" class="right">
          <el-dropdown  @command="command">
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="updatepass">修改密码</el-dropdown-item>
              <el-dropdown-item command="loginout">安全退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{user.vendorName?user.vendorName:''}}</span>
        </el-col>
          <el-dialog
      title="忘记密码"
      width="500px"
      :close-on-click-modal="false"
      :visible.sync="passwordVisible"
    >
      <el-form :model="passForm" :rules="passFormRules" ref="passForm">
        <el-form-item prop="phone">
          <el-input v-model="passForm.phone" placeholder="账号" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="passForm.password" placeholder="密码" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input v-model="passForm.checkPass" placeholder="确认密码" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-col :span="18">
            <el-input v-model="passForm.code" placeholder="验证码" width="4"></el-input>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-button style="width:100%" @click="sendCode">{{codeTxt}}</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('passForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import { ApigetVerCode, ApiupdateVendorPassword } from '@/api'
export default {
  computed: {
    ...mapGetters(['user'])
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.passForm.checkPass !== '') {
          this.$refs.passForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'))
      } else if (!this.utils.phoneRex.test(value)) {
        callback(new Error('请输入正确的账号格式'))
      } else {
        callback()
      }
    }
    return {
      levelList: [],
      passForm: {
        phone: '',
        password: '',
        checkPass: '',
        code: ''
      },
      passFormRules: {
        phone: [{ validator: validateTel, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        code: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
      },
      passwordVisible: false,
      time: 0,
      timer: null,
      codeTxt: '获取验证码',
      lastTime: null
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  created () {
    this.getBreadcrumb()
  },
  methods: {
    ...mapActions([
      'setUser' // 将 `setUser` 映射为 `this.$store.dispatch('setUser')`
    ]),
    command (val) {
      console.log(val)
      if (val === 'updatepass') {
        this.setPasswordVisible()
      }
      if (val === 'loginout') {
        this.setUser(null)
        this.$router.push('/login')
      }
    },
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      console.log(matched)
      if (matched[0] && matched[0].name.trim() === 'main') {
        matched[0].path = '/'
        matched[0].meta = { breadname: '首页' }
      }
      this.levelList = matched
    },
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let data = {
            phone: this.passForm.phone,
            password: this.passForm.password,
            code: this.passForm.code
          }
          let res = await ApiupdateVendorPassword(data)
          console.log(res)
          if (res.code === 200) {
            this.$message({
              message: '修改密码成功！',
              type: 'success'
            })
            this.setUser(null)
            this.resetForm(formName)
            this.passwordVisible = false
            this.$router.push('/login')
          } else {
            this.$message.error(res.msg)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setPasswordVisible () {
      this.passForm.phone = this.user.phone
      this.passwordVisible = true
    },
    ...mapActions([
      'setUser' // 将 `setUser` 映射为 `this.$store.dispatch('setUser')`
    ]),
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    async sendCode () {
      if (this.passForm.phone === '') {
        this.$message.error('请输入手机号码')
        return false
      }
      if (!this.utils.phoneRex.test(this.passForm.phone)) {
        this.$message.error('请输入正确的手机号码')
        return false
      }
      if (
        (this.codeTxt === '获取验证码' || this.codeTxt === '重新获取') &&
        this.time === 0 &&
        this.timer === null
      ) {
        // 防止点击过快，而请求过程过长导致的重复发送验证码
        if (this.lastTime) {
          let now = new Date().getSeconds()
          if (now - this.lastTime >= 3) {
            // 大于三秒有效
            this.lastTime = new Date().getSeconds()

            await this.getCode()
          }
        } else {
          this.lastTime = new Date().getSeconds()
          // 第一次
          await this.getCode()
        }
      } else {
        this.$message.error('验证码已发送，请注意查收')
      }
    },
    async getCode () {
      const data = {
        phone: this.passForm.phone,
        modelId: 50734
      }
      const res = await ApigetVerCode(data)
      console.log(res)
      // 10-21修改 200，短信发送成功，400短信发送失败，500服务器异常
      if (res.code === 200) {
        this.time = 60
        let _this = this
        this.timer = setInterval(() => {
          if (_this.time === 1) {
            _this.codeTxt = '重新获取'
            _this.time = 0
            if (_this.timer) {
              clearInterval(_this.timer)
              _this.timer = null
            }
            return false
          }
          _this.codeTxt = --_this.time + '秒'
        }, 1000)
      } else {
        this.$message.error(res.msg)
      }
    },

    init () {
      this.handleReset('formPassWord')
      this.time = 0
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.codeTxt = '获取验证码'
      this.lastTime = null
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
  .left {
    text-align: left;
    .breadcrumb-box {
      line-height: 60px;
    }
  }
  .right {
    text-align: right;
    padding-top: 20px;
  }
}
</style>
