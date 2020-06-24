<template>
  <div class="banner">
    <el-row>
      <el-col :span="10">
        <div class="left">
          <el-carousel :interval="1000" height="160px" class="carousel">
            <el-carousel-item class="banner-box" v-for="(item,index) in bannerList" :key="index">
              <img class="banner-item" :src="item.image" alt />
            </el-carousel-item>
          </el-carousel>
          <ul id="list-box">
            <li v-for="(item,index) in bannerList" :key="index">
              <img class="banner-item" :src="item.image" alt />
              <div class="options">
                <div><el-button @click="del(item.bannerNumber)" type="text">删除</el-button></div>
                <div><el-button @click="edit(index)" type="text">编辑</el-button></div>
              </div>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="center">
          <upload :x="16" :y="9" :drag="true"  @callback="uploadCallBack" ></upload>
         <div class="pre-img"> <img :src="image"   alt=""></div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="40px"
            class="ruleForm"
          >
            <el-form-item label="URL" prop="clickUrl">
              <el-input v-model="ruleForm.clickUrl"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" style="width:100%;" long @click="add('ruleForm')">提交</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import upload from '@/components/upload.vue'
import Sortable from 'sortablejs'
import {
  UrluploadingPictures,
  ApidelBanner,
  ApiupdateBanner,
  ApiinsertBanner,
  ApigetAllBannerByCompanyNumber
} from '@/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    upload
  },
  data () {
    return {
      UrluploadingPictures,
      image: '',
      flag: false,
      bannerList: [],
      sortBannerList: [
        {
          url: 'http://39.108.91.234/imageContent/shop/157585756758146498.png',
          link: ''
        }
      ],
      ruleForm: {
        clickUrl: ''
      },
      rules: {
        clickUrl: [
          {
            required: false,
            type: 'url',
            message: '请输入正确的URL跳转路径',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted () {
    // this.initSortAble();
    this.getBanner()
  },
  methods: {
    uploadCallBack (data) {
      console.log('data', data)
      this.image = data.img
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    async add (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let data = {
            image: this.image,
            companyNumber: this.user.vendorId
          }
          if (this.ruleForm.clickUrl) {
            data.clickUrl = this.ruleForm.clickUrl
          }
          console.log(data)
          let res = await ApiinsertBanner(data)
          console.log(res)
          if (res.code === 200) {
            this.image = ''
            // this.$refs.upload.clearFiles()
            this.resetForm(formName)
            this.getBanner()
            this.$message({
              type: 'success',
              message: '提交成功'
            })
          } else {
            this.$message.error('提交失败')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async del (bannerNumber) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let data = {
            bannerNumber,
            companyNumber: this.user.vendorId
          }
          let res = await ApidelBanner(data)
          console.log(res)
          if (res.code === 200) {
            this.getBanner()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    edit (index) {
      this.$prompt('', '请输入URL', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /http[s]{0,1}:\/\/([\w.]+\/?)\S*/,
        inputErrorMessage: 'URL格式不正确',
        inputValue: this.bannerList[index].clickUrl
          ? this.bannerList[index].clickUrl
          : ''
      })
        .then(async ({ value }) => {
          let banner = { ...this.bannerList[index] }
          delete banner.createTime
          delete banner.image
          delete banner.id
          banner.clickUrl = value
          let res = await ApiupdateBanner(banner)
          console.log(res)
          if (res.code === 200) {
            this.getBanner()
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          } else {
            this.$message.error('修改失败')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    async getBanner () {
      let data = {
        companyNumber: this.user.vendorId
      }
      let res = await ApigetAllBannerByCompanyNumber(data)
      console.log(res)
      if (res.code === 200 && res.data) {
        this.bannerList = res.data.lists
      } else {
        this.bannerList = []
      }
    },
    initSortAble () {
      document.body.ondrop = function (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      let listBox = document.getElementById('list-box')
      Sortable.create(listBox, {
        group: {
          name: 'list',
          pull: true
        },
        animation: 120,
        onUpdate: event => {
          this.$nextTick(() => {
            this.sortBannerList = this.utils.arraySort(
              this.sortBannerList,
              event.newIndex,
              event.oldIndex
            )
          })
        }
      })
    }
    // uploadSucces (res, file) {
    //   console.log('图片上传成功', res, file)
    //   this.image = res.data
    // }
  }
}
</script>
<style lang="scss" scoped>
.banner {
  .left {
    margin: 0 auto;
    overflow: hidden;
    margin: 60px auto;
    box-sizing: border-box;
    border: 1px solid #eee;
    width: 300px;
    height: 540px;
    background: #f8f8f8;
    position: relative;
    top: 0;
    left: 0;
    .carousel {
      width: 300px;
      z-index: 999;
      position: absolute;
      top: 0;
      left: 0;
      height: 160px;
      width: 100%;
      .banner-box {
        height: 160px;
        .banner-item {
          width: 100%;
        }
      }
    }
    ul {
      position: absolute;
      top: 0;
      right: -15px;
      margin-top: 160px;
      width: 315px;
      height: 380px;
      box-sizing: border-box;
      overflow: scroll;

      overflow-x: hidden;
      li {
        background: #fff;
        margin: 5px 0;
        box-sizing: border-box;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .banner-item {
          flex-shrink: 0;
          width: 70%;
          height: 100px;
        }
        .options {
          flex: 1;
          text-align: center;
          i {
            display: block;
            margin: 10px 0;
          }
        }
      }
    }
  }
  .center {
    margin: 60px 20px;
    width: 360px;
    height: 534px;
    .pre-img{
      text-align: left;
      margin-top:10px;
      display: block;
      img{
        width: 100%;
       text-align: left;
      }
    }
    .ruleForm {
      width: 100%;
      margin: 20px 0;
    }
  }
}
</style>
