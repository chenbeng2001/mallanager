<template>
<el-card class="box-card">

    <!-- 面包屑导航 -->
    <cus-breadcrumb levl1="商品管理" levl2="商品列表"></cus-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="rou">
        <el-col :span="6">
            <el-input v-model="chaxun" placeholder="请输入内容" class="input-with-select">
                <el-button plain @click="lodaData()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-col :span="6">
            <el-button type="success" class="addbtn" @click="$router.push({ path:'/goodsAdd'})">添加用户</el-button>
        </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table :data="goods" style="width: 100%" border v-loading="loading"  height="450">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="650px">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="80px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"  width="145px">
        </el-table-column>
        <el-table-column label="创建日期"  width="145px">
            <!-- 日期转换 -->
            <template slot-scope="scope">
                {{scope.row.add_time|moment('YYYY-MM-DD')}}
            </template>
        </el-table-column>

        <el-table-column label="操作">
            <!-- 模板 -->
            <template slot-scope="scope">

                <el-button size="mini" type="primary" icon="el-icon-edit" plain circle @click="handleEidt(scope.row.goods_id)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" plain circle @click="handleChangdelete(scope.row.goods_id)">
                </el-button>
             
            </template>
        </el-table-column>
    </el-table>

    <!-- 
             分页栏
            size-change   页面显示条数   改变时会触发
            current-change  当前页   改变时会触发
            current-page      当前页码
            page-sizes        每页显示条数
            total            总条数
            layout        组件布局 -->

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[10, 15, 20, 25]" :page-size="pagesize" layout="total,
     sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

   
</el-card>

</template>

<script>
export default {
    data() {
        return {
            goods: [], // 用户数据
            pagenum: 1, // 当前页
            pagesize: 10, // 每页条数
            total: 0, //总条数
            chaxun: '', //查询字段
            loading: false, //加载动画
            formdata: {}, //表单
        }
    },
    created() {
        //查询数据
        this.lodaData()
    },
    methods: {
       
        //修改用户
        handleEidt(id) {
            console.log(id);
            //路由跳转
          this.$router.push({path:'/goodsedit',query: {id:id}})
        },
        //删除用户
        handleChangdelete(id) {
            this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`goods/${id}`)
                    .then(res => {

                        let {
                            data,
                            meta: {
                                msg,
                                status
                            }
                        } = res.data
                        if (status === 200) {
                            this.lodaData()
                            this.$message.success(msg)
                        }
                    }).catch(res => {})
            }).catch(() => {

            });
        },
        //页面大小发生变化
        handleSizeChange(val) {
            this.pagesize = val
            this.lodaData()
        },
        //页面页码发生变化
        handleCurrentChange(val) {
            this.pagenum = val
            this.lodaData()
        },
        //   加载数据查询
        async lodaData() {
            this.loading = true
            await this.$http.get(`goods?query=${this.chaxun}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        console.log(data);
                        
                        this.goods = data.goods
                        // 当前页
                        this.pagenum = data.pagenum
                        //总条数
                        this.total = data.total

                    }
                })
            this.loading = false
        }
    }

}
</script>

<style>
.rou {
    margin: 25px 0;
}

.addbtn {
    margin-left: 15px;
}
</style>
