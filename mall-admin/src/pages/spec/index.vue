<template>
  <div class="spec">
    <div class="top-options">
      <el-button type="primary" @click="showSpec = true" v-if="user.parentVendorId==='0'">新增规格</el-button>
      <el-input class="option" v-model="specName" placeholder="规格名称" :style="{margin:user.parentVendorId==='0'?'0 10px':'0 10px 0px 0px'}"></el-input>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </div>
    <el-table border :data="tableData" stripe style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="specName" label="规格名称"></el-table-column>
      <!-- <el-table-column prop="specName" label="创建时间"></el-table-column> -->
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showSpecValue(scope.row)">查看规格值</el-button>
          <el-button type="text" size="small" @click="delSpec(scope.row.id)" v-if="user.parentVendorId==='0'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box">
      <el-pagination
        class="page"
        @size-change="pageSizeChange"
        @current-change="pageCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="size"
        layout="total,sizes, prev, pager, next,jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 添加规格 -->
    <el-dialog title="添加规格" :visible.sync="showSpec" width="40%" @closed="closeed('specForm')">
      <div >
        <el-form :model="specForm" ref="specForm" label-width="100px" :rules="specFormRules">
          <el-form-item label="规格名称" prop="specName">
            <el-input v-model.trim="specForm.specName"  maxlength="4"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSpec = false">取 消</el-button>
        <el-button type="primary" @click="submitSpecForm('specForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加规格 -->
    <!-- 查看规格属性值 -->
    <el-dialog
      :title="(currentRow?'【'+currentRow.specName+'】':'查看')+'属性值列表'"
      :visible.sync="showSpecValFlag"
      width="40%"
      @closed="closeed('specValForm')"
    >
      <div>
        <el-form
          :model="specValForm"
          ref="specValForm"
          label-width="100px"
          :rules="specValFormRules"
        >
          <el-form-item label="属性值名称" prop="optionName">
            <el-col :span="18">
              <el-input v-model.trim="specValForm.optionName"  maxlength="8"></el-input>
            </el-col>
            <el-col :span="2" :offset="1">
              <el-button @click="submitSpecValForm('specValForm')">添加</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <el-table border :data="specValData" stripe style="width: 100%">
        <el-table-column prop="optionName" label="属性值名称"></el-table-column>
        <el-table-column label="操作" width="100" v-if="user.parentVendorId==='0'">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="delSpecVal(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
      <el-pagination
        class="page"
        @current-change="valCurrentChange"
        :current-page="valpage"
        :page-size="valsize"
        layout="total, prev, pager, next,jumper"
        :total="valtotal"
      ></el-pagination>
    </div>

    </el-dialog>
    <!-- 查看规格属性值 -->
  </div>
</template>
<script>
import {
  ApigetSpecification,
  ApiaddSpecification,
  ApideleteSpecification,
  ApideleteSpecificationOption,
  ApiaddSpecificationOption,
  ApigetSpecificationOption
} from '@/api'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data () {
    return {
      specName: '',
      page: 1,
      size: 10,
      total: 0,
      showSpec: false,
      specForm: {
        specName: ''
      },
      specFormRules: {
        specName: [
          { required: true, message: '请输入规格名称', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '规格名称字符长度为 1 到 4 个字符',
            trigger: 'blur'
          }
        ]
      },
      tableData: [],
      valpage: 1,
      valsize: 10,
      valtotal: 0,
      specValForm: {
        optionName: ''
      },
      specValFormRules: {
        optionName: [
          { required: true, message: '请输入属性值名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '属性值名称字符长度为 1 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      specValData: [],
      currentRow: null,
      showSpecValFlag: false
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted () {
    this.getSpecList()
  },
  methods: {
    async getSpecValList () {
      if (this.currentRow) {
        let data = { specId: this.currentRow.id, page: this.valpage, num: this.valsize }
        if (this.user.parentVendorId !== '0') {
          data.vendorId = this.user.vendorId
        }
        let res = await ApigetSpecificationOption(data)
        if (res.code === 200 && res.data) {
          this.specValData = res.data
          this.valtotal = parseInt(res.msg)
        } else {
          this.specValData = []
        }
      }
    },
    async showSpecValue (row) {
      this.currentRow = row
      await this.getSpecValList()
      this.showSpecValFlag = true
    },
    async addSpec () {},
    async getSpecList () {
      let res = await ApigetSpecification({page: this.page, num: this.size})
      if (res.code === 200 && res.data) {
        this.tableData = res.data
        this.total = parseInt(res.msg)
      }
    },
    onSubmit () {},
    pageSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.size = val
      this.getSpecList()
    },
    pageCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getSpecList()
    },
    valCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.valpage = val
      this.getSpecValList()
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    closeed (formName) {
      this.resetForm(formName)
      if (formName === 'specValForm') {
        this.valtotal = 0
        this.valpage = 1
        this.currentRow = null
        this.specValForm = {
          optionName: ''
        }
      } else {
        this.specForm.specName = ''
        this.showSpec = false
      }
    },
    delSpecVal (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let res = await ApideleteSpecificationOption({ id })
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getSpecValList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    delSpec (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let res = await ApideleteSpecification({ id })
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getSpecList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    submitSpecValForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let data = {
            optionName: this.specValForm.optionName,
            specId: this.currentRow.id
            // orders: this.utils.getRandom(1, 100)
          }
          if (this.user.parentVendorId !== '0') {
            data.vendorId = this.user.vendorId
          }
          let res = await ApiaddSpecificationOption(data)
          if (res.code === 200) {
            this.getSpecValList()
            this.resetForm(formName)
          } else {
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitSpecForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let data = { specName: this.specForm.specName }
          let res = await ApiaddSpecification(data)
          if (res.code === 200) {
            this.showSpec = false
            this.getSpecList()
            this.resetForm(formName)
          } else {
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.spec {
  .top-options {
    background: #f8f8f8;
    padding: 30px;
    margin-bottom: 30px;
    .option {
      width: 200px;
      margin: 0 10px;
    }
  }
  .page-box {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
