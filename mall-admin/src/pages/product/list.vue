<template>
  <div class="product">
    <div class="top-options">
      <el-form :inline="true">
        <el-form-item label="商品分类">
          <el-cascader
            clearable
            v-model="productType"
            :options="categoryList"
            :props="{ expandTrigger: 'click' ,emitPath:true,children:'item',label:'productTypeName',value:'id'}"
            @change="categoryChange"
          ></el-cascader>
        </el-form-item>
          <el-form-item label="商品活动">
            <el-select v-model.number="mainGoodsType" @change="search">
              <el-option label="商城热销" :value="1"></el-option>
              <el-option label="新品推荐" :value="2"></el-option>
              <el-option label="特价商品" :value="3"></el-option>
              <el-option label="一元购" :value="4"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="productName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="center-options">
      <el-radio-group v-model="state" @change="stateChange">
        <el-radio-button label="-1" value="-1">全部</el-radio-button>
        <el-radio-button label="1" value="1">在售中</el-radio-button>
        <el-radio-button label="0" value="0">已下架</el-radio-button>
      </el-radio-group>
       <el-radio-group v-model="checkage" @change="checkageChange">
        <el-radio-button label="-1" value="-1">全部</el-radio-button>
        <el-radio-button label="0" value="0">待审核</el-radio-button>
        <el-radio-button label="1" value="1">审核通过</el-radio-button>
        <el-radio-button label="2" value="2">审核驳回</el-radio-button>
      </el-radio-group>
       <el-radio-group v-model="stock" @change="stockChange">
        <el-radio-button label="-1" value="-1">全部</el-radio-button>
        <el-radio-button label="0" value="0">已售罄</el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="toAddOrUpdate">创建商品</el-button>
    </div>
    <el-table
      :data="tableData"
      ref="multipleTable"
      border
      class="table"
      style="width: 100%"
      @selection-change="selectChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="date" label="商品信息" width="180">
        <template slot-scope="{row}">
          <div class="prod-info">
            <el-image :src="row.mainImage" class="prod-img"></el-image>
            <div>
              <div class="prod-name">{{row.productName}}</div>
              <div style="color:red" v-if="row.mainGoodsType">{{row.mainGoodsType===1?'商城热销':row.mainGoodsType===2?'新品推荐':row.mainGoodsType===3?'商城特价':row.mainGoodsType===4?'一元购':row.mainGoodsType===5?'VIP礼包':''}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="groupPrice" label="拼团价格">
        <template
          slot-scope="{row}"
        >{{row.groupPrice!==null&&row.groupPrice!==0?row.groupPrice:'暂未设置'}}</template>
      </el-table-column>
      <el-table-column prop="vipPrice" label="VIP价格">
        <template slot-scope="{row}">{{row.vipPrice!==null&&row.vipPrice!==0?row.vipPrice:'暂未设置'}}</template>
      </el-table-column>
      <el-table-column prop="integralDeduction" label="积分抵扣">
        <template
          slot-scope="{row}"
        >{{row.integralDeduction!==null&&row.integralDeduction!==0?row.integralDeduction:'暂未设置'}}</template>
      </el-table-column>
      <el-table-column prop="allStock" label="总库存"></el-table-column>
      <el-table-column prop="address" label="收藏数"></el-table-column>
      <el-table-column prop="sales" label="销量"></el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="{row}">
          {{row.createTime|timeTrim}}
          <br />
          <el-button type="text" v-if="row.checkage===0">待审核</el-button>
          <el-button type="text" v-if="row.checkage===2">审核未通过</el-button>
          <!-- 审核通过 -->
          <template v-if="row.checkage===1">
            <el-button type="text" v-if="row.state===0">未上架</el-button>
            <el-button type="text" v-if="row.state===1">销售中</el-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="{row,index}">
          <template v-if="row.checkage===1&&row.state===1">
            <el-button class="table-btn" size="mini" type="danger" @click="setSingle(row,0)">下架</el-button>
            <br />
          </template>
          <template v-if="row.checkage===1&&row.state===0">
            <el-button class="table-btn" size="mini" type="primary" @click="setSingle(row,1)">上架</el-button>
            <br />
          </template>
          <el-button v-if="row.state===0" class="table-btn" size="mini" @click="edit(row)">编辑</el-button>
          <br />
          <el-button v-if="row.state!==1" class="table-btn" size="mini" @click="setSingle(row,3)">删除</el-button>
          <br />
          <template v-if="user.parentVendorId!=='0'">
          <el-button
            v-if="row.checkage===2"
            class="table-btn"
            size="mini"
            @click="reCheck(row)"
          >提交审核</el-button>
          <br />
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box">
      <div class="options">
        <el-button type="primary" @click="selectAll">全选</el-button>
        <el-button type="primary" @click="batchUpdateState(1)">批量上架</el-button>
        <el-button type="primary" @click="batchUpdateState(0)">批量下架</el-button>
        <el-button type="primary" @click="batchUpdateState(3)">批量删除</el-button>
      </div>
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
  </div>
</template>
<script>
import {
  ApimangerGetAllProduct,
  ApigetProductType,
  ApimanagerChangeStatus,
  ApimanagerCheckProduct
} from '@/api'
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters(['user'])
  },
  data () {
    return {
      productType: [],
      mainGoodsType: '',
      productName: '',
      state: '-1',
      stock: '-1',
      checkage: '-1',
      page: 1,
      num: 10,
      total: 0,
      tableData: [],
      categoryList: [],
      // 批量修改的商品编号
      batchProducts: []
    }
  },
  created () {
    // 清空数据
    this.setEditProd(null)
  },
  mounted () {
    this.getProducts()
    this.getCategory()
  },
  methods: {
    // 重新审核
    async reCheck (row) {
      let data = {
        checkage: 0,
        productNumber: row.id
      }
      let res = await ApimanagerCheckProduct(data)
      console.log(res)
      if (res.code === 200) {
        this.$message.success('提交审核成功')
        this.getProducts()
      } else {
        this.$message.error('提交审核失败')
      }
    },
    // 单个修改状态
    setSingle (row, state) {
      this.batchProducts = [row]
      this.batchUpdateState(state)
    },
    // 批量修改状态
    async batchUpdateState (state) {
      if (this.batchProducts.length === 0) {
        this.$message.error('请选择商品')
        return false
      }
      let flag = true
      let text = ''
      let info = ''
      this.batchProducts.forEach(el => {
        // 删除
        if (state === 3) {
          //  删除只要不是上架状态都可以删除
          if (el.state === 1) {
            flag = false
            text = '请先下架选择的商品再进行删除'
          }
          info = '删除'
        }
        // 下架
        if (state === 0) {
          info = '下架'
          // 平台
          if (this.user.parentVendorId === '0') {
            if (el.state !== 1) {
              flag = false
              text = '请选择上架的商品进行下架'
            }
          } else {
            // 商户
            if (el.checkage !== 1) {
              flag = false
              text = '请选择通过审核的商品进行下架'
            }
            if (el.state !== 1) {
              flag = false
              text = '请选择上架的商品进行下架'
            }
          }
        }
        // 上架
        if (state === 1) {
          info = '上架'
          // 平台
          if (this.user.parentVendorId === '0') {
            if (el.state !== 0) {
              flag = false
              text = '请选择下架的商品进行上架'
            }
          } else {
            // 商户
            if (el.checkage !== 1) {
              flag = false
              text = '请选择通过审核的商品进行上架'
            }
            if (el.state !== 0) {
              flag = false
              text = '请选择下架的商品进行上架'
            }
          }
        }
      })
      if (!flag) {
        this.$message.error(text)
        return false
      }
      let productIds = this.batchProducts.map(el => el.id)
      let data = {
        state,
        productNumber: productIds.join(',')
      }
      let res = await ApimanagerChangeStatus(data)
      console.log(res)
      if (res.code === 200) {
        this.$message.success(info + '成功')
        this.getProducts()
      } else {
        this.$message.success(info + '失败')
      }
    },
    // 状态选择
    stateChange (val) {
      console.log(val)
      this.search()
    },
    // 审核状态选择
    checkageChange (val) {
      console.log(val)
      this.search()
    },
    // 库存选择
    stockChange (val) {
      console.log(val)
      this.search()
    },
    // 分类改变
    categoryChange (val) {
      console.log(val)
      this.productType = val
      this.search()
    },
    ...mapActions(['setEditProd']),
    // 编辑
    edit (row) {
      this.setEditProd(row)
      this.$router.push('/product/addOrUpdate?type=edit')
    },
    // 查询分类
    async getCategory () {
      let data = {
        productVendorId: this.user.parentVendorId === '0' ? this.user.vendorId : this.user.parentVendorId
      }
      let res = await ApigetProductType(data)
      console.log(res)
      if (res.code === 200 && res.data) {
        this.categoryList = res.data.data
      } else {
        this.categoryList = []
      }
    },
    // 查询商品
    async getProducts () {
      let data = {
        enterpriseId: this.user.vendorId
      }
      let page = {
        page: this.page,
        snumze: this.num
      }
      if (parseInt(this.state) !== -1) {
        data.state = parseInt(this.state)
      }
      if (parseInt(this.checkage) !== -1) {
        data.checkage = parseInt(this.checkage)
      }
      if (parseInt(this.stock) !== -1) {
        data.stock = parseInt(this.stock)
      }
      if (this.productName !== '') {
        data.productName = this.productName
      }
      if (this.mainGoodsType !== '') {
        data.mainGoodsType = this.mainGoodsType
      }
      if (this.productType.length > 0) {
        data.categoryId1 = this.productType[0]
        if (this.productType.length === 2) {
          data.categoryId2 = this.productType[1]
        }
      }
      let res = await ApimangerGetAllProduct(data, page)
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
      this.getProducts()
    },
    pageChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getProducts()
    },
    toAddOrUpdate () {
      this.$router.push('/product/addOrUpdate?type=add')
    },
    search () {
      this.total = 0
      this.page = 1
      this.getProducts()
    },
    selectChange (selection) {
      console.log(selection)
      this.batchProducts = selection
    },
    selectAll () {
      this.$refs.multipleTable.toggleAllSelection()
    }
  },
  beforeDestroy () {}
}
</script>
<style lang="scss">
.product {
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
  .table {
    .prod-info {
      display: flex;
      .prod-img {
        height: 60px;
        width: 60px;
        margin-right: 10px;
        flex-shrink: 0;
      }
      .prod-name{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .cell {
      .table-btn.el-button--mini {
        margin: 3px 0;
      }
    }
  }
}
</style>
