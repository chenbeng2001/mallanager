<template>
    <!-- 定义公共组件：自定义面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{levl1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{levl2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
    export default {
        props:['levl1','levl2']
    }
</script>

<style>

</style>