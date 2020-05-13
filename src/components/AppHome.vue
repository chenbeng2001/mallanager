<template>
<el-container class="container">
    <!-- 导航 -->
    <el-header class="header">
        <el-row>
            <el-col :span="20">
                <h2>电商后台管理系统</h2>
            </el-col>
            <el-col :span="4">
                <a href="#" @click.prevent="handeEsc()">退出</a>
            </el-col>
        </el-row>
    </el-header>
    <!-- 侧边栏 -->
    <el-container>
        <el-aside width="200px" class="aside">
            <el-menu default-active="1" class="menu" :unique-opened="true" :router="true">
                <el-submenu :index="index+''" v-for="(item, index) in menus" :key="index">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <el-menu-item-group v-for="(item1, index) in item.children" :key="index">
                        <el-menu-item :index="'/'+item1.path">{{item1.authName}}</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>

            </el-menu>

        </el-aside>
        <!-- 数据展示 -->
        <el-main class="main">
            <!-- 动态路由组件显示  （路由嵌套） -->
            <router-view></router-view>

        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data() {
        return {
            menus: [], //数据列表
        }
    },
    created() {
        //动态加载左侧栏
        this.$http.get(`menus`)
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
                    this.menus = data
                  

                }
            })
    },
    // //在页面加载的时候 判断 token是否为空
    // beforeCreate() {
    //     let token = localStorage.getItem('token')
    //     if (!token) { //true 没有登录 token = null 为空 
    //         //为空  跳转登录’
    //         this.$router.push({
    //             name: 'login'
    //         })
    //         this.$message.error('请先登录')
    //     }
    // },
    methods: {
        handeEsc() {
            //退出系统  清除里面的数据 清除token
            localStorage.clear()
            //跳转系统
            this.$router.push({
                name: 'login'
            })
        }
    },
}
</script>

<style>
.header {
    /* 文本居中 */
    text-align: center;
    background-color: #222;
    color: #fff;
    /* 行高意思是 在容易的什么地方显示 */
    line-height: 60px;
}

.header a {
    color: #fff;
}

.container,
.aside,
.menu {
    height: 100%;
}

.main {
    background-color: #E9EEF3;

}
</style>
