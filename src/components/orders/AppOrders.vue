<template>
<el-card class="box-card">

    <!-- 面包屑导航 -->
    <cus-breadcrumb levl1="订单管理" levl2="订单列表"></cus-breadcrumb>

    <!-- 数据表格 -->
    <el-table :data="orders" style="width: 100%" border v-loading="loading" class="rou" height="450">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column label="是否付款">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.order_pay=='1'">已付款</el-tag>
                <el-tag v-else-if="scope.row.order_pay=='0'">未付款</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column label="创建日期">
            <!-- 日期转换 -->
            <template slot-scope="scope">
                {{scope.row.create_time|moment('YYYY-MM-DD')}}
            </template>
        </el-table-column>

        <el-table-column label="操作">
            <!-- 模板 -->
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" plain circle @click="handleEidt(scope.row.order_id)"></el-button>
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

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[10, 15, 20, 15]" :page-size="pagesize" layout="total,
     sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 修改 对话框 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisibleEdit" width="40%" @close="handleChangCloss()">
        <el-form :model="formdata">
            <el-form-item label="订单号" label-width="120px">
                {{formdata.order_number}}
            </el-form-item>
            <el-form-item label="是否发货" label-width="120px">
                <el-switch v-model="formdata.is_send" active-value="是" inactive-value="否" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item label="订单支付" label-width="120px">
                <el-radio-group v-model="formdata.order_pay">
                    <el-radio label="0">未支付</el-radio>
                    <el-radio label="1">微信</el-radio>
                    <el-radio label="2">支付宝</el-radio>
                    <el-radio label="3">银联</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="订单价格" label-width="120px">
                <el-input v-model="formdata.order_price" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="送货地址" label-width="120px">
                <!-- 省市区 三级联动 -->
                <el-cascader :options="cityOptions" v-model="selelctOptions" clearable></el-cascader>
            </el-form-item>

            <el-form-item label="详细地址" label-width="120px">
                <el-input v-model="address" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="handeleEdit()">修改</el-button>
        </div>
    </el-dialog>

</el-card>

<!-- 分页栏 -->
</template>

<script>
//  省市区 三级联动
import {
    provinceAndCityData,
    regionData,
    provinceAndCityDataPlus,
    regionDataPlus,
    CodeToText,
    TextToCode
} from 'element-china-area-data'
export default {
    data() {
        return {
            orders: [], // 用户数据
            pagenum: 1, // 当前页
            pagesize: 10, // 每页条数
            total: 0, //总条数
            dialogFormVisibleEdit: false, //修改用户对话框
            loading: false, //加载动画
            roles: [], //角色列表
            formdata: {}, //表单
            cityOptions: regionData, //表单
            selelctOptions: [], //选中 地区的值
            is_send: '', //是否发货
            address: '',

        }
    },
    created() {
        //查询数据
        this.lodaData()
    },
    methods: {

        // 修改订单提交
        handeleEdit() {

            //   处理发货状态
            this.formdata.is_send = this.is_send === '是' ? '1' : '0'
            //  支付状态
            if (this.formdata.order_pay === '0') {
                this.formdata.pay_status = '0'
            } else {
                this.formdata.pay_status = '1'
            }
            //  地址 consignee_addr = 省市区 + 详细地址
            this.formdata.consignee_addr = (this.selelctOptions.lenght === 0 ? '' :
                this.selelctOptions.join(',')) + (this.address === '' ? '' : (',' + this.address))
            // 发送请求
            this.$http.put(`orders/${this.formdata.order_id}`, this.formdata)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 201) {
                        this.lodaData()
                        this.$message.success(msg)

                        this.dialogFormVisibleEdit = false
                    } else {
                        this.$message.error();
                        (msg)
                    }
                }).catch(res => {})

        },
        // 打开修改对话框
        handleEidt(id) {
            this.dialogFormVisibleEdit = true
            this.$http.get(`orders/${id}`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.formdata = {
                            order_id: data.order_id,
                            order_number: data.order_number,
                            order_price: data.order_price,
                            is_send: data.is_send,
                            consignee_addr: data.consignee_addr,
                            order_pay: data.order_pay,
                            pay_status: data.pay_status
                        }
                        this.is_send = data.is_send
                        //  处理地址 截取下来的值        
                        // 使用逗号分割 截取 数组前三位值
                        let arr1 = data.consignee_addr === '' ? [] : data.consignee_addr.split(',', 3)
                        // 获取 地址数组最后一个的值
                        let arr2 = data.consignee_addr === '' ? [] : data.consignee_addr.substring(data.consignee_addr.lastIndexOf(',') + 1)
                        this.selelctOptions = arr1
                        this.address = arr2
                    }
                }).catch(res => {})

        },
        // 关闭对话框 清空数据
        handleChangCloss() {
            // 清除表单 数据
            this.formdata = {}

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
            await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
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
                        this.orders = data.goods
                        // 当前页
                        this.pagenum = parseInt(data.pagenum)
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
