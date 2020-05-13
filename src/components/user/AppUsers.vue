<template>
<el-card class="box-card">

    <!-- 面包屑导航 -->
       <cus-breadcrumb levl1="用户管理" levl2="用户列表"></cus-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="rou">
        <el-col :span="6">
            <el-input v-model="chaxun" placeholder="请输入内容" class="input-with-select">
                <el-button plain @click="lodaData()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-col :span="6">
            <el-button type="success" class="addbtn" @click="dialogFormVisibleAdd=true">添加用户</el-button>
        </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table :data="users" style="width: 100%" border  v-loading="loading">
        <el-table-column type="index" label="#">
        </el-table-column>

        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column label="创建日期">
            <!-- 日期转换 -->
            <template slot-scope="scope">
                {{scope.row.create_time|moment('YYYY-MM-DD')}}
            </template>
        </el-table-column>

        <el-table-column label="用户状态">
            <!-- 模板 -->
            <template slot-scope="scope">
                <!-- 开关 -->
                <!-- 获取当前行( row)的 状态   -->
                <!-- change 状态发生变化时的回调函数   需要传入 id 和状态-->
                <el-switch v-model="scope.row.mg_state" @change="handleChangState(scope.row.id,scope.row.mg_state)" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <!-- 模板 -->
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" plain circle @click="handleEidt(scope.row.id)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" plain circle @click="handleChangdelete(scope.row.id)">

                </el-button>
                <el-button size="mini" type="success" icon="el-icon-check" plain circle @click="handleChangRole(scope.row.id)"></el-button>
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

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total,
     sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 添加用户 对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd" width="40%" @close="handleChangCloss(`ruleFormAdd`)">
        <el-form :model="formdata" :rules="rules" ref="ruleFormAdd">
            <el-form-item label="用户名" label-width="120px" prop="username">
                <el-input v-model="formdata.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="120px" prop="password">
                <el-input v-model="formdata.password" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" label-width="120px" prop="repwd">
                <el-input v-model="formdata.repwd" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="120px" prop="email">
                <el-input v-model="formdata.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" label-width="120px" prop="mobile">
                <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="handleAdd()">添加</el-button>
        </div>
    </el-dialog>

    <!-- 修改 对话框 -->
    <el-dialog title="修改用户" :visible.sync="dialogFormVisibleEdit" width="40%" @close="handleChangCloss(`ruleFormEdit`)">
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
    </el-dialog>

    <!-- 操作 -->
    <el-dialog title="操作" :visible.sync="dialogFormVisibleRole" width="40%" @close="handeleColseRole">
        <el-form :model="formdata">
            <el-form-item label="用户名" label-width="120px">
                {{formdata.username}}
            </el-form-item>

             <el-form-item label="用户名" label-width="120px">
            <el-select v-model="formdata.rid" placeholder="请选择">
                <el-option
                 v-for="item in roles"
                  :key="item.id" 
                  :label="item.roleName"
                   :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="handleEditRole">修改</el-button>
        </div>
    </el-dialog>
</el-card>

<!-- 分页栏 -->
</template>

