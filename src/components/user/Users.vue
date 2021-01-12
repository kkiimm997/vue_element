<template>
  <div>
    <!-- 面包屑导航 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
<!-- 卡片视图和栅格布局 -->
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="8">
        <!-- 搜索和添加区域 -->
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable="" @clear="getUserList">
      <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
    </el-input>
      </el-col>
      <el-col :span="4"><el-button type="primary" @click="addUserButton">添加用户</el-button></el-col>
      </el-row>   

      <!-- 用户列表 -->
      <el-table :data="userlist" border stripe="">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- 新版写法应该为template v-slot="scope" -->
          <template slot-scope="scope">
                <el-switch
                   v-model="scope.row.mg_state"  @change="userStateChanged(scope.row)"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
          </template></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改信息" placement="top" :enterable="false">
             <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="删除信息" placement="top" :enterable="false">
               <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false"> 
                 <!-- 分配角色按钮 -->
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>

  <!-- 添加用户对话框 -->
  <el-dialog
  title="提示"
  :visible.sync="addDialogVisible"
  width="50%" @close='addDialogClosed'>
  <!-- 内容主体 -->
  <span>添加用户</span>
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>

<!-- 修改用户的对话框 -->
<el-dialog
  title="修改用户信息"
  :visible.sync="editDialogVisable"
  width="50%" @close="editDialogClose">
 <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
   <!-- 用户名 -->
  <el-form-item label="用户名">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <!-- 邮箱 -->
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email" ></el-input>
  </el-form-item>
  <!-- 手机 -->
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
</el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisable = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>

</div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
     var checkMobile = (rule, value, cb) => {
      const regMobile = /^(1[3|5-9])\d{9}$/
      if(regMobile.test(value)){
        return cb()
      }
      cb(new Error('请输入合法手机号'))
    }
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      //添加用户对话框的显示
      addDialogVisible: false,
      
      //添加用户的表单数据
      addForm: {
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //添加用户表单验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "用户名长度在5~10字符之间",
            trigger: "blur",
            mobile:''
          },
        ],
        password:[
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "密码长度在5~10字符之间",
            trigger: "blur",
          },
        ],
        email:[
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {validator:checkEmail, trigger:['blur','change']}
          // {required:true,type:'email',trigger:['blur','change'],message:'请输入邮箱'}
        ],
        mobile:[
          { required: true, message: "请输入手机", trigger: "blur" },
            {validator:checkMobile, trigger:['blur','change']}
        ]
      },
      //修改用户对话框的显示
      editDialogVisable: false,
      //查询到的用户信息对象
      editForm:{},
      // 修改表单的验证规则对象
      editFormRules: {
        email:[
          {required:true,message:'请输入用户邮箱',  trigger:'blur'},
          {validator:checkEmail,trigger:['blur','change']}
        ],
          mobile:[
          { required: true, message: "请输入手机", trigger: "blur" },
            {validator:checkMobile, trigger:['blur','change']}
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页码的改变事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听switch开关状态的改变
    async userStateChanged(userInfo) {
      console.log(userInfo);
      // this.$http.put('users/:uId/state/:type')用模板字符串动态传入uId和type
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新状态成功");
    },
    addUserButton() {
      //显示添加用户对话框
      this.addDialogVisible = true;
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields() 
    },
    //添加用户对话框确定键
     addUser(){
      //valid为返回的总验证结果
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid);
        if(!valid) return 
        //发起添加用户的网络请求
        const {data:res} = await this.$http.post('users', this.addForm)
        if(res.meta.status !== 201) this.$message.error('添加用户失败')
        this.$message.success('添加用户成功！')
        //隐藏对话框
        this.addDialogVisible = false
        // 重新获取用户数据
        this.getUserList()
      })
    },
    //展示用户信息编辑页面
    async showEditDialog(id){
      this.editDialogVisable = true
      const {data : res} = await this.$http.get('users/' + id)
      console.log(id);
      if(res.meta.status !== 200)return this.$message.error('查询用户信息失败')
      this.editForm = res.data
    },
    //监听修改对话框的关闭
    editDialogClose(){
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid);
        if(!valid)return this.$message.error('请修改您的信息')
        const {data:res} = await this.$http.put('users/' + this.editForm.id,{email:this.editForm.email,
        mobile:this.editForm.mobile})
        console.log(res);
        if(res.meta.status !== 200) return this.$message.error('更新用户信息失败')
        // this.editForm = res
        // 关闭对话框
        this.editDialogVisable = false
        //刷新数据列表
        this.getUserList()
        //提示修改成功
        this.$message.success('更新用户信息成功')
      })
      
    },
    async removeUserById(id){
       const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
         
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        //选择确定则返回confirm字符串
        console.log(confirmResult);
        if(confirmResult !== 'confirm'){
          return this.$message.info('已取消删除')
        }
        const {data:res} = await this.$http.delete('users/' + id)
        if(res.meta.status !== 200) return this.$message.error('删除用户失败')
        this.getUserList()
    }
  },
};
</script>

<style scoped>
</style>