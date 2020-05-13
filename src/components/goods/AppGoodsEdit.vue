<template>
<el-card class="box-card">

    <!-- 面包屑导航 -->
    <cus-breadcrumb levl1="商品管理" levl2="商品列表"></cus-breadcrumb>
    <!-- 提示 -->
    <el-alert title="商品修改" type="success" center class="sp"> </el-alert>

    <!-- 步骤条 -->
    <el-steps :active="active*1" align-center finish-status="success" class="sp">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>.
        <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tags 标签 -->
    <el-form label-position="top" label-width="80px" :model="fromData">
        <!-- @tab-click="handleTags()  标签被选中的时候-->
        <el-tabs tab-position="left" class="sp" v-model="active" :before-leave="handleTagsOpen" @tab-click="handleTags()">
            <!--使用: 绑定数据  不能加入 () 括号-->

            <el-tab-pane label="基本信息" name="1">
                <el-form-item label="商品名称">
                    <el-input v-model="fromData.goods_name"></el-input>
                </el-form-item>

                <el-form-item label="商品价格">
                    <el-input v-model="fromData.goods_price"></el-input>
                </el-form-item>

                <el-form-item label="商品重量">
                    <el-input v-model="fromData.goods_weight"></el-input>
                </el-form-item>

                <el-form-item label="商品数量">
                    <el-input v-model="fromData.goods_number"></el-input>
                </el-form-item>
                <!-- 级联下拉 -->
                <el-form-item label="商品分类">
                    <el-cascader :options="categorys" clearable :props="defaultProps" v-model="selectOptions"></el-cascader>
                </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品参数" name="2">
                <!-- 动态参数 根据商品的不同 而变化  -->
                <el-form-item :label="item.attr_name" v-for="(item, index) in goodsDyParams" :key="index">
                    <el-checkbox v-model="item.attr_vals" :label="item1" border v-for="(item1, index) in item.attr_vals" :key="index"></el-checkbox>
                </el-form-item>
            </el-tab-pane>
            <!-- 静态参数 -->
            <el-tab-pane label="商品属性" name="3">
                <el-form-item :label="item.attr_name" v-for="(item, index) in goodsStaticParms" :key="index">
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <!-- 图片上传 -->
            <el-tab-pane label="商品图片" name="4">
                {{fromData.pics}}
                <!--默认为  action post 提交 - action 必须设置全路径 必须设置token-->
                <el-upload action="http://localhost:8888/api/private/v1/upload" list-type="picture-card" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :headers="tokenHeader">
                    <!--上传需要传入token-->
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-tab-pane>

            <el-tab-pane label="商品内容" name="5">
                <!-- 富文本 -->
                <quill-editor v-model="fromData.goods_introduce" />
                <!--  提交按钮 -->
                <div class="aill">
                    <el-button type="success" @click="addBtn()">修改商品</el-button>
                </div>
            </el-tab-pane>

        </el-tabs>
    </el-form>

</el-card>
</template>

<script>
//  安装富文本插件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {
    quillEditor
} from 'vue-quill-editor'

