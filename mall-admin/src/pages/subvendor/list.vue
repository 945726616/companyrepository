<template>
  <div class="subvendor">
    <div class="top-options">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="商户状态">
          <el-select v-model="searchForm.status" @change="selectChange">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item,index) in statusList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户名称">
          <el-input v-model.trim="searchForm.vendorName" placeholder="商户名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model.trim="searchForm.phone" placeholder="商户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="showmask= true">添加商户</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="center-options">

    </div>
    <el-table :data="tableData" ref="multipleTable" border class="table" style="width: 100%">
      <el-table-column prop="vendorLogo" label="公司LOGO" width="100px" >
        <template slot-scope="{row}">
          <img :src="row.vendorLogo" alt="" class="vendorLogo">
        </template>
      </el-table-column>
      <el-table-column prop="vendorName" label="公司/商户名称" ></el-table-column>
       <el-table-column prop="contactPerson" label="联系人"></el-table-column>
      <el-table-column prop="mailbox" label="邮箱"></el-table-column>
      <el-table-column prop="phone" label="联系电话"> </el-table-column>
      <el-table-column prop="address" label="地址">
        <template slot-scope="{row}">{{row.province}}{{row.city}}{{row.district}}{{row.address}}</template>
      </el-table-column>
       <el-table-column prop="status" label="审核状态">
         <template slot-scope="{row}">{{row.status===0?'正常':row.status===1?'待审核':row.status===2?'审核不通过':''}}</template>
       </el-table-column>
      <el-table-column prop="createTime" label="创建时间" >
        <template slot-scope="{row}">
           {{row.vendorCreateTime|timeTrim}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" >
        <template slot-scope="{row,index}">
          <el-button class="table-btn" size="mini" @click="edit(row)">编辑</el-button><br>
          <el-button class="table-btn" size="mini" @click="del(row)">删除</el-button><br>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box">
      <el-pagination
        class="page"
        @size-change="sizeChange"
        @current-change="pageChange"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="num"
        layout="total,sizes, prev, pager, next,jumper"
        :total="total"
      ></el-pagination>
    </div>
      <!-- 新增仓库 -->
    <el-dialog
      :title="form.vendorId?'编辑商户':'新增商户'"
      :visible.sync="showmask"
      @close="closed('form')"
    >
    <P style="color:red"> &nbsp;* 温馨提示：邮箱和电话为登录账号</P>
    <br>
      <el-form :model="form" ref="form" :rules="rules" label-width="120px">
        <el-form-item label="公司/商户名称" prop="vendorName">
          <el-input v-model.trim="form.vendorName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contactPerson">
           <el-input v-model.trim="form.contactPerson" autocomplete="off"></el-input>
        </el-form-item>
 <el-form-item label="电话" prop="phone" v-if="!form.vendorId">
          <el-input v-model.trim="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mailbox" v-if="!form.vendorId">
          <el-input v-model.trim="form.mailbox " autocomplete="off"></el-input>
        </el-form-item>
          <el-form-item label="修改密码"  v-if="form.vendorId">
          <el-switch
            v-model="showPass"
            >
          </el-switch>
          </el-form-item>
         <el-form-item label="登录密码" prop="password" v-if="showPass">
          <el-input v-model.trim="form.password " autocomplete="off" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="公司/商户所在地">
          <el-col :span="7">
            <el-form-item prop="province">
              <el-select v-model.trim="form.province" placeholder="省" @change="provinceChange">
                <el-option
                  :value="item.label"
                  :label="item.label"
                  v-for="(item,index) in provinceList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="7">
            <el-form-item prop="city">
              <el-select v-model.trim="form.city" placeholder="市" @change="cityChange">
                <el-option
                  :value="item.label"
                  :label="item.label"
                  v-for="(item,index) in cityList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="7">
            <el-form-item prop="district">
              <el-select v-model.trim="form.district" prop="district" placeholder="区县">
                <el-option
                  :value="item.label"
                  :label="item.label"
                  v-for="(item,index) in districtList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model.trim="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" prop="vendorLogo">
           <upload
                        :x="16"
                        :y="9"
                        :width="180"
                        :height="180"
                          avatar
                        :default="form.vendorLogo&&form.vendorLogo!==''?form.vendorLogo:''"
                        :type="1"
                        :index="0"
                        @callback="uploadCallBack"
                      ></upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showmask = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增仓库 -->
  </div>
</template>
<script>
import upload from '@/components/upload.vue'
import { regionData } from 'element-china-area-data'
import { ApilistSubVendor, ApiaddSubVendor, ApiupdateSubVendor, ApideleteSubVendor, ApicheckVendorAccount } from '@/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    upload
  },
  computed: {
    ...mapGetters(['user'])
  },
  data () {
    return {
      showPass: true,
      statusList: [
        {label: '全部', value: '-1'},
        {label: '正常', value: '0'},
        {label: '待审核', value: '1'},
        {label: '审核不通过', value: '2'}
      ],
      searchForm: {
        status: '-1',
        productName: '',
        phone: ''
      },
      showmask: false,
      form: {
        parentVendorId: '',
        vendorLogo: '',
        vendorName: '',
        contactPerson: '',
        phone: '',
        mailbox: '',
        province: '',
        city: '',
        district: '',
        address: '',
        password: ''
      },
      rules: {
        vendorName: [{ required: true, message: '请输入公司/商户名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
        vendorLogo: [{ required: true, message: '请上传公司/商户LOGO', trigger: 'blur' }],
        contactPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('手机号不能为空'))
            } else if (!this.utils.phoneRex.test(value)) {
              callback(new Error('请输入正确的手机号码格式'))
            } else {
              let res = await ApicheckVendorAccount({phone: value})
              if (res.code === 400) {
                callback(new Error('手机号码已经存在'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur' }],
        mailbox: [{ required: true, message: '请输入公司邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
          { validator: async (rule, value, callback) => {
            if (value) {
              let res = await ApicheckVendorAccount({mailbox: value})
              if (res.code === 400) {
                callback(new Error('邮箱已经存在'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur' }],

        province: [
          { required: true, message: '请选择省份', trigger: 'change' }
        ],
        city: [{ required: true, message: '请选择城市', trigger: 'change' }],
        district: [{ required: true, message: '请选择区县', trigger: 'change' }],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      provinceList: regionData,
      cityList: [],
      districtList: [],
      radio: '-1',
      page: 1,
      num: 10,
      total: 0,
      tableData: [],
      categoryList: []
    }
  },
  mounted () {
    this.getSubVendors()
  },
  methods: {
    selectChange (val) {
      console.log(val)
      this.form.status = val
      this.search()
    },
    // 删除
    async del (row) {
      this.$confirm('此操作将永久删除该商户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let data = {
            id: row.id,
            vendorId: row.vendorId,
            phone: row.phone
          }
          let res = await ApideleteSubVendor(data)
          console.log(res)
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getSubVendors()
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
    // 添加分类
    async addOrUpdate () {
      let data = {
        ...this.form,
        parentVendorId: this.user.vendorId
      }

      let res
      if (this.form.vendorId) {
        delete data.vendorCreateTime
        delete data.vendorUpdateTime
        delete data.status
        delete data.rejectCause
        delete data.isAdmin
        delete data.businessLicense
        delete data.identityCardFront
        delete data.identityCardVerso
        if (!this.showPass) {
          delete data.password
        }
        res = await ApiupdateSubVendor(data)
      } else {
        res = await ApiaddSubVendor(data)
      }

      console.log(res)
      if (res.code === 200) {
        this.$message({
          message: this.form.vendorId
            ? '修改成功'
            : '添加成功',
          type: 'success'
        })
        this.initForm()
        this.showmask = false
        this.getSubVendors()
      } else {
        this.$message.error(
          this.form.vendorId ? '修改失败' : '添加失败'
        )
      }
    },

    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // alert("submit!");
          await this.addOrUpdate()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    initForm () {
      this.form = {
        parentVendorId: '',
        vendorLogo: '',
        vendorName: '',
        contactPerson: '',
        phone: '',
        mailbox: '',
        province: '',
        city: '',
        district: '',
        address: '',
        password: ''
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    closed (formName) {
      this.resetForm(formName)
      this.initForm()
    },
    // 图片上传
    uploadCallBack (data) {
      console.log('图片上传完成')
      console.log(data)
      this.form.vendorLogo = data.img
    },
    // 省份改变
    provinceChange (val) {
      if (val) {
        let province = this.provinceList.find(el => el.label === val)
        if (province) {
          this.cityList = province.children
          this.districtList = []
          this.form.city = ''
          this.form.district = ''
        }
      }
    },
    // 城市改变
    cityChange (val) {
      if (val) {
        let city = this.cityList.find(el => el.label === val)
        if (city) {
          this.districtList = city.children
          this.form.district = ''
        }
      }
    },
    edit (row) {
      this.form = {...row}
      this.showPass = false
      if (this.form.province) {
        let province = this.provinceList.find(el => el.label === this.form.province)
        this.cityList = province.children
      }
      if (this.form.city) {
        let city = this.cityList.find(el => el.label === this.form.city)
        this.districtList = city.children
      }
      this.showmask = true
    },
    showModel () {
      this.showmask = true
    },

    async getSubVendors () {
      let data = {
        vendorId: this.user.vendorId
      }
      if (this.searchForm.phone !== '') {
        data.phone = this.searchForm.phone
      }
      if (this.searchForm.vendorName !== '') {
        data.vendorName = this.searchForm.vendorName
      }
      if (this.searchForm.status !== '-1') {
        data.status = parseInt(this.searchForm.status)
      }
      let page = { page: 1,
        size: 20}
      let res = await ApilistSubVendor(data, page)
      console.log(res)
      if (res.code === 200 && res.data) {
        this.tableData = res.data
        this.total = parseInt(res.msg)
        console.log(this.tableData)
      } else {
        this.tableData = []
      }
    },
    sizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.num = val
      this.getSubVendors()
    },
    pageChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getSubVendors()
    },
    search () {
      this.page = 1
      this.total = 0
      this.getSubVendors()
    }
  }
}
</script>
<style lang="scss">
.subvendor {
  .vendorLogo{
    height: 80px;
    width: 80px;
  }
  .top-options {
    background: #f8f8f8;
    padding: 30px;
  }
  .center-options {
    margin: 20px 0;
  }
  .page-box {
    margin: 20px 0;
    width: 100%;
    position: relative;
    .options {
      display: inline-block;
    }
    .page {
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
    }
  }
  .table{
.prod-info {
    display: flex;
    .prod-img {
      height: 60px;
      width: 60px;
      margin-right: 10px;
      flex-shrink: 0;
    }

  }
  .cell{
      .table-btn.el-button--mini{

    margin: 3px 0;

    }
   }
  }

}
</style>
