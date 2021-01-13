<template>
  <div>
      <!-- 面包屑导航 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card>
    <!-- 添加角色按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="addRoleButton">添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 角色列表 -->
    <el-table :data="roleList" border stripe>
      <!-- expand展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
         <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'','vcenter']" 
         v-for="(item1, i1) in scope.row.children" :key="item1.id"> 
           <!-- 渲染一级权限 -->
           <el-col :span="5">
             <el-tag closable 
             @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
             <i class="el-icon-caret-right"></i>
           </el-col>
          <!-- 二三级权限 -->
           <el-col :span="19">
             <!-- for循环嵌套渲染二级权限 -->
             <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']"
              v-for="(item2,i2) in item1.children" :key="item2.id">
               <el-col :span="6">
                 <el-tag type="success" closable 
                 @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                 <i class="el-icon-caret-right"></i>
               </el-col>
               <!-- 三级权限 -->
               <el-col :span="18">
                 <el-tag type="warning" closable @close="removeRightById(scope.row, item3.id)"
                 v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
               </el-col>
             </el-row>
           </el-col>
         </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-search" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialogVisible(scope.row)">分配权限</el-button>
          
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 为角色分配权限对话框 -->
  <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%" @close="setRightDialogVisibleClosed">
  <!-- 树形组件 -->
 <el-tree :data="rightslist" :props="treeProps" 
 show-checkbox node-key="id" default-expand-all 
 :default-checked-keys="defKeys" ref="treeRef"></el-tree>

  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
  </el-dialog>

  <!-- 编辑角色信息对话框 -->
  <el-dialog
  title="修改角色信息" @close="editRoleDialogClose"
  :visible.sync="editRoleDialogVisable"
  width="50%" >
 <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="70px">
   <!-- 角色名 -->
  <el-form-item label="角色名" prop="roleName">
    <el-input v-model="editRoleForm.roleName"></el-input>
  </el-form-item>
  <!-- 角色简述 -->
  <el-form-item label="描述" prop="roleDesc">
    <el-input v-model="editRoleForm.roleDesc"></el-input>
  </el-form-item>
  
</el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleDialogVisable = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
</el-dialog>

<!-- 添加角色对话框 -->
  <el-dialog
  title="添加角色"
  :visible.sync="addRoleDialogVisible"
  width="50%" >
  <!-- 对话框内容主体 -->
  <el-form :model="addRoleForm" :rules="editRoleFormRules" ref="addRoleFormRef" label-width="70px"> 
      <!-- 角色名 -->
  <el-form-item label="角色名" prop="roleName">
    <el-input v-model="addRoleForm.roleName"></el-input>
  </el-form-item>
  <!-- 角色简述 -->
  <el-form-item label="描述" prop="roleDesc">
    <el-input v-model="addRoleForm.roleDesc"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
  data(){
    return {
      //所有角色列表资料
      roleList:[],
      //控制分配权限对话框
      setRightDialogVisible:false,
      //所有权限的数据
      rightslist:[],
      //树形控件的属性绑定对象
      treeProps:{
        label:'authName',
        children:'children'
      },
      //默认的选定的权限keys数组
      defKeys:[],
      //当前行的角色的id
      roleId:'',
      //显示修改角色页面
      editRoleDialogVisable:false,
      //查询到的角色的信息
      editRoleForm:{},
      //修改角色的规则
      editRoleFormRules:{
        roleName:[
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 2,
            max: 6,
            message: "角色名长度在2~6字符之间",
            trigger: "blur",
            mobile:''
          }
        ],
        roleDesc:[
          { required: true, message: "请输入角色简述", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "简述长度在3~10字符之间",
            trigger: "blur",
          },
        ],
      },
        //添加角色的对话框显示
        addRoleDialogVisible:false,
        // 添加角色的表单数据
        addRoleForm:{
          roleName:'',
          roleDesc:''
        }
    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    //获取所有角色列表
    async getRolesList(){
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !== 200) return this.$message.error('获取角色列表数据失败');
      this.roleList = res.data
      console.log(this.roleList);
    },
    async removeRightById(role, rightId){
      const confirmResult = await this.$confirm('此操作将永久删除该权限，是否继续','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm')return this.$message.info('取消删除操作')
      
      const {data:res} = await this.$http.delete
      (`roles/${role.id}/rights/${rightId}`)

      if(res.meta.status !== 200)return this.$message.error('删除权限失败')
      //重新取一下数据
        role.children = res.data
    },
    //打开设置权限对话框时
    async showSetRightDialogVisible(role){
      
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200)return this.$message.error('获取权限数据失败')
      // 保存取得的权限数据
      this.rightslist = res.data
      
      //递归获得三级节点的id
      this.getLeafKeys(role,this.defKeys)

      this.setRightDialogVisible = true
      //当前行的角色的id
      this.roleId = role.id
    },
    //通过递归获取角色所有三级权限的id，并保存到defKeys
    getLeafKeys(node, arr){
      //是三级节点则添加到arr
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    //分配权限对话框关闭的
    setRightDialogVisibleClosed(){
      this.defKeys = []
    },
    //分配权限确定
    async allotRights(){
      const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      //转换成，分割的字符串
      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !== 200){
        return this.$message.error('分配权限失败')
      } 
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = true
    },
    //删除角色按钮
    async removeRoleById(id){
       const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
         
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        //选择确定则返回confirm字符串
        console.log(confirmResult);
        if(confirmResult !== 'confirm'){
          return this.$message.info('已取消删除操作')
        }
        const {data:res} = await this.$http.delete('roles/' + id)
        if(res.meta.status !== 200) return this.$message.error('删除用户失败')
        this.getRolesList()
    },
    //修改角色信息的对话框显示
    async showEditRoleDialog(id){
      const {data:res} = await this.$http.get('roles/' + id)
      if(res.meta.status !== 200) return this.$message.error('查询角色信息失败')
      this.editRoleForm = res.data
      this.editRoleDialogVisable = true
     

    },
     //监听修改对话框的关闭
    editRoleDialogClose(){
      this.$refs.editRoleFormRef.resetFields()
    },
    //确定修改角色信息
    editRoleInfo(){
      this.$refs.editRoleFormRef.validate(async valid => {
        if(!valid) {
          return this.$message.error('请输入正确的角色信息')
        }
        console.log(this.editRoleForm);
        const {data:res} = await this.$http.put('roles/' + this.editRoleForm.roleId,{roleName:this.editRoleForm.roleName,roleDesc:this.editRoleForm.roleDesc})
        if(res.meta.status !== 200){
          return this.$message.error('更改角色信息失败，请重试')
        }
        //刷新数据列表
        this.getRolesList()
        //提示刷新成功
        this.$message.success('更新用户信息成功')
        this.editRoleDialogVisable = false
      })
    },
    //添加角色键
    addRoleButton(){
      this.addRoleDialogVisible = true
    },
    //确定添加角色
    addRole(){
      this.$refs.addRoleFormRef.validate(async valid => {
        if(!valid){
          this.$message.error('请输入正确的角色名和描述')
        }
        const {data:res} = await this.$http.post('roles', this.addRoleForm)
        if(res.meta.status !== 201){
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.getRolesList()
        this.addRoleDialogVisible = false
      })
    }
  }
}
</script>

<style scoped>
  .el-tag{
    margin: 7px;
  }
  .bdtop{
    border-top: 1px solid #eee;
  }
  .bdbottom{
    border-bottom: 1px solid #eee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>