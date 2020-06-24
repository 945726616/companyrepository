<template>
  <div class="prodlist">
    <div class="top-options">
      <el-form :inline="true">
        <el-form-item label="商户">
          <el-select v-model.number="parentVendorId" >
              <el-option :label="item.vendorName" :value="item.vendorId" v-for="(item,index) in subVendorList" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select v-model.number="state" >
              <el-option :label="item.label" :value="item.value" v-for="(item,index) in stateList" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model.number="checkage" >
              <el-option :label="item.label" :value="item.value" v-for="(item,index) in checkageList" :key="index"></el-option>
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
              <div class="prod-name">{{row.productName}}商品类目商品类目商品类目商品类目商品类目商品类目商品类目商品类目商品类目商品类目</div>
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
          <el-button type="text" v-if="row.checkage===1">审核通过</el-button>
          <el-button type="text" v-if="row.checkage===2">审核未通过</el-button>
          <!-- 审核通过 -->
          <!-- <template v-if="row.checkage===1">
            <el-button type="text" v-if="row.state===0">未上架</el-button>
            <el-button type="text" v-if="row.state===1">销售中</el-button>
          </template> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="{row,index}">
          <template v-if="row.checkage===0||row.checkage===2">
            <el-button class="table-btn" size="mini" type="danger" @click="setSingle(row,1)">通过</el-button>
            <br />
          </template>
          <template v-if="row.checkage===0||row.checkage===1">
            <el-button class="table-btn" size="mini" type="primary" @click="setSingle(row,2)">驳回</el-button>
            <br />
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box">
      <div class="options">
        <el-button type="primary" @click="selectAll">全选</el-button>
        <el-button type="primary" @click="batchUpdateState(1)">批量通过</el-button>
        <el-button type="primary" @click="batchUpdateState(2)">批量驳回</el-button>
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
  ApimanagerGetAllVendorProduct,
  ApimanagerCheckProduct,
  ApilistSubVendor
} from '@/api'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['user'])
  },
  data () {
    return {
      parentVendorId: 0,
      productName: '',
      state: -1,
      stateList: [{label: '全部', value: -1}, {label: '上架', value: 1}, {label: '下架', value: 2}],
      checkage: -1,
      checkageList: [{label: '全部', value: -1}, {label: '待审核', value: 0}, {label: '审核通过', value: 1}, {label: '审核驳回', value: 2}],
      page: 1,
      num: 10,
      total: 0,
      tableData: [],
      // 批量修改的商品编号
      batchProducts: [],
      // 子商户
      subVendorList: []
    }
  },
  mounted () {
    this.getSubVendors()
    this.getSubProducts()
    this.getCategory()
  },
  methods: {

    // 单个修改状态
    setSingle (row, checkage) {
      this.batchProducts = [row]
      this.batchUpdateState(checkage)
    },
    // 批量修改状态
    async batchUpdateState (checkage) {
      if (this.batchProducts.length === 0) {
        this.$message.error('请选择商品')
        return false
      }
      let flag = true
      let text = ''
      let info = ''
      this.batchProducts.forEach(el => {
        // 审核通过
        if (checkage === 1) {
          info = '审核通过'
          if (el.checkage === 1) {
            flag = false
            text = '请选择待审核或者驳回的商品进行审核'
          }
        }
        // 审核通过
        if (checkage === 2) {
          info = '审核驳回'
          if (el.checkage === 2) {
            flag = false
            text = '请选择待审核或者通过审核的商品进行驳回'
          }
        }
      })
      if (!flag) {
        this.$message.error(text)
        return false
      }
      let productIds = this.batchProducts.map(el => el.id)
      let data = {
        checkage,
        productNumber: productIds.join(',')
      }
      let res = await ApimanagerCheckProduct(data)
      console.log(res)
      if (res.code === 200) {
        this.$message.success(info + '成功')
        this.getSubProducts()
      } else {
        this.$message.success(info + '失败')
      }
    },
    // 状态选择
    stateChange (val) {
      console.log(val)
      this.search()
    },
    // 查询子商户
    async getSubVendors () {
      let data = {
        vendorId: this.user.vendorId
      }
      let res = await ApilistSubVendor(data)
      console.log(res)
      if (res.code === 200 && res.data) {
        this.subVendorList = [{vendorId: 0, vendorName: '全部商户'}, ...res.data]
        console.log(this.subVendorList)
      } else {
        this.subVendorList = []
      }
    },
    // 查询商品
    async getSubProducts () {
      let data = {
        enterpriseId: this.user.vendorId,
        parentVendorId: this.parentVendorId
      }
      let page = {
        page: this.page,
        num: this.num
      }
      if (this.state !== -1) {
        data.state = this.state
      }
      if (this.checkage !== -1) {
        data.checkage = this.checkage
      }
      if (this.productName !== '') {
        data.productName = this.productName
      }
      let res = await ApimanagerGetAllVendorProduct(data, page)
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
    },
    pageChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
    },
    toAddOrUpdate () {
      this.$router.push('/product/addOrUpdate?type=add')
    },
    search () {
      this.total = 0
      this.page = 1
      this.getSubProducts()
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
.prodlist {
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
