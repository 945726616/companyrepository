<template>
  <div class="active">
    <div class="top">tips:上传后默认保存哦</div>
    <el-form :inline="true" :model="imgForm" ref="imgForm" :rules="rules" label-width="100px">
      <el-form-item prop="defaultImage">
        <div style="display:flex">
          <upload
            :x="16"
            :y="9"
            :width="360"
            :height="180"
            avatar
            :default="imgForm.defaultImage&&imgForm.defaultImage!==''?imgForm.defaultImage:''"
            :type="1"
            @callback="uploadCallBack"
          ></upload>
        </div>
        <div>默认背景图</div>
        <el-input v-show="false" v-model.trim="imgForm.defaultImage"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="display:flex">
          <upload
            :x="16"
            :y="9"
            :width="360"
            :height="180"
            avatar
            :default="imgForm.seckillImage&&imgForm.seckillImage!==''?imgForm.seckillImage:''"
            :type="2"
            @callback="uploadCallBack"
          ></upload>
        </div>
        <div>秒杀背景图</div>
        <el-input v-show="false" v-model="imgForm.seckillImage"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="display:flex">
          <upload
            :x="16"
            :y="9"
            :width="360"
            :height="180"
            avatar
            :default="imgForm.assembleImage&&imgForm.assembleImage!==''?imgForm.assembleImage:''"
            :type="3"
            @callback="uploadCallBack"
          ></upload>
        </div>
        <div>拼团背景图</div>
        <el-input v-show="false" v-model="imgForm.assembleImage"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="display:flex">
          <upload
            :x="16"
            :y="9"
            :width="360"
            :height="180"
            avatar
            :default="imgForm.bargainImage&&imgForm.bargainImage!==''?imgForm.bargainImage:''"
            :type="4"
            @callback="uploadCallBack"
          ></upload>
        </div>
        <div>砍价背景图</div>
        <el-input v-show="false" v-model="imgForm.bargainImage"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="display:flex">
          <upload
            :x="16"
            :y="9"
            :width="360"
            :height="180"
            avatar
            :default="imgForm.signImage&&imgForm.signImage!==''?imgForm.signImage:''"
            :type="5"
            @callback="uploadCallBack"
          ></upload>
        </div>
        <div>签到背景图</div>
        <el-input v-show="false" v-model="imgForm.signImage"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="display:flex">
          <upload
            :x="16"
            :y="9"
             :width="360"
            :height="180"
            avatar
            :default="imgForm.activityImage&&imgForm.activityImage!==''?imgForm.activityImage:''"
            :type="6"
            @callback="uploadCallBack"
          ></upload>
        </div>
        <div>双十一/618背景图</div>
        <el-input v-show="false" v-model="imgForm.activityImage"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import upload from '@/components/upload.vue'
import {
  UrluploadFile,
  ApigetBackgroundImageByCompanyNumber,
  ApiinsertBackgroundImage,
  ApiupdateBackgroundImage
} from '@/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    upload
  },
  data () {
    return {
      isAdd: null,
      UrluploadFile,
      imgForm: {
        defaultImage: '',
        seckillImage: '',
        assembleImage: '',
        bargainImage: '',
        activityImage: '',
        signImage: ''
      },

      rules: {
        defaultImage: [
          { required: true, message: '请选择默认背景图', trigger: 'change' }
        ],
        seckillImage: [{ required: false, message: '请选择秒杀背景图' }],
        assembleImage: [{ required: false, message: '请选择拼团背景图' }],
        bargainImage: [{ required: false, message: '请选择砍价背景图' }],
        activityImage: [
          { required: false, message: '请选择双十一或者618背景图' }
        ],
        signImage: [{ required: false, message: '请选择签到背景图' }]
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted () {
    this.getData()
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          await this.addOrUpdate()
          this.resetForm(formName)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async addOrUpdate () {
      let data = {
        companyNumber: this.user.vendorId,
        ...this.imgForm
      }
      let res
      if (this.isAdd !== null) {
        if (this.isAdd) {
          res = await ApiinsertBackgroundImage(data)
        } else {
          res = await ApiupdateBackgroundImage(data)
        }
      }
      console.log(res)
      if (res.code === 200) {
        this.$message({
          message: this.isAdd ? '创建成功' : '修改成功',
          type: 'success'
        })
        this.getData()
      } else {
        this.$message.error(this.isAdd ? '创建失败' : '修改失败')
      }
    },
    async getData () {
      let data = {
        companyNumber: this.user.vendorId
      }
      let res = await ApigetBackgroundImageByCompanyNumber(data)
      console.log(res)
      if (res.code === 200 && res.data) {
        this.isAdd = false

        this.imgForm = { ...res.data }
      } else {
        this.isAdd = true
      }
    },
    uploadCallBack (data) {
      console.log(data)
      switch (data.type) {
        case 1:
          this.$set(this.imgForm, 'defaultImage', data.img)

          break
        case 2:
          this.$set(this.imgForm, 'seckillImage', data.img)

          break
        case 3:
          this.$set(this.imgForm, 'assembleImage', data.img)

          break
        case 4:
          this.$set(this.imgForm, 'bargainImage', data.img)

          break
        case 5:
          this.$set(this.imgForm, 'signImage', data.img)

          break
        case 6:
          this.$set(this.imgForm, 'activityImage', data.img)

          break
      }
      console.log(this.imgForm)
      this.$refs.imgForm.validate(async valid => {
        if (valid) {
          await this.addOrUpdate()
          this.resetForm('imgForm')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.active {
  padding: 10px 0;
  text-align: center;
  .top {
    border: 1px solid #eee;
    background: #fdece8;
    height: 60px;
    line-height: 60px;
    margin-bottom: 20px;
    text-align: left;
    padding-left: 20px;
    font-size: 15px;
    color: #777;
    border-radius: 4px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
