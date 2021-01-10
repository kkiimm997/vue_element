<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/img/logo.png" alt="">
      </div>
      <!-- 登录表单区域 label为文本框前字符-->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width='0px' class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-yonghu"></el-input>
        </el-form-item>
        <!-- 密码 -->
         <el-form-item  prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
         <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
data(){
  return {
    loginForm:{
      username:'admin',
      password:'123456'
    },
    //表单验证规则
    loginFormRules:{
      //验证用户名
      username:[ 
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
      ],
      //验证密码
      password:[
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
      ]
    },
    
  }
},
methods:{
  //点击重置按钮
  resetLoginForm(){
    this.$refs.loginFormRef.resetFields()
  },
  login(){
    this.$refs.loginFormRef.validate(async valid => {
      if(!valid) return
      const {data:res} = await this.$http.post('login',this.loginForm)
      
      if(res.meta.status !== 200) return this.$message.error('登陆失败')
      this.$message.success('登陆成功')

      console.log(res);
      window.sessionStorage.setItem('token',res.data.token)
      this.$router.push('/home')
    })
  }
}
}
</script>

<style scoped>
  .login_container{
    background: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 350px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .avatar_box{
    height: 130px;
    width: 130px;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }
  img{
    height: 100%;
    width: 100%;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>