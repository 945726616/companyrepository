
<template>
  <div class="login">
    <div class="login-title">
      商城后台管理系统
    </div>
    <div class="main">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>系统登录</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="setPasswordVisible"
          >忘记密码？</el-button>
        </div>
        <el-form :model="formData" :rules="rules" ref="formData">
          <br>
          <el-form-item prop="phone">
            <el-input v-model="formData.phone" size="big" placeholder="账号">
              <template slot="prepend">
                <el-button slot="append" icon="el-icon-user"></el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="formData.password"  size="big" type="password" show-password placeholder="密码">
              <template slot="prepend">
                <el-button slot="append" icon="el-icon-lock"></el-button>
              </template>
            </el-input>
          </el-form-item>
<br>
          <el-form-item>
            <el-button
              type="primary"
              class="submit"
              @click="login('formData')"
              :loading="loading"
               size="big"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="footer">域名备案 &copy;2019-12-16</div>
    <el-dialog
      title="忘记密码"
      width="500px"
      :close-on-click-modal="false"
      :visible.sync="passwordVisible"
    >
      <el-form :model="passForm" :rules="passFormRules" ref="passForm">
        <el-form-item prop="phone">
          <el-input v-model="passForm.phone" placeholder="账号"></el-input>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ApivendorLogin, ApigetVerCode, ApiupdateVendorPassword } from '@/api'
export default {
  components: {},
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
      loading: false,
      error: '',
      errorMessage: '',
      formData: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
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
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
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
            this.$message.success('重置密码成功！')
            this.resetForm(formName)
            this.passwordVisible = false
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
      this.passwordVisible = true
    },
    ...mapActions([
      'setUser' // 将 `setUser` 映射为 `this.$store.dispatch('setUser')`
    ]),
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    async login (formName) {
      this.loading = true
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let data = {
            ...this.formData
          }
          let res = await ApivendorLogin(data)
          this.loading = false
          console.log(res)
          if (res.code === 200 && res.data) {
            this.setUser(res.data)
            this.$router.push('/home')
          } else {
            this.setUser(null)
            this.$message.error(res.msg)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
.login {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  position: relative;
  .login-title{
    background: #ed3f14;
    color: #fff;
    height: 150px;
    text-align: center;
    line-height: 150px;
    font-size: 46px;
    font-weight: bold;
  }
  .main {
    width: 450px;
    margin: 0 auto;
    position: relative;
    top: 30%;
    margin: 0 auto;
    transform: translateY(-50%);
    .submit {
      width: 100%;
    }
    .box-card{
      box-shadow: 100px 100px 100px 0 #ed3f14;
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 40px;
    width: 100vw;
    line-height: 40px;
    color: #999;
    border-top: 1px solid #ddd;
    text-align: center;
    font-size: 12px;
  }
}
</style>
