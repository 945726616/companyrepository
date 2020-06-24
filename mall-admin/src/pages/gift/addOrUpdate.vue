<template>
  <div class="productAddOrUpdate">
    <el-form
      :model="productForm"
      :rules="rules"
      ref="productForm"
      label-width="100px"
      class="demo-productForm"
    >
      <el-row>
        <el-col :span="7">
          <el-form-item label="商品类目" prop="categoryId2">
            <el-cascader
              v-model="productType"
              :options="categoryList"
              :props="{ expandTrigger: 'click' ,emitPath:true,children:'item',label:'productTypeName',value:'id'}"
              @change="categoryChange"
            ></el-cascader>
            <el-input v-show="false" v-model="productForm.categoryId2"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="商品邮费" prop="postage">
            <el-input v-number-input v-model="productForm.postage">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品名称" prop="productName">
            <el-input v-model="productForm.productName" maxlength="60"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品描述" prop="subtitle">
            <el-input type="textarea" :rows="3" v-model="productForm.subtitle"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品主图" prop="mainImage">
            <upload
              :x="1"
              :y="1"
              :width="178"
              :height="178"
              avatar
              :default="productForm.mainImage&&productForm.mainImage!==''?productForm.mainImage:''"
              :type="0"
              @callback="uploadCallBack"
            ></upload>
            <el-input v-show="false" v-model="productForm.mainImage"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品略缩图" prop="subImage">
            <div
              v-if="subImageList"
              v-for="(img,index) in subImageList"
              :key="index"
              class="avatar-box"
            >
              <img :src="img" class="avatar" />
              <i class="el-icon-circle-close close" @click="delImage(index)"></i>
            </div>
            <upload
              :x="1"
              :y="1"
              :width="178"
              :avatar="false"
              :type="2"
              :height="178"
              @callback="uploadCallBack"
            ></upload>
            <el-input v-show="false" v-model="productForm.subImage"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 设置价格等 -->
      <el-row class="bgcolor">
        <el-col :span="24">
          <el-form-item label="价格与库存">
            <div class="paice-amount">

              <!-- 无规格商品价格 -->
              <div class="table" v-if="tableData.length===0">
                <div class="table-box">
                  <div class="tr">
                    <div class="td">库存</div>
                    <div class="td">价格</div>
                  </div>
                  <div class="tr">
                    <div class="td">
                      <div class="table-input">
                        <el-input v-number-input v-model="productForm.stock"></el-input>
                      </div>
                    </div>
                    <div class="td">
                      <div class="table-input">
                        <el-input v-number-input.float="2" v-model="productForm.price"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <tinymce ref="tinymce" :txt="editorContent"></tinymce>
      </div>
      <div class="footer-options">
        <el-button
          class="option-item"
          type="primary"
          @click="submitForm('productForm')"
        >{{$route.query.type === 'edit'?'立即修改':'立即创建'}}</el-button>
        <el-button class="option-item" @click="saveDraft">保存草稿箱</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import upload from '@/components/upload.vue'
import tinymce from '@/components/tinymce.vue'
import {
  UrluploadFile,
  ApigetProductType,
  ApiinsertGoodsAndSpec,
  ApiupdateProductInfo
} from '@/api'

