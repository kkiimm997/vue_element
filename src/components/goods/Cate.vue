<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row class="addcate">
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-if="scope.row.cat_level === 2"
            >三级</el-tag
          >
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            @click="showEditDialog(scope.row.cat_id)">编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            @click="removeCateById(scope.row.cat_id)">删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%" @close="addCateDialogClose"
      >
        <!-- 添加分类的表单 -->
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px">
        <!--  -->
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
        <!--  -->
          <el-form-item label="父级分类">
            <!-- option指定数据源 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged" clearable change-on-select=""
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 修改分类信息的对话框 -->
<el-dialog
  title="修改分类信息"
  :visible.sync="editCateDialogVisable"
  width="50%" >
 <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="70px">
   <!-- 分类名 -->
  <el-form-item label="分类名" prop="cat_name">
    <el-input v-model="editCateForm.cat_name"></el-input>
  </el-form-item>
</el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editCateDialogVisable = false">取 消</el-button>
    <el-button type="primary" @click="editCateInfo">确 定</el-button>
  </span>
</el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类的数据列表
      catelist: [],
      // 总数据条数
      total: 0,
      //为tree-table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          //表示当前列的模板名称
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          //表示当前列的模板名称
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          //表示当前列的模板名称
          template: "opt",
        },
      ],
      //添加商品分类对话框的显示
      addCateDialogVisible: false,
      // 添加表单的数据对象
      addCateForm: {
        //将要添加的分类的名称
        cat_name: "",
        //父级分类的Id
        cat_pid: 0,
        //添加分类的等级，默认为一级
        cat_level: 0,
      },

      //添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { require: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //父级分类的列表
      parentCateList: [],
      //父级分类的选择的配置
      cascaderProps:{
         expandTrigger: 'hover' ,
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      //选中的父级分类的Id数组
      selectedKeys:[],
      editCateDialogVisable:false,
      //修改分类的信息对象
      editCateForm:{},
      //修改分类信息表单的验证规则对象
      editCateFormRules:{
        cat_name:[
          {required:true,message:'分类名不能为空',trigger:'blur'},
          {min:2,max:6,trigger:'blur',message:'分类名字符2~6'}
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败");
      }
      //添加商品分类到本地
      this.catelist = res.data.result;
      console.log(res);
      //保存数据条数到本地
      this.total = res.data.total;
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听pagenum 的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    //点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      //点击添加分类按钮时获取父级（1、2级分类数据）
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类数据失败");
      this.parentCateList = res.data;
    },
    //当选择父级分类发生变化时
    parentCateChanged(){
      console.log(this.selectedKeys);
      //如果selectedKeys 数组中的length大于0，则选中数组分类
      if(this.selectedKeys.length > 0){
        //父级分类Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //点击添加新的分类
    addCate(){
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid){return this.$message.error('请输入正确的分类信息')}
        const {data:res} = await this.$http.post('categories',this.addCateForm)
        // console.log(res.data);
        if(res.meta.status !== 201){
          return this.$message.error('添加分类失败')
        }
        this.$message.error('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    //添加分类对话框关闭后,清空表单，以免vue重用
    addCateDialogClose(){
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
    },
    //删除分类按钮
    async removeCateById(id){
      
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        
        if(confirmResult !== 'confirm'){
          return this.$message.info('已取消删除操作')
        }
        const {data:res} = await this.$http.delete('categories/' + id)
        console.log(res);
         if(res.meta.status !== 200) return this.$message.error('删除分类失败')
        this.getCateList()
    },
    //修改分类的对话框i显示
    async showEditDialog(id){
      this.editCateDialogVisable = true
      const{data:res} = await this.$http.get('categories/' + id)
      if(res.meta.status !== 200)return this.$message.error('查询分类失败')
      this.editCateForm = res.data
    },
    //修改分类的表单提交
    editCateInfo(){
      this.$refs.editCateFormRef.validate(async valid => {
        if(!valid)return this.$message.error('请修改你的分类信息')
        const {data:res} = await this.$http.put('categories/' + this.editCateForm.cat_id,{cat_name:this.editCateForm.cat_name})
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('分类修改失败')
        }
        this.editCateDialogVisable = false
        this.getCateList()
        this.$message.success('更新分类信息成功')
      })
    }
  },
};
</script>

<style scoped>
.addcate {
  margin-bottom: 15px;
}
</style>