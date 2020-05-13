<template>
<div class="login">
    <!-- ref="ruleForm" button按钮   :rules="rules" 表单验证   :model="formdata" 用户名和密码  -->
    <el-form label-position="top" label-width="80px" ref="ruleForm" :rules="rules" :model="formdata" class="from-login">
        <h2>用户登录</h2>
        <el-form-item label="用户名" prop="username">
            <el-input v-model="formdata.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input placeholder="请输入密码" v-model="formdata.password" show-password></el-input>
        </el-form-item> <!--  @click="submitForm('ruleForm')"  传入上面的按钮 判断其他文本框是否是空  -->
        <el-button type="primary" plain class="buttns" @click="submitForm('ruleForm')">登录</el-button>

    </el-form>

</div>
</template>

<script>
export default {
    data() {
        return {
            //表单数据  用户名和密码
            formdata: {
                username: 'admin',
                password: '123456'
            },
            // 表单验证
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
                        message: '请输入明码',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 18,
                        message: '长度在 6 到 18 个字符',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
       //用户登录
        submitForm(formName) {
           //表单验证
            this.$refs[formName].validate((valid) => {
                if (valid) {  //true  验证成功
                    //发送网路请求
                     //登录有 账户和 密码 所以传入 对象进去
                    this.$http.post('login',this.formdata)
                    .then(res=>{
                    // 处理结果  解构
                    let {data,meta:{msg,status}}=res.data
                      if (status === 200) {
                          //提示登录成功
                          this.$message.success(msg)
                           //跳转到 AppHemo 页面
                           localStorage.setItem('token',data.token)
                          this.$router.push({path:`/`})
                          
                      }else{
                           //提示登录失败
                           this.$message.error(msg)
                         } 
                        })  
                         
                     
                        
                   
                } else {
                    return false; 
                }
            }); 
        }

    },
}
</script>

<style>
.login {
    height: 100%;
    background-color: #304150;
    /* flex 必须是父类 */
    display: flex;
    justify-content: center;
    align-items: center;
}

.from-login {
    width: 450px;
    background-color: #fff;
    padding: 20px;
    /* 圆角边框 */
    border-radius: 10px;
}

/* 按钮的大小 */
.buttns {
    width: 100%;
}
</style>