import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    upload,
    tinymce
  },
  data () {
    return {
      // 商品类别
      productType: [],
      // 分类数组
      categoryList: [],
      // 商品虐缩图
      subImageList: [],
      // 上传图片Url
      UrluploadFile,
      // 表格数据
      tableData: [],

      // 表单数据
      productForm: {
        categoryId1: '',
        categoryId2: '',
        productName: '', // 商品名称
        subtitle: '', // 商品描述
        postage: '', // 邮费
        integralDeduction: '', // 积分抵扣
        contents: '', // 富文本
        mainGoodsType: 5, // 商品活动类型
        vipPrice: '', // Vip价格
        price: '', // 商品价格
        stock: '', // 商品库存
        // 商品状态3代表直接上架，1代表审核通过，0代表未审核，2代表审核未通过，4代表下架,测试的话请直接传入数字3
        // state: '',
        mainImage: '', // 商品主图
        subImage: '', // 商品缩率图，详情页轮播需要的，图片直接请以@进行拼接
        groupPrice: '', // 拼团价
        allStock: ''
      },
      // 表单规则
      rules: {
        productName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        categoryId2: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ],
        price: [{ required: true, message: '请填写商品价格', trigger: 'blur' }],
        stock: [{ required: true, message: '请填写商品库存', trigger: 'blur' }],
        mainImage: [
          { required: true, message: '请选择商品主图', trigger: 'change' }
        ],
        subImage: [
          { required: true, message: '请选择商品缩率图', trigger: 'change' }
        ]
      },
      // 富文本内容
      editorContent: '请输入...'
    }
  },
  async mounted () {
    // this.initDraft()

    if (this.$route.query.type === 'edit') {
      this.productForm = { ...this.editVipProd }
      this.editorContent = this.productForm.contents
      this.joinAssemble = !!(
        this.productForm.groupPrice !== null && this.productForm.groupPrice > 0
      )
      this.productType = [
        this.productForm.categoryId1,
        this.productForm.categoryId2
      ]
      this.subImageList = this.productForm.subImage.split('@')
    }

    if (this.$route.query.type === 'add') {
      if (this.draftVipProd) {
        this.productType = this.draftVipProd.productType

        // 是否参与拼团
        this.joinAssemble = this.draftVipProd.joinAssemble
        // 商品虐缩图
        this.subImageList = this.draftVipProd.subImageList
        // 表单数据
        this.productForm = this.draftVipProd.productForm
        // 富文本内容
        this.editorContent = this.draftVipProd.editorContent
      }
    }
    this.getCategory()
  },
  computed: {
    ...mapGetters(['user', 'editVipProd', 'draftVipProd'])
  },
  methods: {
    ...mapActions(['setDraftVipProd']),

    // 保存草稿
    saveDraft () {
      let draftVipProd = {
        // 选中的商品类别
        productType: this.productType,
        // 是否参与拼团
        joinAssemble: this.joinAssemble,
        // 商品虐缩图
        subImageList: this.subImageList,
        // 表格数据
        tableData: this.tableData,
        // 表单数据
        productForm: this.productForm,
        // 富文本内容
        editorContent: this.$refs.tinymce.getContent()

      }
      this.setDraftVipProd(draftVipProd)
    },
    // 删除图片
    delImage (index) {
      this.subImageList.splice(index, 1)
      this.productForm.subImage = this.subImageList.join('@')
    },
    // 图片上传
    uploadCallBack (data) {
      console.log('规格图片上传完成')
      console.log(data)
      switch (data.type) {
        case 0:
          // 商品主图上传
          this.productForm.mainImage = data.img
          break
        case 1:
          // 规格上传图片
          let tableData = JSON.parse(JSON.stringify(this.tableData))
          tableData[data.index].productSpecsImage = data.img
          this.tableData = tableData
          break
        case 2:
          // 商品略缩图上传
          this.subImageList.push(data.img)
          this.productForm.subImage = this.subImageList.join('@')
          break
      }
    },
    async addOrUpdate () {
      let data = {}
      // 商品详情
      data.categoryId1 = this.productForm.categoryId1
      data.categoryId2 = this.productForm.categoryId2
      data.contents = this.$refs.tinymce.getContent()
      data.enterpriseId = this.user.vendorId
      data.mainGoodsType = this.productForm.mainGoodsType
      data.mainImage = this.productForm.mainImage
      data.productName = this.productForm.productName
      data.postage = parseFloat(this.productForm.postage)
      data.subImage = this.productForm.subImage
      data.subtitle = this.productForm.subtitle
      if (this.$route.query.type === 'edit') {
        data.productNumber = this.productForm.productNumber
      }
      // 总库存
      let allStock = 0
      let price = ''
      let stock = ''
      let vipPrice = ''
      let integralDeduction = ''
      let groupPrice = ''
      // 原本的商品价格等信息
      if (this.tableData && this.tableData.length === 0) {
        vipPrice = this.productForm.vipPrice
          ? parseFloat(this.productForm.vipPrice)
          : ''
        price = parseFloat(this.productForm.price)
        stock = parseInt(this.productForm.stock)
        integralDeduction = this.productForm.integralDeduction
          ? parseInt(this.productForm.integralDeduction)
          : ''
        groupPrice = this.productForm.groupPrice
          ? parseFloat(this.productForm.groupPrice)
          : ''
        allStock = parseInt(this.productForm.stock)
      }

      data.price = price
      data.stock = stock
      data.vipPrice = vipPrice
      data.groupPrice = groupPrice
      data.integralDeduction = integralDeduction
      data.allStock = allStock
      console.log(data)
      let res
      if (this.$route.query.type === 'edit') {
        res = await ApiupdateProductInfo(data)
      } else {
        res = await ApiinsertGoodsAndSpec(data)
      }
      console.log(res)
      if (res.code === 200) {
        this.$message.success(
          this.$route.query.type === 'edit' ? '修改成功' : '添加成功'
        )
        this.$router.push('/gift/list')
      }
    },
    // 查询分类
    async getCategory () {
      let data = {
        productVendorId:
          this.user.parentVendorId === '0'
            ? this.user.vendorId
            : this.user.parentVendorId
      }
      let res = await ApigetProductType(data)
      console.log(res)
      if (res.code === 200 && res.data) {
        let result = res.data.data
        let categoryList = result.map(el => {
          if (!el.item) {
            el.disabled = true
          }
          return el
        })
        this.categoryList = categoryList
      } else {
        this.categoryList = []
      }
    },
    // 品类选择改变
    categoryChange (val) {
      console.log(val)
      if (val.length === 2 && val[0] !== '' && val[1] !== '') {
        this.$set(this.productForm, 'categoryId1', val[0])
        this.$set(this.productForm, 'categoryId2', val[1])
      }
    },
    // 提交表单
    submitForm (formName) {
      console.log(this.$refs.tinymce.getContent())
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$refs.tinymce.getContent() === '') {
            this.$message.error('请输入商品详情')
            return false
          }
          // 没有规格组合进行验证
          if (!this.productForm.price || this.productForm.price === '') {
            this.$message.error('请输入商品价格')
            return false
          }
          if (parseFloat(this.productForm.price) === 0) {
            this.$message.error('商品价格需大于0')
            return false
          }
          console.log(this.productForm)
          if (this.productForm.stock === '') {
            this.$message.error('请输入商品库存')
            return false
          }
          this.addOrUpdate()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss">
.productAddOrUpdate {
  margin-bottom: 120px;
  .el-table tbody tr:hover > td {
    background-color: #ffffff !important;
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
  .avatar-box {
    display: inline-block;
    position: relative;
    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 22px;
    }
  }

  .bgcolor {
    background: #f8f8f8;
    padding: 20px 0;
    margin: 10px 0;
    // box-sizing: border-box;
    position: relative;
    .table {
      .table-options {
        margin: 20px 0;
        .table-options-item {
          width: 220px;
          margin: 5px 10px;
        }
        .table-options-btn {
          width: 120px;
          margin: 5px 10px;
        }
      }
      margin-top: 20px;
      .table-input {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        .el-input--small .el-input__inner {
          height: 80px;
          border: none;
        }
        &:hover {
          width: 100%;
          height: 100%;
          line-height: 1;
          border: 1px solid #ed3f14;
        }
      }
      .table-box {
        width: 100%;
        height: 112px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        .tr {
          width: 100%;
          display: flex;
          align-items: center;
          height: 50px;
          box-sizing: border-box;
          &:first-of-type {
            text-align: center;
            background: #fdece8;
            color: #666;
          }
          &:last-of-type {
            border-top: none;
            height: 60px;
            color: #666;
          }
          .td {
            width: 100%;
            line-height: 50px;
            flex: 1;
            position: relative;
            box-sizing: border-box;
            border-left: 1px solid #ccc;
            &:first-of-type {
              border-left: none;
            }
            .table-input {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              position: relative;
              left: 0;
              top: 0;
              .el-input--small .el-input__inner {
                width: 100%;
                height: 60px;
                border: none;
              }
              &:hover {
                width: 100%;
                height: 100%;
                line-height: 1;
                border: 1px solid #ed3f14;
              }
            }
          }
        }
      }
    }
    .del {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 20px;
      color: #ed3f14;
      z-index: 99;
      padding: 20px;
    }
  }
  .footer-options {
    border-top: 1px solid #ccc;
    position: fixed;
    bottom: 0;
    z-index: 1000;
    // margin: 30px 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    background: #fff;
    text-align: left;
    .option-item {
      width: 150px;
    }
  }
  .paice-amount {
    background: #fff;
    padding: 20px;
    margin-right: 20px;
    box-sizing: border-box;
  }
  .rule-list {
    margin: 20px 0;
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
  .rule-item {
    width: 220px;
  }
  .avatar-uploader {
    display: inline-block;
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
    display: inline-block;
    // margin: 0 5px;
  }
}
</style>
