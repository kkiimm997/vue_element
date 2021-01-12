<template>
<el-container class="home-container">
  <el-header>
    <div>
      <img src="../../assets/img/logo.png" alt="">
      <span>电商后台管理系统</span>
    </div>
  <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  
  <el-container>
    <!-- 页面主体 -->
    <el-aside :width="isCollapse ? '64px':'200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <!-- 侧边栏 -->
     <el-menu unique-opened 
     background-color="#545c64" 
     text-color="#fff" 
     active-text-color="#ffd04b" 
     :collapse="isCollapse"
     :collapse-transition="false"
     router="" :default-active="this.$route.path">
       <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="(item, index) in menulist" :key="item.id">
        <!-- 一级菜单的模板区域 -->
        <template slot="title">
          <i :class="iconArr[index]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
       <el-menu-item :index="'/' + subItem.path " v-for="subItem in item.children" :key="subItem.id">
           <!-- 二级菜单的模板区域 -->
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
       </el-menu-item>
      </el-submenu>
   
    </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
      </el-main>
  </el-container>
</el-container>

</template>

<script>
export default {
  data(){
    return {
      menulist:[],
      iconArr:[ 'iconfont icon-yonghuguanli',
                'iconfont icon-quanxianguanli',
                'iconfont icon-shangpinguanli',
                'iconfont icon-dingdanguanli',
                'iconfont icon-shujutongji'
              ],
              // 是否折叠
      isCollapse:false
    }
  },
  created(){
    this.getMenuList()
  },
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res);
    },
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style scoped>
  .home-container{
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }
  .el-header div{
    display: flex;
    align-items:center
    
  }
  .el-header div span {
    margin-left: 15px;
  }
  .el-header img{
    height: 45px;
  }
  .el-aside{
    background-color: #333744;
  
  }
  .el-menu{
    border-right: none;
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>