export default {
    data() {
        return {
            active: "1", //tags 标签页选中的值
            fromData: { //商品数据
                goods_cat: [], //商品分类
                pics: [], //图片
                attrs:[],
            },
            categorys: [], //商品分类
            selectOptions: [1, 3, 6], //选中参数分类
            goodsDyParams: [], //商品动态参数
            goodsStaticParms: [], // 商品静态参数
            defaultProps: { //商品分类数据
                value: 'cat_id', // 分类 ID 实际值
                label: 'cat_name', //   分类名称   显示值
                children: 'children' //分类层级
            },
            dialogImageUrl: '', //图片显示的地址
            dialogVisible: false, //图片墙显示
            tokenHeader: { // 设置图片上传 token
                'Authorization': localStorage.getItem('token')
            }
        }
    },
    components: {
        quillEditor
    },
    created() {
        // 加载分类参数
        this.lodaDataCategory()
        //初始化数据
        this.lodataEdit()
    },
    methods: {
        //初始化 数据
        lodataEdit(){
            let id=this.$route.query.id
             this.$http.get(`goods/${id}`)
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
                      this.fromData={
                          goods_id:data.goods_id,
                          goods_name:data.goods_name,
                          goods_price:data.goods_price,
                          goods_number:data.goods_number,
                          goods_weight:data.goods_weight,
                          goods_introduce:data.goods_introduce
                      }
                        //  1. 处理默认选中分类       按照 ，拆分   
                        this.selectOptions=data.goods_cat.split(',')
                      
                    }
                })
        },
        //添加
        addBtn() {
            // 处理goods_cat 合并 
            //  将1 2 3 合并为 1,2,3
            this.fromData.goods_cat = this.selectOptions.join(',')
            // 2，商品参数 =  静态参数  和  动态参数
            let arr1 = this.goodsDyParams.map(item => { //动态参数
                let va1 = item.attr_vals === '' ? '' : item.attr_vals.join(',')
                return {
                    'attr_id': item.attr_id,
                    'attr_value': va1
                }
            })
            let arr2 = this.goodsStaticParms.map(item => { //静态参数
                return {
                    'attr_id': item.attr_id,
                    'attr_value': item.attr_value
                }
            })
            // 将数据合并起来
            this.fromData.attrs=[...arr1,...arr2]
            //发送请求
            this.$http.put(`goods/${this.fromData.goods_id}`,this.fromData)
                .then(res => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = res.data
                    if (status === 200) {
                         this.$message.success(msg);
                         //清空数据
                         this.fromData={}
                         //跳转路由
                         this.$router.push({path:'/goods'})
                    }else{
                          this.$message.error(msg);
                          
                    }
                }).catch(res=>{})
         

        },
        //上传图片验证
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传图片只能是 jpeg 和 png 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //删除图片
        handleRemove(file, fileList) {
            //遍历 formdata.pics 找到需要的   移除的图片 然后数组中移除 response
            this.fromData.pics.forEach((item, index) => {
                if (item.pic === file.response.data.tmp_path) {
                    this.fromData.pics.splice(index, 1) //根据下标( index ) 移除有一个1
                }
            });
        },
        //上传 成功处理     
        handleAvatarSuccess(res, file) {
            console.log(res);
            const {
                meta,
                data
            } = res
            //讲临时目录传递到formdata.pics
            if (meta.status === 200) {
                this.$message.success('图片上传成功')
                this.fromData.pics.push({
                    'pic': data.tmp_path
                })
            } else {
                this.$message.error('图片上传失败')
            }
        },
        // 当标签被选中时
        async handleTags() {
            if (this.active === '2') {
                //商品 动态参数
                await this.loaddataParams('many')
                // 将动态参数分割  将字符串分割成 数组
                this.goodsDyParams.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? '' : item.attr_vals.split(',')
                });
            } else if (this.active === '3') {
                //静态参数列表
                await this.loaddataParams()
            }
        },
        // 分类参数
        async loaddataParams(type = 'only') {
            //   获取分类ID   goods_cat[2] 数组第三位
            let cate_id = this.selectOptions[2]
            const res = await this.$http.get(`categories/${cate_id}/attributes?sel=${type}`)
            if (type === 'many') {
                this.goodsDyParams = res.data.data
            } else {
                this.goodsStaticParms = res.data.data
            }
        },
        // 当前标签页变化的时候
        handleTagsOpen() {
            if (this.selectOptions.length !== 3) {
                this.$message.warning('请选择商品分类！')
                return false //阻止跳转
            }
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

    },

}
</script>

<style>
.sp {
    margin: 35px 0;
}

.aill {
    display: flex;
    justify-content: center;
    margin: 40px 0;
}
</style>