<script>
export default {
    data() {
        var validateRepwd = (rule, value, callback) => {
            if (value === '' || value === undefined) {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formdata.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        }
        var validateReEmail = (rule, value, callback) => {
            // 邮箱正则表达式
            let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (value === '' || value === undefined) {
                callback(new Error('请输入邮箱'));
                // 判断正则表达式 
            } else if (!reg.test(value)) {
                callback(new Error('邮箱格式不合法！'));
            } else {
                callback();
            }
        }
        var validateRemobile = (rule, value, callback) => {
            // 邮箱正则表达式
            let reg = /^1[3-9]\d{9}$/
            if (value === '' || value === undefined) {
                callback(new Error('请输入手机号'));
                // 判断正则表达式 
            } else if (!reg.test(value)) {
                callback(new Error('手机号格式不合法！'));
            } else {
                callback();
            }
        }
        return {
            users: [], // 用户数据
            pagenum: 1, // 当前页
            pagesize: 2, // 每页条数
            total: 0, //总条数
            chaxun: '', //查询字段
            dialogFormVisibleAdd: false, //添加用户对话框
            dialogFormVisibleEdit: false, //修改用户对话框
            dialogFormVisibleRole: false, //  操作
            loading:false, //加载动画
            roles: [], //角色列表
            formdata: {}, //表单
            //效验规则
            rules: {
                username: [{
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
                password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 16,
                        message: '长度在 2 到 16 个字符',
                        trigger: 'blur'
                    }
                ],
                repwd: [{
                    required: true,
                    //自定义效验规则
                    validator: validateRepwd,
                    trigger: 'blur'
                }],
                email: [{
                    required: true,
                    //自定义效验规则
                    validator: validateReEmail,
                    trigger: 'blur'
                }],
                mobile: [{
                    required: true,
                    //自定义效验规则
                    validator: validateRemobile,
                    trigger: 'blur'
                }],
            },
        }
    },
    created() {
        //查询数据
        this.lodaData()
    },
    methods: {
        // 清空分配角色数据
        handeleColseRole(){
         this.formdata={}
        },
        // 分配角色
        handleEditRole(){
            // id 等于 undefined 就提交不了
            if (this.formdata.rid=== undefined) {
                this.$message.warning('请选择分配角色')
                return
            }
            // 发送请求 分配角色
            this.$http.put(`users/${this.formdata.id}/role`,this.formdata)
                .then(res => {
                    console.log(res);
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                       this.dialogFormVisibleRole= false
                       this.$message.success(msg)
                       
                    }
                }).catch(res => {})


        },
        // 打开角色对话框
        handleChangRole(id) {
            this.dialogFormVisibleRole = true
            this.$http.get(`users/${id}`)
                .then(res => {
                    console.log(res);
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.formdata = data
                    }
                }).catch(res => {})
            //   加载角色列表
            this.$http.get(`roles`)
                .then(res => {
                    console.log(res);
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.roles = data
                        // 处理-1 如果是 -1的话 角色请选择
                        // this.formdata.rid= data.rid==-1
                        // ?data.rid=undefined:data.rid
                    }
                }).catch(res => {})

        },
        //修改用户
        handleEdit(FormName) {
            // 效验表单
            this.$refs[FormName].validate((valid) => {
                if (valid) {
                    this.$http.put(`users/${this.formdata.id}`, this.formdata)
                        .then(res => {
                            console.log(res);
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
                                //对话框关闭
                                this.dialogFormVisibleEdit = false
                            }
                        }).catch(res => {})

                } else {
                    return false;
                }
            });
        },
        //修改页面
        handleEidt(id) {
            //打开对话框
            this.dialogFormVisibleEdit = true
            this.$http.get(`users/${id}`)
                .then(res => {
                    console.log(res);
                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.formdata = data
                    }
                }).catch(res => {})
        },
        // 添加用户
        handleAdd() {
            this.$refs['ruleFormAdd'].validate((valid) => {
                if (valid) {
                    this.$http.post(`users`, this.formdata)
                        .then(res => {
                            console.log(res);
                            let {
                                data,
                                meta: {
                                    msg,
                                    status
                                }
                            } = res.data
                            if (status === 201) {
                                this.lodaData()
                                this.$message.success(msg)
                                //对话框关闭
                                this.dialogFormVisibleAdd = false
                            }
                        }).catch(res => {})

                } else {
                    return false;
                }
            });
        },
        // 关闭对话框 清空数据
        handleChangCloss(formName) {
            // 清除表单 数据
            this.formdata = {}
            // 清除表单 效验
            this.$refs[formName].resetFields();
        },
        //删除用户
        handleChangdelete(id) {
            this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`users/${id}`)
                    .then(res => {
                        console.log(res);
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
        //修改用户信息
        handleChangState(id, state) {
            this.$http.put(`users/${id}/state/${state}`)
                .then(res => {
                    console.log(res);
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
        async   lodaData() {
          this.loading=true
         await   this.$http.get(`users?query=${this.chaxun}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                .then(res => {
                    console.log(res);

                    let {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.users = data.users
                        // 当前页
                        this.pagenum = data.pagenum
                        //总条数
                        this.total = data.total

                    }
                })
                 this.loading=false
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
