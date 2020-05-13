<template>
<el-card class="box-card">
    <!-- 面包屑导航 -->
    <cus-breadcrumb levl1="权限管理" levl2="角色列表"></cus-breadcrumb>

    <el-button class="addbtn" @click="dialogFormVisibleRole=true">添加用户</el-button>

    <!-- 数据表格 -->
    <el-table :data="roles" style="width: 100%" v-loading="loading">
        <!-- 张开行 -->
        <el-table-column type="expand">
            <template slot-scope="props">
                {{props.row.id}}
            </template>
        </el-table-column>

        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
            <!-- 模板 -->
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" plain circle @click="handleEidt(scope.row)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" plain circle @click="handleChangdelete(scope.row.id)">
                </el-button>
                <el-button size="mini" type="success" icon="el-icon-check" plain circle @click="handleChangRole(scope.row.id)"></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 添加用户 对话框 -->
    <el-dialog :title="(!formdata.id?'添加':'修改')+'用户'" :visible.sync="dialogFormVisibleRole" width="40%" @closed="handleChangCloss()">
        <el-form :model="formdata" :rules="rules" ref="ruleRoleForm">
            <el-form-item label="用户名" label-width="120px" prop="roleName">
                <el-input v-model="formdata.roleName" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="用户名" label-width="120px" prop="roleDesc">
                <el-input v-model="formdata.roleDesc" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
            <el-button type="primary" @click="handleRole">确定</el-button>
        </div>
    </el-dialog>

    <!-- 修改 对话框 -->
    <!-- <el-dialog title="修改用户" :visible.sync="dialogFormVisibleEdit" width="40%" @close="handleChangCloss(`ruleFormEdit`)">
        <el-form :model="formdata" :rules="rules" ref="ruleFormEdit">
            <el-form-item label="用户名" label-width="120px">
                <el-input v-model="formdata.username" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="120px" prop="email">
                <el-input v-model="formdata.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" label-width="120px" prop="mobile">
                <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit(`ruleFormEdit`)">修改</el-button>
        </div>
    </el-dialog> -->

    <!-- 操作 -->
    <!-- <el-dialog title="操作" :visible.sync="dialogFormVisibleRole" width="40%" @close="handeleColseRole">
        <el-form :model="formdata">
            <el-form-item label="用户名" label-width="120px">
                {{formdata.username}}
            </el-form-item>

            <el-form-item label="用户名" label-width="120px">
                <el-select v-model="formdata.rid" placeholder="请选择">
                    <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="handleEditRole">修改</el-button>
        </div>
    </el-dialog> -->

</el-card>
</template>

<script>
export default {
    data() {
        return {
            roles: [], //数据展示
            loading: false, //页面加载动画
            dialogFormVisibleRole: false, //打开添加
            formdata: [], //用户数据
            //表单效验
            rules: {
                roleName: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 8,
                        message: '长度在 2 到 8 个字符',
                        trigger: 'blur'
                    }
                ],
                roleDesc: [{
                    required: true,
                    message: '请输入描述',
                    trigger: 'blur'
                }, ]
            },
        }
    },
    created() {
        this.lodaData()
    },
    methods: {
        // 修改
        handleEidt(role) {
            this.dialogFormVisibleRole = true
            //对象引用
            this.formdata = {
                ...role
            }
        },
        //关闭窗口
        handleChangCloss() {
            this.formdata = {} // 清除表单 数据
            this.$refs['ruleRoleForm'].resetFields(); // 清除表单 效验
        },
        // 添加  和修改
        handleRole() {
            this.$refs['ruleRoleForm'].validate((valid) => {
                if (valid) {
                    let req; 
                    if (!this.formdata.id) { // 如果 id =nul 的话就是添加
                         req = this.$http.post(`roles`, this.formdata) 
                    } else {     //修改
                         req = this.$http.put(`roles/${this.formdata.id}`, this.formdata)
                    }
                        req.then(res => {
                            console.log(res);
                            let {
                                data,
                                meta: {
                                    msg,
                                    status
                                }
                            } = res.data
                            if (status === 201 || status === 200) {
                                this.lodaData()
                                this.$message.success(msg)
                                //对话框关闭
                                this.dialogFormVisibleRole = false
                            }
                        }).catch(res => {})

                } else {
                    return false;
                }
            });

        },
        // 删除
        handleChangdelete(id) {
            this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`roles/${id}`)
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
        // 加载角色列表
        async lodaData() {
            //异步请求  ajax （变成同步）
            this.loading = true
            await this.$http.get(`roles`)
                .then(res => {
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.roles = data
                    }
                })
            this.loading = false
        }
    },
}
</script>

<style>
.rou {
    margin: 25px 0;
}

.addbtn {
    margin: 20px 0;
}
</style>
