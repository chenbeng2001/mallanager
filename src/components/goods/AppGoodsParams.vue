<template>
<el-card class="box-card">

    <!-- 面包屑导航 -->
    <cus-breadcrumb levl1="商品管理" levl2="分类参数"></cus-breadcrumb>

    <el-alert title="只允许第三级分类设置参数" type="error" class="tile">
    </el-alert>
    <!-- 商品分类 -->
    <el-row>
        <span>商品分类 </span>
        <!-- 分类参数 -->
        <el-cascader :options="categorys" :props="defaultProps" v-model="selectOptions" clearable @change="handleCateChange()"></el-cascader>
    </el-row>

    <!-- 标签页   value 默认选中 第一个 标签页 -->
    <el-tabs type="card" value="1" class="tile">

        <el-tab-pane label="动态参数" name="1">
            <!-- 设置参数按钮 -->
            <el-button type="danger" @click="dialogFormVisibleDy=true">添加动态参数</el-button>

            <!-- 数据表格 -->
            <el-table :data="goodsDyParams" style="width: 100%" v-loading="loading">
                <!-- 展开行 -->
                <el-table-column type="expand">

                    <!-- 动态编辑的 tag -->
                    <template slot-scope="props">
                        <el-tag :key="tag" v-for="tag in props.row.attr_vals" closable :disable-transitions="false" @close="handleClose(props.row,tag)">
                            {{tag}}
                        </el-tag>
                        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(props.row)" @blur="handleInputConfirm(props.row)">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                    </template>

                </el-table-column>

                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="attr_name" label="属性名称">
                </el-table-column>

                <el-table-column label="操作">
                    <!-- 模板 -->
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" plain circle @click="handleEidt(scope.row.attr_id)"></el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" plain circle @click="handleChangdelete(scope.row.attr_id)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-tab-pane>

        <el-tab-pane label="静态参数" name="2">

            <el-button type="danger">添加静态参数</el-button>
            <!-- 数据表格 -->
            <el-table :data="goodsStatirmas" style="width: 100%" v-loading="loading">
                <el-table-column type="index" label="#" width="50">
                </el-table-column>
                <el-table-column prop="attr_name" label="属性名称" width="200">
                </el-table-column>

                <el-table-column label="操作" width="200">
                    <!-- 模板 -->
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" plain circle @click="handleEidt(scope.row.goods_id)"></el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" plain circle @click="handleChangdelete(scope.row.goods_id)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-tab-pane>

        <!-- 添加用户 动态 -->
        <el-dialog :title="(formdata.attr_id==null?'添加':'修改')+'参数'" :visible.sync="dialogFormVisibleDy" width="40%" @closed="handleChangCloss">
            <el-form :model="formdata">
                <el-form-item label="参数名称" label-width="120px">
                    <el-input v-model="formdata.attr_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="参数属性" label-width="120px">
                            <el-input v-model="formdata.attr_vals" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        &nbsp;&nbsp;&nbsp;属性,逗号隔开
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDy = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd()">确定</el-button>
            </div>
        </el-dialog>

    </el-tabs>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            loading: false, //动画效果
            categorys: [], //分类参列表
            selectOptions: [1, 3, 6], //选中的分类参数
            goodsDyParams: [], //动态参数
            goodsStatirmas: [], //静态参数
            dialogFormVisibleDy: false, // 打开添加框
            formdata: {}, //表单对象
            inputVisible: false,
            inputValue: '',
            defaultProps: { //商品分类数据
                value: 'cat_id', // 分类 ID 实际值
                label: 'cat_name', //   分类名称   显示值
                children: 'children' //分类层级

            },
        }
    },
    created() {
        // 加载分类参数
        this.lodaDataCategory()
        // 调用参数
        this.handleCateChange()
    },
    methods: {

        // 打开动态修改框
        handleEidt(id) {
            this.dialogFormVisibleDy = true, // 打开添加框
                this.$http.get(`categories/${this.selectOptions}/attributes/${id}`)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.formdata = data
                    } else {
                        this.$message.error(msg);

                    }
                }).catch(res => {})

        },
        // 删除 动态参数
        handleChangdelete(id) {
            this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`categories/${this.selectOptions[2]}/attributes/${id}`)
                    .then(res => {
                        let {
                            data,
                            meta: {
                                msg,
                                status
                            }
                        } = res.data
                        if (status === 200) {
                            this.handleCateChange()
                            this.$message.success(msg)
                        }
                    }).catch(res => {})
            }).catch(() => {

            });

        },
        //编辑动态参数
        handleAdd() {
            let req = null
            this.formdata.attr_sel = 'many' //动态参数
            if (this.formdata.attr_id ==null) {
                req = this.$http.post(`categories/${this.selectOptions[2]}/attributes`, this.formdata)
            } else {
                req = this.$http.put(`categories/${this.selectOptions[2]}/attributes/${this.formdata.attr_id}`, this.formdata)
            }
            // 发送请求
            req.then(res => {
                const {
                    data,
                    meta: {
                        msg,
                        status
                    }
                } = res.data
                if (status === 201 || status===200) {
                    this.handleCateChange()
                    this.dialogFormVisibleDy = false
                    this.$message.success(msg)

                } else {
                    this.$message.error();
                    (msg)
                }
            }).catch(res => {})

        },
        handleChangCloss() {
            //关闭对话框
            this.dialogFormVisibleDy = false
            // 清空数据 
            this.formdata = {}
        },
        //   关闭动态标签属性
        handleClose(Dyparams, tag) {
            // 删除该标签
            Dyparams.attr_vals.forEach((item, index) => {
                if (item === tag) {
                    Dyparams.attr_vals.splice(index, 1)
                }
            })
            //  组装提交数据
            let formdata = {
                ...Dyparams
            }
            formdata.attr_vals = Dyparams.attr_vals.lenght === 0 ? '' : Dyparams.
            attr_vals.join(',')
            // 发送请求修改数据
            this.$http.put(`categories/${this.selectOptions[2]}/attributes/${Dyparams.attr_id}`, formdata)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.$message.success(msg)
                    } else {
                        this.$message.error();
                        (msg)
                    }
                }).catch(res => {})

        },
        //  动态标签实现输入
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //    确定添加动态标签
        handleInputConfirm(Dyparams) {
            let inputValue = this.inputValue;
            if (inputValue) {

                Dyparams.attr_vals.push(inputValue);
                //  组装提交数据
                let formdata = {
                    ...Dyparams
                }
                formdata.attr_vals = Dyparams.attr_vals.lenght === 0 ? '' : Dyparams.
                attr_vals.join(',')
                // 发送请求修改数据
                this.$http.put(`categories/${this.selectOptions[2]}/attributes/${Dyparams.attr_id}`, formdata)
                    .then(res => {
                        const {
                            data,
                            meta: {
                                msg,
                                status
                            }
                        } = res.data
                        if (status === 200) {
                            this.$message.success(msg)
                        } else {
                            this.$message.error();
                            (msg)
                        }
                    }).catch(res => {})

            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        //切换参数
        async handleCateChange() {
            this.loading = true
            // 获取分类ID
            let cate_id = this.selectOptions[2]

            // 发送请求获取动态 (获取动态与静态)
            await this.$http.get(`categories/${cate_id}/attributes?sel=many`)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        console.log(data);
                        this.goodsDyParams = data
                        // 处理动态数据
                        this.goodsDyParams.map(item => {
                            item.attr_vals = item.attr_vals !== '' ? item.attr_vals.split(',') : []
                        })
                    }
                }).catch(res => {})
            //静态参数
            await this.$http.get(`categories/${cate_id}/attributes?sel=only`)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.goodsStatirmas = data

                    }
                }).catch(res => {})

            this.loading = false
        },
        // 分类参数
        lodaDataCategory() {
            //发送请求
            this.$http.get(`categories?type=3`)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                        this.categorys = data
                    }
                })
        }
    }
}
</script>

<style>
.tile {
    margin: 30px 0;
}

.el-tag+.el-tag {
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
</style>
