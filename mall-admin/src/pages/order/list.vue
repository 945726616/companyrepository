<template>
  <div>
    <div v-for="(item,index) in orders" :key="index">
      <div class="tabel-title">订单编号：191215-177315021933642</div>
      <el-table :data="item.orderDetails" border style="width: 100%">
      <el-table-column prop="name" label="商品信息" width="180"></el-table-column>
      <el-table-column prop="name" label="订单状态" width="180"></el-table-column>
      <el-table-column prop="address" label="数量"></el-table-column>
       <el-table-column prop="address" label="商品总价(元)"></el-table-column>
        <el-table-column prop="address" label="实收金额(元)"></el-table-column>
         <el-table-column prop="address" label="收货人"></el-table-column>
          <el-table-column prop="address" label="买家"></el-table-column>
           <el-table-column prop="address" label="操作"></el-table-column>
    </el-table>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      orders: [
        {name: 'adsad',
          orderDetails: [{
            id: '12987122',
            name: '好滋好味鸡蛋仔',
            category: '江浙小吃、小吃零食',
            desc: '荷兰优质淡奶，奶香浓而不腻',
            address: '上海市普陀区真北路',
            shop: '王小虎夫妻店',
            shopId: '10333'
          },
          {
            id: '12987123',
            name: '好滋好味鸡蛋仔',
            category: '江浙小吃、小吃零食',
            desc: '荷兰优质淡奶，奶香浓而不腻',
            address: '上海市普陀区真北路',
            shop: '王小虎夫妻店',
            shopId: '10333'
          }]}
      ]

    }
  },
  mounted () {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.tabel-title{
  height: 40px;
  line-height: 40px;
  background: #f8f8f8;
  color: #777;
  padding: 0 20px;
  border: 1px solid #eee;
  border-bottom: none;
}
</style>
