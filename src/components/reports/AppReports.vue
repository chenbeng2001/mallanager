<template>
<el-card class="box-card">

    <!-- 面包屑导航 -->
    <cus-breadcrumb levl1="订单管理" levl2="订单列表"></cus-breadcrumb>
    <!-- 绘制图形区域  -->
    <div id="main" style="width: 800px;height:400px; margin: 30px 0px"></div>

</el-card>
</template>

<script>
var echarts = require('echarts')

export default {
    /**
     * 必须等待页面加载完成
     */
    async mounted() {

        let myChart = echarts.init(document.getElementById('main'));
        //   1. 指定图表的配置项
        var option1 = {
            title: {
                text: '区域销售情况统计'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },

        };
         var option2={}
         
        //  2.发送请求获取配置项数据 
        await this.$http.get(`reports/type/1`)
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
                    //  3. 获取data数据
                 option2=data

                }
            }).catch(res => {})

        // 4. 合并 数据
        let option = {
            ...option1,
            ...option2
        }

        // 4.使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)

    },

}
</script>

<style>

</style>
