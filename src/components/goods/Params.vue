<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        show-icon
        title="注意：只允许为第三季级分类设置相关参数"
        type="warning"
        :closable="false"
      ></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加tag按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
           <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加tag按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的主体表单Form -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 修改参数的主体表单Form -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      //级联选择框的配置对象
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //级联选择框双向绑定的数组
      selectCateKeys: [],
      //激活的页签名称
      activeName: "many",
      //动态参数列表数据
      manyTableData: [],
      //静态属性列表数据
      onlyTableData: [],
      //添加对话框是否显示
      addDialogVisible: false,
      //添加表单的验证规则对象
      addFormRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }],
      },
      //添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      //修改对话框的显示
      editDialogVisible: false,
      //修改表单的数据对象
      editForm: {},
      //修改表单的验证规则对象
      editFormRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }],
      }
    };
  },
  computed: {
    //如果按钮需要禁用则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    //当前选中的三级分类id
    cateId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[this.selectCateKeys.length - 1];
      }
      return null;
    },
    //动态计算标题文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  created() {
    //获取所有商品分类列表
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.catelist = res.data;
    },
    //级联选择框变化事件的监听
    async handleChange() {
      this.getParamsData();
    },

    //tab页签的点击事件
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    //获取参数的列表数据
    async getParamsData() {
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = [];
        this.manyTableData = []
        this.onlyTableData = []
        return this.$message.error("请选择三级分类");
      }
      //证明选中的是三级的分类
      console.log(this.selectCateKeys);
      //  根据所选分类的id和当前所处面板来发起请求
      const {data: res,} = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName },
      });
      //数据处理，把字符串以逗号分隔开，返回一个数组
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        //控制tag中的文本框的显示和隐藏
        item.inputVisible = false
        // 控制tag中的文本框的文本内容
        item.inputValue = ''
      });

      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("请求参数列表失败");
      }
      this.$message.success("请求参数列表成功");

      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    //点击按钮显示修改的对话框
    async showEditDialog(attr_id) {
      //查询当前参数的信息
      const {
        data: res,
      } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取参数信息失败");
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    //修改对话框关闭的事件,重置修改表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //点击确认按钮，修改参数
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const {
          data: res,
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 200) return this.$message.error("修改参数失败");

        this.$message.success("修改参数成功");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    //根据参数id删除相应的参数
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数，是否继续",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm")
        return this.$message.info("取消了删除操作");

      //删除业务逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除参数失败");

      this.$message.success("删除参数成功");
      this.getParamsData();
    },
    //tag标签的失去焦点事件和回车事件
    async handleInputConfirm(row){
      //内容为零失去焦点时
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //输入合法内容时
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      //发起请求发送到服务器
      this.saveAttrVals(row)
      
    },
    // 将对Attr_vals的操作保存到数据库
    async saveAttrVals(row){
       const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      console.log(res);
      if(res.meta.status !== 200)
      {
        return this.$message.error('添加参数项失败!')
      }

      this.$message.success('修改参数项成功!')
    },
    //点击tag按钮事件
    showInput(row){
      row.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
  //删除对应参数可选项
    handleClose(i, row){
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
};
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}
.input-new-tag{
  width: 200px;
}
</style>