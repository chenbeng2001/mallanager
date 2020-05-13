<template>
<el-card class="box-card">

    <!-- 面包屑导航 -->
    <cus-breadcrumb levl1="权限管理" levl2="权限列表"></cus-breadcrumb>

    <!-- 数据表格 -->
    <el-table :data="rights" style="margin:30px 0" border height="500" v-loading="loading">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column label="层级">
            <template slot-scope="scope">
                <span v-if="scope.row.level==='0'">一层</span>
                <span v-else-if="scope.row.level==='1'">二层</span>
                <span v-else-if="scope.row.level==='2'">三层</span>
            </template>
        </el-table-column>

    </el-table>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            rights: [],
            loading: false,
        }
    },
    created() {
        this.lodginata()
    },
    methods: {

        async lodginata() {
            this.loading = true

            await this.$http.get(`rights/list`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.rights = data
                        console.log(this.rights);

                    }
                })
                   this.loading = false
        }
    },
}
</script>

<style>

</style>
