<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card> 
      <!-- 提示区域 -->
       <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon
    :closable="false">
  </el-alert>

  <!-- 步骤条 -->
  <el-steps :active="activeIndex - 0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>

<!-- tabs标签页 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
   label-width="100px" label-position="top">
  <el-tabs v-model="activeIndex" :tab-position="'left'"
   :before-leave="beforeTableave" @tab-click="tabClicked">
    <el-tab-pane label="基本信息" name="0">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>

       <el-form-item label="商品价格" prop="goods_price">
        <el-input v-model="addForm.goods_price" type="number"></el-input>
      </el-form-item>

       <el-form-item label="商品重量" prop="goods_weight">
        <el-input v-model="addForm.goods_weight" type="number"></el-input>
      </el-form-item>

       <el-form-item label="商品数量" prop="goods_number">
        <el-input v-model="addForm.goods_number" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop=" ">
         <el-cascader
            v-model="addForm.goods_cat"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"></el-cascader>
      </el-form-item>
    </el-tab-pane>

    <el-tab-pane label="商品参数" name="1">
      <!-- 渲染表单的Item项 -->
      <el-form-item :label="item.attr_name" v-for="item in manyTableData"
      :key="item.attr_id">
      <!-- 复选框组 -->
      <el-checkbox-group v-model="item.attr_vals" >
    <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals"
    :key="i" border></el-checkbox>
  </el-checkbox-group>
      
      </el-form-item>
    </el-tab-pane>

    <el-tab-pane label="商品属性" name="2">
      <el-form-item :label="item.attr_name"
      v-for="item in onlyTableData" :key="item.attr_id">
      <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>

    <el-tab-pane label="商品图片" name="3">
      <!-- action为图片要上传到的后台api地址 -->
      <el-upload
  :action="this.$http.defaults.baseURL + 'upload'"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :on-success="handleSuccess"
  list-type="picture" :headers="headerObj" >
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
      <!-- 富文本编辑器组件 -->
      <quill-editor v-model="addForm.goods_introduce">

      </quill-editor>
      <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>

  </el-form>

    </el-card>
  
  <!-- 图片预览对话框 -->
  <el-dialog
  title="图片预览"
  :visible.sync="previewVisible"
  width="50%">
  <!-- <img :src="previewPath" alt=""> -->

   <el-image 
    style="width: 100px; height: 100px"
    :src="previewPath"
  >
  </el-image>
</el-dialog>

  </div>
</template>

<script>
export default {
  data(){
    return {
      activeIndex:'0',
      //添加商品的表单数据对象
      addForm:{
        goods_name : '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat:[],
        // 上传图片的数组
        pics:[],
        // 商品详情描述
        goods_introduce:'',
        //添加商品的提交时的参数列表数组
        attrs:[]
      },
      //添加商品的表单验证对象
      addFormRules:{
        goods_name:[
          {required:true,message: '请输入商品名',trigger:'blur'}
        ],
        goods_price:[
          {required:true,message: '请输入商品价格',trigger:'blur'}
        ],
         goods_weight:[
          {required:true,message: '请输入商品重量',trigger:'blur'}
        ],
         goods_number:[
          {required:true,message: '请输入商品数量',trigger:'blur'}
        ],
      },
      //商品分类列表
      catelist:[],
      //级联选择器的定义对象
      cateProps:{
        expandTrigger: 'hover',
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      //动态参数列表
      manyTableData:[],
      //静态属性列表
      onlyTableData:[],
      //上传图片请求头的对象,携带token
      headerObj:{
        Authorization:
        window.sessionStorage.getItem('token')
      },
      //触发图片预览事件时为他赋值
      previewPath:'',
      previewVisible:false,
      
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类数据失败')
      }
      this.catelist = res.data
      console.log(this.catelist);
    },
    //级联选择器选中项的变化监听事件
    handleChange(){
      console.log(this.addForm.goods_cat);
      //没选中三级分类就清空
      if(this.addForm.goods_cat.length !== 3){
        this.addForm.goods_cat = []
      }

    },
    //标签切换之前
    beforeTableave(activeName,oldActiveName){
      // console.log('即将离开的标签页的名字' + oldActiveName);
      // console.log('去往的标签页的名字' + activeName);
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
        this.$message.error('请选择商品分类')
        return false
      }
    },
    //tab切换
    async tabClicked(){
      if(this.activeIndex === '1'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
        {params:{sel:'many'}})
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('获取动态参数列表失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ?
          [] : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      
      }else if (this.activeIndex === '2'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'only'}
        })
        if(res.meta.status !== 200){
          return this.$message.error('请求静态属性失败')
        }
        this.onlyTableData = res.data
      }

    },
    //图片预览事件
    handlePreview(file){
      console.log(file);
      const pre = file.response.data.url.slice(22)
      this.previewPath = this.$http.defaults.baseURL + pre
      
      console.log(this.previewPath);
      this.previewVisible = true
    },
    //处理移除图片操作
    handleRemove(file){
      console.log(file);
      // 删除图片的临时路径
      const filePath =  file.response.data.tmp_path
      //从pics数组中找到这个图片的索引值
      const i = this.addForm.pics.findIndex(x => 
      x.pic === filePath)
      // 调用splicd方法把图片从pics数组中删除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm); 
    },
    //监听图片上传成功后的事件
    handleSuccess(response){
      //1.拼接得到一个图片信息对象
      const picInfo = {pic: response.data.tmp_path}
      //2.将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo)
     
    },
    //添加商品
    add(){
      this.$refs.addFormRef.validate(async valid => {
        if(!valid){
          return this.$message.error('请填写必要的表单项') 
        }
        //其他的业务逻辑
        const form = JSON.parse(JSON.stringify(this.addForm))
        form.goods_cat = form.goods_cat.join(',')
        //处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {attr_id:item.attr_id,
          attr_value: item.attr_vals.join(' ')}
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {attr_id:item.attr_id,
          attr_value: item.attr_vals}
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form);
        const {data:res} = await this.$http.post('goods', form)
        if(res.meta.status !==201){
          console.log(res);
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed:{
      cateId(){
        if(this.addForm.goods_cat.length === 3){
          const newcateId = this.addForm.goods_cat[2] + 0
          return newcateId
        }
        return null
      }
    }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.btnAdd{
  margin-top: 15px;
}
</style>