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
          <el-form-item label="商品活动">
            <el-select v-model.number="productForm.mainGoodsType" clearable>
              <el-option label="商城热销" :value="1"></el-option>
              <el-option label="新品推荐" :value="2"></el-option>
              <el-option label="特价商品" :value="3"></el-option>
              <el-option label="一元购" :value="4"></el-option>
            </el-select>
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
      <el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="参与拼团">
              <el-switch v-model="joinAssemble" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="商品规格">
            <!-- <el-button type="primary" round @click="addSku">添加规格</el-button> -->
            <el-select
            :disabled="disabled"
              :multiple-limit="3"
              v-model="selectSpecIds"
              @change="specChange"
              multiple
              placeholder="请选择商品规格，默认无商品规格"
            >
              <el-option
              v-if="specData.length>0"
                v-for="(item,index) in specData"
                :key="index"
                :label="item.specName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 规格名称选择 -->
      <el-row class="bgcolor" v-if="specValueArr.length>0" v-for="(specs,index) in specValueArr" :key="index">
        <el-form-item label="规格名称">
          {{specNameArr[index]&&specNameArr[index].specName?specNameArr[index].specName:''}}
          <el-button type="text" icon="el-icon-edit" @click="showSpec(specNameArr[index],index)">添加</el-button>
          <br />
          <el-checkbox-group v-model="selectSpecValueArr[index]">
            <el-checkbox
              @change="specValuecheck"
              :label="spec.id"
              v-for="(spec,idx) in specs"
              :key="idx"
            >{{spec.optionName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <!-- 批量设置价格等 -->
      <el-row class="bgcolor">
        <el-col :span="24">
          <el-form-item label="价格与库存">
            <div class="paice-amount">
              <div class="table" v-if="selectSpecValueArr.length>0&&tableData.length>0">
                <div>批量设置：在下方栏中选择内容进行批量填充</div>
                <el-row class="table-options">
                  <el-select
                    v-if="item.length>0"
                    v-model="settingArr[index].value"
                    v-for="(item,index) in combineArr"
                    :key="index"
                    class="table-options-item"
                  >
                    <el-option label="全部" value="全部"></el-option>
                    <el-option
                      :label="val.optionName"
                      :value="val.id"
                      v-for="(val,index) in item"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <!-- v-stoke-input 整数钩子 -->
                  <el-input
                    v-number-input
                    placeholder="库存"
                    v-model="setting.stock"
                    class="table-options-item"
                  ></el-input>
                  <el-input
                    v-number-input.float="2"
                    placeholder="价格"
                    v-model="setting.price"
                    class="table-options-item"
                  ></el-input>

                  <el-input
                    v-number-input.float="2"
                    placeholder="VIP价格"
                    v-model="setting.vipPrice"
                    class="table-options-item"
                  ></el-input>

                  <el-input
                    v-if="joinAssemble"
                    v-number-input.float="2"
                    placeholder="拼团价格"
                    v-model="setting.groupPrice"
                    class="table-options-item"
                  ></el-input>
                  <el-input
                    v-number-input
                    placeholder="最高积分抵扣"
                    v-model="setting.integralDeduction"
                    class="table-options-item"
                  ></el-input>
                  <el-button type="primary" class="table-options-btn" @click="submitSetting">确定</el-button>
                </el-row>
                <!-- 规格组合 -->
                <el-table
                  v-if="tableData.length>0"
                  stripe
                  :highlight-current-row="false"
                  :data="tableData"
                  :span-method="spanMethod"
                  border
                  style="width: 100%;"
                >
                  <el-table-column
                    v-if="combineArr.length>0&&item.length>0"
                    :label="item"
                    :prop="item"
                    v-for="(item,index) in mapProps"
                    :key="index"
                  >
                    <template slot-scope="scope">
                      <div>{{scope.row.productSpecifitionPojos[index].optionName}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column class="table-cell" prop="stock" label="库存">
                    <template slot-scope="scope">
                      <!-- <el-input v-number-input v-model="scope.row.stock" class="table-input"></el-input> -->
                      <div class="table-input">
                        <el-input v-number-input v-model="scope.row.stock"></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    class="table-cell"
                    style="position:relative"
                    prop="price"
                    label="价格"
                  >
                    <template slot-scope="scope">
                      <div class="table-input">
                        <el-input v-number-input.float="2" v-model="scope.row.price"></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column class="table-cell" prop="vipPrice" label="VIP价格">
                    <template slot-scope="scope">
                      <div class="table-input">
                        <el-input v-number-input.float="2" v-model="scope.row.vipPrice"></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    class="table-cell"
                    v-if="joinAssemble"
                    prop="groupPrice"
                    label="拼团价格"
                  >
                    <template slot-scope="scope">
                      <div class="table-input">
                        <el-input v-number-input.float="2" v-model="scope.row.groupPrice"></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column class="table-cell" prop="integralDeduction" label="积分抵扣">
                    <template slot-scope="scope">
                      <div class="table-input">
                        <el-input v-number-input v-model="scope.row.integralDeduction"></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column class="table-cell" label="规格图片" width="80">
                    <template slot-scope="{$index,row}">
                      <upload
                        :x="1"
                        :y="1"
                        :width="60"
                        :height="60"
                        avatar
                        :default="row.productSpecsImage&&row.productSpecsImage!==''?row.productSpecsImage:''"
                        :type="1"
                        :index="$index"
                        @callback="uploadCallBack"
                      ></upload>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <!-- 无规格商品价格 -->
              <div class="table" v-if="tableData.length===0">
                <div class="table-box">
                  <div class="tr">
                    <div class="td">库存</div>
                    <div class="td">价格</div>
                    <div class="td">VIP价格</div>
                    <div class="td" v-if="joinAssemble">拼团价格</div>
                    <div class="td">积分抵扣</div>
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
                    <div class="td">
                      <div class="table-input">
                        <el-input v-number-input.float="2" v-model="productForm.vipPrice"></el-input>
                      </div>
                    </div>
                    <div class="td" v-if="joinAssemble">
                      <div class="table-input">
                        <el-input v-number-input.float="2" v-model="productForm.groupPrice"></el-input>
                      </div>
                    </div>
                    <div class="td">
                      <div class="table-input">
                        <el-input v-number-input v-model="productForm.integralDeduction"></el-input>
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
        <el-button class="option-item" type="primary" @click="submitForm('productForm')"> {{$route.query.type === 'edit'?'立即修改':'立即创建'}}</el-button>
        <el-button class="option-item" @click="saveDraft">保存草稿箱</el-button>
      </div>
    </el-form>
      <!-- 添加规格值 -->
    <el-dialog title="添加属性" :visible.sync="showSpecFlag" width="40%" @closed="closeed('specValForm')">
      <div>
        <el-form :model="specValForm" ref="specValForm" label-width="100px" :rules="specValFormRules">
          <el-form-item label="属性名称" prop="optionName">
            <el-input v-model.trim="specValForm.optionName"  maxlength="4"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSpecFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitSpecValForm('specValForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加规格值 -->
  </div>
</template>
<script>
import upload from '@/components/upload.vue'
import tinymce from '@/components/tinymce.vue'
import {
  UrluploadFile,
  ApigetProductType,
  ApiinsertGoodsAndSpec,
  ApiupdateProductInfo,
  ApigetSpecification,
  ApigetSpecificationOption,
  ApiaddSpecificationOption,
  ApiqueryProductSpec
} from '@/api'

import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    upload,
    tinymce
  },
  data () {
    return {
      disabled: false,
      showSpecFlag: false,
      specValForm: {
        optionName: ''
      },
      specValFormRules: {
        optionName: [
          { required: true, message: '请输入属性值名称', trigger: 'blur' },
          {min: 1, max: 10, message: '属性值名称字符长度为 1 到 10 个字符', trigger: 'blur'}
        ]
      },
      currentRow: null,
      currentIndex: null,
      // 选中的商品类别
      productType: [],
      // 商品类别数组
      categoryList: [],
      // 规格数组
      specData: [],
      // 是否参与拼团
      joinAssemble: false,
      // 选中的规格属性数组
      specNameArr: [],
      // 下拉框选择的规格属性的属性值数组
      specValueArr: [],
      // 多选框选择的规格属性值数组
      selectSpecValueArr: [],
      // 更具多选框选择的规格属性值对象数组
      combineArr: [],
      // 选择的规格名称Id
      selectSpecIds: [],
      // 批量设置价格的规格
      settingArr: [],
      // 批量设置的价格等
      setting: {
        price: '',
        vipPrice: '',
        groupPrice: '',
        stock: '',
        integralDeduction: ''
      },
      // 商品虐缩图
      subImageList: [],
      // 上传图片Url
      UrluploadFile,
      // 表格数据
      tableData: [],
      // 编辑的时候的老数据
      oldTableData: [],
      // 表单数据
      productForm: {

        categoryId1: '',
        categoryId2: '',
        productName: '', // 商品名称
        subtitle: '', // 商品描述
        postage: '', // 邮费
        integralDeduction: '', // 积分抵扣
        contents: '', // 富文本
        mainGoodsType: '', // 商品活动类型
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

        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        categoryId2: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
        price: [{ required: true, message: '请填写商品价格', trigger: 'blur' }],
        stock: [{ required: true, message: '请填写商品库存', trigger: 'blur' }],
        mainImage: [{ required: true, message: '请选择商品主图', trigger: 'change' }],
        subImage: [{ required: true, message: '请选择商品缩率图', trigger: 'change' }]
      },
      // 富文本内容
      editorContent: '请输入...',
      // 表格合并的规格名称，以及对应的合并行数
      mapKeys: {},
      // 表格合并的规格名称
      mapProps: []
    }
  },
  async mounted () {
    // this.initDraft()
    if (this.$route.query.type === 'edit') {
      this.productForm = {...this.editProd}
      this.editorContent = this.productForm.contents
      this.joinAssemble = !!(this.productForm.groupPrice !== null && this.productForm.groupPrice > 0)
      this.productType = [this.productForm.categoryId1, this.productForm.categoryId2]
      // this.$set(this.productForm, 'productTypeNumber', this.productType.join(','))
      this.subImageList = this.productForm.subImage.split('@')
      console.log(this.productType, '=======================')
      this.getSkusDetails()
    }
    console.log(this.draftProd)
    if (this.$route.query.type === 'add') {
      if (this.draftProd) {
        // 选中的商品类别数组
        this.productType = this.draftProd.productType
        // 是否参与拼团
        this.joinAssemble = this.draftProd.joinAssemble
        // 选中的规格属性数组
        this.specNameArr = this.draftProd.specNameArr
        // 下拉框选择的规格属性以及属性值数组
        this.specValueArr = this.draftProd.specValueArr
        // 多选框选择的规格属性值数组
        this.selectSpecValueArr = this.draftProd.selectSpecValueArr
        // 根据多选框选择的规格属性值对象数组
        this.combineArr = this.draftProd.combineArr
        // 选择的规格名称Id
        this.selectSpecIds = this.draftProd.selectSpecIds
        // 批量设置价格的规格
        this.settingArr = this.draftProd.settingArr
        // 批量设置的价格等
        this.setting = this.draftProd.setting
        // 商品虐缩图
        this.subImageList = this.draftProd.subImageList
        // 表格数据
        this.tableData = this.draftProd.tableData
        // 表单数据
        this.productForm = this.draftProd.productForm
        // 富文本内容
        this.editorContent = this.draftProd.editorContent
        // 表格合并的规格名称，以及对应的合并行数
        this.mapKeys = this.draftProd.mapKeys
        // 表格合并的规格名称
        this.mapProps = this.draftProd.mapProps
      }
    }
    this.getCategory()
    this.getSpecList()
  },
  computed: {
    ...mapGetters(['user', 'editProd', 'draftProd'])
  },
  methods: {
    ...mapActions(['setDraftProd']),
    // 获取商品规格组合详情
    async getSkusDetails () {
      let res = await ApiqueryProductSpec({productNumber: this.editProd.productNumber})
      console.log(res)
      if (res.code === 200 && res.data) {
        this.disabled = true
        let tableData = res.data
        this.oldTableData = res.data
        let selectSpecValueArr = []
        // 获取商品的规格属性ID
        let selectSpecIds = tableData[0].productSpecifitionPojos.map(el => {
          selectSpecValueArr.push([])
          return el.specId
        })
        this.selectSpecIds = selectSpecIds
        await this.specChange(selectSpecIds)
        tableData.forEach(el => {
          // 组合的VIP价格
          el.vipPrice = el.vipPrice ? '' + el.vipPrice : ''
          // 组合的积分抵扣
          el.integralDeduction = el.integralDeduction ? '' + el.integralDeduction : ''
          // 拼团价
          el.groupPrice = el.groupPrice ? '' + el.groupPrice : ''
          // 获取选中的规格对应的属性ID
          el.productSpecifitionPojos.forEach((el, index) => {
            let flag = selectSpecValueArr[index].includes(el.optionId)
            if (flag) {
              return false
            }
            selectSpecValueArr[index].push(el.optionId)
          })
        })
        this.selectSpecValueArr = selectSpecValueArr
        this.specValuecheck()
        this.tableData = tableData
      }
    },
    // 添加规格属性值
    submitSpecValForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let data = {
            optionName: this.specValForm.optionName,
            specId: this.currentRow.specId
          }
          if (this.user.parentVendorId !== '0') {
            data.vendorId = this.user.vendorId
          }
          let res = await ApiaddSpecificationOption(data)
          if (res.code === 200 && res.data) {
            this.$message.success('添加成功')
            let specVal = {
              ...data,
              specName: this.currentRow.specName,
              id: res.data
            }
            let valueArr = this.specValueArr[this.currentIndex]
            valueArr.push(specVal)
            console.log(this.currentIndex, this.specValueArr, valueArr)
            this.$set(this.specValueArr, this.currentIndex, valueArr)
            this.showSpecFlag = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeed (formName) {
      this.resetForm(formName)
      this.specValForm = {
        optionName: ''
      }
    },
    showSpec (row, index) {
      let currentRow = {specId: row.id,
        specName: row.specName}
      this.showSpecFlag = true
      this.currentRow = currentRow
      this.currentIndex = index
      console.log(currentRow)
    },
    // 获取规格属性
    async getSpecList () {
      let res = await ApigetSpecification({})
      if (res.code === 200 && res.data) {
        this.specData = res.data
      }
    },
    // 递归
    recursion (arr) {
      if (arr.length >= 2) {
        let len1 = arr[0]
        let len2 = arr[1]
        let tempArr = []
        for (let i = 0; i < len1.length; i++) {
          for (let j = 0; j < len2.length; j++) {
            let temp = []
            // 判断数组第一项是数组还是对象
            if (Array.isArray(len1[i])) {
              // 是数组 ，合并数组
              temp = [...len1[i]]
              temp.push(len2[j])
            } else {
              // 是对象 ，添加到数组中
              temp = [len1[i], len2[j]]
            }
            tempArr.push(temp)
          }
        }
        // 组合新的数组
        let newArr = []
        newArr.push(tempArr)
        for (let k = 2; k < arr.length; k++) {
          newArr.push(arr[k])
        }
        // 调用递归
        return this.recursion(newArr)
      } else {
        return arr[0]
      }
    },
    // 规格属性选择框改变
    specValuecheck (val) {
      let selectSpecValueArr = this.selectSpecValueArr
      let specValueArr = this.specValueArr
      console.log('=====================================')
      console.log(selectSpecValueArr, specValueArr)
      // 等待组合的二维数组
      let combineArr = []
      // 多选框选中的规格属性值数组
      selectSpecValueArr.forEach(selectSpecValue => {
        let tempArr = []
        // 选择得属性值大于0的规格进行操作
        if (selectSpecValue.length > 0) {
          // 遍历选择的属性值ID,得到实体对象
          selectSpecValue.forEach(specValue => {
            specValueArr.forEach(specArr => {
              if (specArr.length > 0) {
                specArr.forEach(spec => {
                  if (specValue === spec.id) {
                    tempArr.push({...spec, optionId: spec.id})
                  }
                })
              }
            })
          })
        }
        if (tempArr.length > 0) {
          combineArr.push(tempArr)
        }
      })
      console.log('待组合的匹配好的实体对象数组')
      console.log(combineArr)
      if (combineArr.length === 0) {
        this.tableData = []
        return false
      }
      this.combineArr = combineArr
      // 批量设置初始化
      let settingArr = []
      for (let i = 0; i < combineArr.length; i++) {
        settingArr.push({ value: '全部', label: combineArr[i][0].specName })
      }
      this.settingArr = settingArr
      // 组合
      let specs = this.recursion(combineArr)
      console.log('组合之后的sku列表')
      console.log(specs)
      let tempTableData = []
      specs.forEach(sku => {
        let row = {}
        // row.specs = [...sku]
        // 判断数组第一项是数组还是对象
        if (Array.isArray(sku)) {
          // 是数组 ，合并数组
          row.productSpecifitionPojos = [...sku]
        } else {
          // 是对象 ，添加到数组中
          row.productSpecifitionPojos = [sku]
        }
        // 组合的价格
        row.price = ''
        // 组合的库存
        row.stock = ''
        // 组合的VIP价格
        row.vipPrice = ''
        // 组合的积分抵扣
        row.integralDeduction = ''
        // 拼团价
        row.groupPrice = ''
        // 规格组合图片
        row.productSpecsImage = ''
        tempTableData.push(row)
      })
      // 原来的组合存在并且设置了值，保留
      let tableData = JSON.parse(JSON.stringify(this.tableData))
      console.log('获取之前的table数组')
      console.log(tableData)
      let newTableData = tempTableData.map(el => {
        let ids1 = el.productSpecifitionPojos.map(sku1 => sku1.optionId)
        let row = tableData.find(el2 => {
          let ids2 = el2.productSpecifitionPojos.map(sku2 => sku2.optionId)
          if (ids1.join(',') === ids2.join(',')) {
            return el2
          }
        })
        if (row && row !== undefined) {
          el = JSON.parse(JSON.stringify(row))
        }
        return el
      })
      this.tableData = newTableData
      console.log('组合后的table数组')
      console.log(newTableData)
      // 得到表格中某列需要合并多少行
      this.getSpanArr()
    },
    // 选择的商品标签改变时,根据标签ID查询下面的属性值
    async specChange (ids) {
      let specValueArr = []
      let specNameArr = []
      if (ids && ids.length > 0) {
        for (let i = 0; i < ids.length; i++) {
          let specName = this.specData.find(spec => spec.id === ids[i])
          specNameArr.push(specName)
          let data = {
            specId: ids[i],
            vendorId: this.user.vendorId
          }
          if (this.user.parentVendorId !== '0') {
            data.vendorId = this.user.vendorId
          }
          let res = await ApigetSpecificationOption(data)

          if (res.code === 200 && res.data) {
            specValueArr.push(res.data)
          } else {
            specValueArr.push([])
          }
        }
        this.specNameArr = specNameArr
        this.specValueArr = specValueArr
        if (specValueArr.length > 0) {
          let selectSpecValueArr = []
          for (let i = 0; i < specValueArr.length; i++) {
            selectSpecValueArr.push([])
          }
          this.selectSpecValueArr = selectSpecValueArr
          console.log(specNameArr, specValueArr, selectSpecValueArr, 'yyyyyyyyyyyyyyyyyyyyyyyy')
        }
      } else {
        this.combineArr = []
        this.tableData = []
        this.specValueArr = []
        this.selectSpecValueArr = []
      }
    },
    // 保存草稿
    saveDraft () {
      let draftProd = {
        // 选中的商品类别
        productType: this.productType,
        // 是否参与拼团
        joinAssemble: this.joinAssemble,
        // 选中的规格属性名称数组
        specNameArr: this.specNameArr,
        // 下拉框选择的规格属性以及属性值数组
        specValueArr: this.specValueArr,
        // 多选框选择的规格属性值数组
        selectSpecValueArr: this.selectSpecValueArr,
        // 根据多选框选择的规格属性值对象数组
        combineArr: this.combineArr,
        // 选择的规格名称Id
        selectSpecIds: this.selectSpecIds,
        // 批量设置价格的规格
        settingArr: this.settingArr,
        // 批量设置的价格等
        setting: this.setting,
        // 商品虐缩图
        subImageList: this.subImageList,
        // 表格数据
        tableData: this.tableData,
        // 表单数据
        productForm: this.productForm,
        // 富文本内容
        editorContent: this.$refs.tinymce.getContent(),
        // 表格合并的规格名称，以及对应的合并行数
        mapKeys: this.mapKeys,
        // 表格合并的规格名称
        mapProps: this.mapProps
      }
      this.setDraftProd(draftProd)
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
    // 提交批量设置
    submitSetting () {
      if (
        this.setting.price === '' &&
        this.setting.vipPrice === '' &&
        this.setting.integralDeduction === '' &&
        this.setting.stock === '' &&
        this.setting.groupPrice === ''
      ) {
        this.$message.error('请至少输入一个选项值')
        return false
      }
      console.log(this.settingArr)
      let isAll = true
      this.settingArr.forEach(el => {
        if (el.value !== '全部') {
          isAll = false
        }
      })
      let tableData = JSON.parse(JSON.stringify(this.tableData))
      // 全部
      if (isAll) {
        console.log('全部')
        tableData.forEach(el => {
          if (this.setting.price && this.setting.price !== '') {
            el.price = this.setting.price
          }
          if (this.setting.vipPrice && this.setting.vipPrice !== '') {
            el.vipPrice = this.setting.vipPrice
          }
          if (this.setting.stock && this.setting.stock !== '') {
            el.stock = this.setting.stock
          }
          if (this.setting.groupPrice && this.setting.groupPrice !== '') {
            el.groupPrice = this.setting.groupPrice
          }
          if (
            this.setting.integralDeduction &&
            this.setting.integralDeduction !== ''
          ) {
            el.integralDeduction = this.setting.integralDeduction
          }
        })
      } else {
        tableData.forEach(el => {
          let flag = true
          this.settingArr.forEach(seting => {
            if (seting.value !== '全部') {
              let spec = el.productSpecifitionPojos.find(
                spec => spec.optionId === seting.value
              )
              if (!spec) {
                flag = false
              }
            }
          })
          if (flag) {
            if (this.setting.price && this.setting.price !== '') {
              el.price = this.setting.price
            }
            if (this.setting.vipPrice && this.setting.vipPrice !== '') {
              el.vipPrice = this.setting.vipPrice
            }
            if (this.setting.stock && this.setting.stock !== '') {
              el.stock = this.setting.stock
            }
            if (
              this.setting.groupPrice &&
            this.setting.groupPrice !== ''
            ) {
              el.groupPrice = this.setting.groupPrice
            }
            if (
              this.setting.integralDeduction &&
              this.setting.integralDeduction !== ''
            ) {
              el.integralDeduction = this.setting.integralDeduction
            }
          }
        })
      }
      this.tableData = tableData
    },
    async addOrUpdate () {
      let data = {}
      // 商品详情
      data.categoryId1 = this.productForm.categoryId1
      data.categoryId2 = this.productForm.categoryId2
      data.contents = this.$refs.tinymce.getContent()
      data.enterpriseId = this.user.vendorId
      data.mainGoodsType = this.productForm.mainGoodsType === '' ? 0 : this.productForm.mainGoodsType
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
      // 没有规格数组
      if (this.tableData && this.tableData.length === 0) {
        vipPrice = this.productForm.vipPrice
          ? parseFloat(this.productForm.vipPrice)
          : ''
        price = parseFloat(this.productForm.price)
        stock = parseInt(this.productForm.stock)
        integralDeduction = this.productForm.integralDeduction
          ? parseInt(this.productForm.integralDeduction)
          : ''
        if (this.joinAssemble) {
          groupPrice = this.productForm.groupPrice
            ? parseFloat(this.productForm.groupPrice)
            : ''
        }
        allStock = parseInt(this.productForm.stock)
      }
      // 如果有规格数组
      if (this.tableData && this.tableData.length > 0) {
        let minrow = this.tableData[0]
        this.tableData.forEach(el => {
          allStock += el.stock

          el.price = parseFloat(el.price)
          el.stock = parseInt(el.stock)

          el.vipPrice = el.vipPrice ? parseFloat(el.vipPrice) : ''
          if (this.joinAssemble) {
            el.groupPrice = el.groupPrice ? parseFloat(el.groupPrice) : ''
          } else {
            el.groupPrice = ''
          }
          el.integralDeduction = el.integralDeduction
            ? parseFloat(el.integralDeduction)
            : ''
          if (parseFloat(el.price) < parseFloat(minrow.price)) {
            minrow = el
          }
        })
        vipPrice = minrow.vipPrice ? parseFloat(minrow.vipPrice) : ''
        price = parseFloat(minrow.price)
        stock = parseInt(minrow.stock)
        integralDeduction = minrow.integralDeduction
          ? parseInt(minrow.integralDeduction)
          : ''
        groupPrice = minrow.groupPrice ? parseFloat(minrow.groupPrice) : ''
        allStock = parseInt(minrow.stock)
        data.productSpecsPojos = this.tableData
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
        this.$message.success(this.$route.query.type === 'edit' ? '修改成功' : '添加成功')
        this.$router.push('/product/list')
      }
    },
    // 查询分类
    async getCategory () {
      let data = {
        productVendorId: this.user.parentVendorId === '0' ? this.user.vendorId : this.user.parentVendorId
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
    // 得到表格中某列需要合并多少行
    getSpanArr () {
      // 获取规格数组的长度
      if (this.combineArr.length > 0 && this.tableData.length > 0) {
        // 获取规格数组的名称attbuteName
        let mapProps = this.combineArr.map(el => el[0].specName)
        console.log('mapProps-----------------', mapProps)
        // 得到组合成的列表的长度，初始化合并的行数
        let count = this.tableData.length
        // 存下某规格需要合并的规格名称，以及合并行数
        let mapKeys = {}
        // 遍历规格数组
        for (let i = 0; i < mapProps.length; i++) {
          // 第一项取列表的长度除以规格数组中第一个规格数组的长度，得到合并行数
          // 第二项取第一项合并的行数/规格数组中第二个规格数组的长度，得到合并行数
          // 依次类推
          count = count / this.combineArr[i].length
          // 把对应规格名称以及需要合并的行数保存到对象中
          mapKeys[mapProps[i]] = count
        }
        // 保存所有对应好的键值对
        this.mapKeys = mapKeys
        // 保存所有的规格数组的名称
        this.mapProps = mapProps
      } else {
        // 初始化
        this.mapKeys = {}
        this.mapProps = []
      }
    },
    // 表格合并
    spanMethod ({ row, column, rowIndex, columnIndex }) {
      // if(column.property)
      // 判断该列是否在合并的map数组里面
      if (this.mapProps.includes(column.property)) {
        // 得到合并的行数
        const _row = this.mapKeys[column.property]
        const _col = _row > 0 ? 1 : 0
        // 每隔多少行合并
        if (rowIndex % _row === 0) {
          return {
            rowspan: _row,
            colspan: _col
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
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
      console.log(this.productForm)
      console.log(this.$refs.tinymce.getContent())
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$refs.tinymce.getContent() === '') {
            this.$message.error('请输入商品详情')
            return false
          }
          // 有规格组合进行验证
          if (this.tableData && this.tableData.length > 0) {
            let tableData = this.tableData
            for (let i = 0; i < tableData.length; i++) {
              let el = tableData[i]
              // 没有规格组合进行验证
              if (!el.price || el.price === '') {
                this.$message.error('请输入商品价格')
                return false
              }
              if (parseFloat(el.price) === 0) {
                this.$message.error('商品价格需大于0')
                return false
              }
              // 一元购商品
              if (this.productForm.mainGoodsType === 4) {
                if (parseFloat(el.price) > 1) {
                  this.$message.error('一元购商品价格需小于0')
                  return false
                }
              }
              if (
                el.integralDeduction &&
              el.integralDeduction !== ''
              ) {
                if (
                  parseFloat(el.integralDeduction) >=
                parseFloat(el.price)
                ) {
                  this.$message.error('抵扣积分需小于商品普通价格')
                  return false
                }
              }
              if (this.joinAssemble) {
                if (el.groupPrice === '') {
                  this.$message.error('请输入商品拼团价格')
                  return false
                }
              }
              if (
                el.groupPrice &&
              el.groupPrice !== ''
              ) {
                if (
                  parseFloat(el.groupPrice) >=
                parseFloat(el.price)
                ) {
                  this.$message.error('商品拼团价需小于商品普通价格')
                  return false
                }
              }
              console.log(el.stock)
              if (el.stock === '') {
                this.$message.error('请输入商品库存')
                return false
              }
              if (el.vipPrice && el.vipPrice !== '') {
                if (
                  parseFloat(el.vipPrice) >=
                parseFloat(el.price)
                ) {
                  this.$message.error('商品VIP价格需小于商品普通价格')
                  return false
                }
                if (
                  el.integralDeduction &&
                el.integralDeduction !== ''
                ) {
                  if (
                    parseFloat(el.integralDeduction) >=
                  parseFloat(el.vipPrice)
                  ) {
                    this.$message.error('抵扣积分需小于商品VIP价格')
                    return false
                  }
                }
              }
              if (el.productSpecsImage === '') {
                this.$message.error('请上传规格图片')
                return false
              }
            }
          } else {
            // 没有规格组合进行验证
            if (!this.productForm.price || this.productForm.price === '') {
              this.$message.error('请输入商品价格')
              return false
            }
            if (parseFloat(this.productForm.price) === 0) {
              this.$message.error('商品价格需大于0')
              return false
            }
            // 一元购商品
            if (this.productForm.mainGoodsType === 4) {
              if (parseFloat(this.productForm.price) > 1) {
                this.$message.error('一元购商品价格需小于0')
                return false
              }
            }
            if (
              this.productForm.integralDeduction &&
              this.productForm.integralDeduction !== ''
            ) {
              if (
                parseFloat(this.productForm.integralDeduction) >=
                parseFloat(this.productForm.price)
              ) {
                this.$message.error('抵扣积分需小于商品普通价格')
                return false
              }
            }
            if (this.joinAssemble) {
              if (this.productForm.groupPrice === '') {
                this.$message.error('请输入商品拼团价格')
                return false
              }
            }
            if (
              this.productForm.groupPrice &&
              this.productForm.groupPrice !== ''
            ) {
              if (
                parseFloat(this.productForm.groupPrice) >=
                parseFloat(this.productForm.price)
              ) {
                this.$message.error('商品拼团价需小于商品普通价格')
                return false
              }
            }
            console.log(this.productForm)
            if (this.productForm.stock === '') {
              this.$message.error('请输入商品库存')
              return false
            }
            if (this.productForm.vipPrice && this.productForm.vipPrice !== '') {
              if (
                parseFloat(this.productForm.vipPrice) >=
                parseFloat(this.productForm.price)
              ) {
                this.$message.error('商品VIP价格需小于商品普通价格')
                return false
              }
              if (
                this.productForm.integralDeduction &&
                this.productForm.integralDeduction !== ''
              ) {
                if (
                  parseFloat(this.productForm.integralDeduction) >=
                  parseFloat(this.productForm.vipPrice)
                ) {
                  this.$message.error('抵扣积分需小于商品VIP价格')
                  return false
                }
              }
            }
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
