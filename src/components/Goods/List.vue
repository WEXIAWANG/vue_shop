<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    主体卡片区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!--      表单区域-->
      <el-table :data="goodslist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95">
        </el-table-column>
        <el-table-column prop="goods_weight" width="80" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template v-slot:default="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot:default="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)"
            >删除</el-button
            >
          </template>

        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  computed: {},
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败！')
      }
      this.$message.success('获取商品列表数据成功~')
      // console.log(res.data)
      this.goodslist = res.data.goods
      this.total = res.data.total
      // console.log(this.ListData)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async deleteGoods(id){
      // 弹框询问是否确认删除
      const confirmResult = await this.$confirm(
          '此操作将永久删除该用户, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除！')
      }
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      await this.getGoodsList()
    },
    goAddpage(){
      this.$router.push('/goods/add')
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>
