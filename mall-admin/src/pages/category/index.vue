<template>
  <div class="category">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>分类列表</span>
            <el-button v-if="user.parentVendorId==='0'" type="primary" style="float: right;" size="small" @click="showAddDialog">添加分类</el-button>
          </div>
          <el-tree
            ref="tree"
            highlight-current
            :props="defaultProps"
            :data="treeData"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  class="btn"
                  type="text"
                  size="mini"
                  @click="showImg(data.productTypeImage)"
                >查看主图</el-button>
                <template v-if="user.parentVendorId==='0'">
                   <el-button  class="btn" type="text" size="mini" @click="() => update(data)">修改</el-button>
                  <el-button class="btn" type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
                </template>
                <!-- <el-button class="btn" type="text" size="mini" @click="() => append(data)">添加</el-button> -->

              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加分类 -->
    <el-dialog
      :title="categoryForm.productTypeNumber?'编辑分类':'添加分类'"
      :visible.sync="showAdd"
      width="40%"
      @closed="closeed('categoryForm')"
    >
      <div>
        <el-form :model="categoryForm" ref="categoryForm" :rules="rules" label-width="100px">
          <el-form-item label="父级分类" prop="productTypeIsParent">
            <el-select
              v-model.number="categoryForm.productTypeIsParent"
              :disabled="categoryForm.productTypeNumber?true:false"
            >
              <el-option label="父级分类" :value="0"></el-option>
              <el-option
                :label="item.productTypeName"
                :value="item.id"
                v-for="(item,index) in treeData"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="分类名称"
            prop="productTypeName"
            :rules="{
      required: true, message: '分类名称不能为空', trigger: 'blur'
    }"
          >
            <el-input v-model="categoryForm.productTypeName"></el-input>
          </el-form-item>
          <el-form-item label="分类主图" v-if="showAdd">
            <div style="display:flex">
              <upload
                v-if="categoryForm.productTypeIsParent>0"
                :x="1"
                :y="1"
                :width="178"
                :default="categoryForm.productTypeImage?categoryForm.productTypeImage:''"
                avatar
                :type="0"
                :height="178"
                @callback="uploadCallBack"
              ></upload>
              <upload
                v-if="categoryForm.productTypeIsParent===0"
                :x="16"
                :y="9"
                :width="360"
                :default="categoryForm.productTypeImage?categoryForm.productTypeImage:''"
                avatar
                :type="0"
                :height="180"
                @callback="uploadCallBack"
              ></upload>
            </div>
            <el-input v-show="false" v-model="categoryForm.productTypeImage"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeed('categoryForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('categoryForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分类 -->
    <!-- 查看图片 -->
    <el-dialog :visible.sync="dialogVisible" width="550px">
      <div style="text-align:center">
        <img width="100%" :src="dialogImageUrl" alt  />
      </div>
    </el-dialog>
    <!-- 查看图片 -->
  </div>
</template>
<script>
import upload from '@/components/upload.vue'
import {
  UrluploadFile,
  ApiupdateProductType,
  ApideleteProductTypeById,
  ApiaddProductTypeByVendorId,
  ApigetProductType
} from '@/api'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      UrluploadFile,
      dialogVisible: false,
      dialogImageUrl: '',
      showAdd: false,
      treeData: [],
      currentData: null,
      defaultProps: {
        children: 'item',
        label: 'productTypeName'
      },
      categoryForm: {
        productTypeIsParent: 0,
        productTypeImage: '',
        productTypeName: ''
      },

      rules: {
        productTypeName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '分类名称字符长度为 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        productTypeIsParent: [
          { required: true, message: '请选择分类类型', trigger: 'blur' }
        ],
        productTypeImage: [{ required: true, message: '请输入分类主图' }]
      }
    }
  },
  components: {
    upload
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 图片上传
    uploadCallBack (data) {
      console.log('分类图片上传完成')
      console.log(data)
      this.categoryForm.productTypeImage = data.img
    },
    closeed (formName) {
      console.log('关闭回调')
      this.initCategory()
      if (formName) {
        this.resetForm(formName)
      }
      if (formName === 'categoryForm') {
        this.showAdd = false
      }
      if (formName === 'specForm') {
        this.specForm.specName = ''
        this.showSpec = false
      }
    },
    showAddDialog () {
      this.showAdd = true
    },
    // 删除分类
    async del (node, id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let data = {
            id,
            vendorId: this.user.vendorId
          }
          let res = await ApideleteProductTypeById(data)
          console.log(res)
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            const parent = node.parent
            const item = parent.data.item || parent.data
            const index = item.findIndex(d => d.id === id)
            item.splice(index, 1)
            // this.getData();
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

    showImg (path) {
      if (path) {
        this.dialogVisible = true
        this.dialogImageUrl = path
      } else {
        this.dialogImageUrl = ''
        this.dialogVisible = false
        this.$message.error('暂无图片')
      }
    },
    // 查询分类
    async getData () {
      let data = {
        productVendorId: this.user.parentVendorId === '0' ? this.user.vendorId : this.user.parentVendorId
      }
      let res = await ApigetProductType(data)
      console.log(res)
      if (res.code === 200 && res.data) {
        this.treeData = res.data.data
      } else {
        this.treeData = []
      }
    },
    initCategory () {
      this.categoryForm = {
        productTypeIsParent: 0,
        productTypeImage: '',
        productTypeName: ''
      }
    },
    // 添加分类
    async addOrUpdate () {
      let data = {
        ...this.categoryForm,
        productTypeVendorId: this.user.vendorId
      }

      let res
      if (this.categoryForm.productTypeNumber) {
        delete data.item
        delete data.id

        res = await ApiupdateProductType(data)
      } else {
        data.productTypeIsParent =
          this.categoryForm.productTypeIsParent === 0
            ? 0
            : this.categoryForm.productTypeIsParent
        res = await ApiaddProductTypeByVendorId(data)
      }

      console.log(res)
      if (res.code === 200) {
        this.$message({
          message: this.categoryForm.productTypeNumber
            ? '修改成功'
            : '创建成功',
          type: 'success'
        })
        this.initCategory()
        this.showAdd = false
        this.getData()
      } else {
        this.$message.error(
          this.categoryForm.productTypeNumber ? '修改失败' : '创建失败'
        )
      }
    },
    submitForm (formName) {
      console.log(this.categoryForm)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // alert("submit!");
          await this.addOrUpdate()
          this.resetForm(formName)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    removeCategory (item) {
      var index = this.categoryForm.categorys.indexOf(item)
      if (this.categoryForm.categorys.length > 1) {
        if (index !== -1) {
          this.categoryForm.categorys.splice(index, 1)
        }
      }
    },
    update (data) {
      console.log(data)
      this.showAdd = true
      this.categoryForm = { ...data }
    },
    remove (node, data) {
      this.del(node, data.id)
    }
  }
}
</script>
<style  lang="scss" scoped>
.category {
  .custom-tree-node {
    // height: 60px!important;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    // padding: 10px 0;
  }
  .btn {
    margin: 10px;
  }
}

.demo-dynamic {
}
</style>
<style lang="scss">
.category {
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
