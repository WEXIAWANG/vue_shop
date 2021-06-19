<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--      添加角色按钮区域-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <!--  角色列表区域  -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>

        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>

        <el-table-column prop="path" label="操作">
          <template v-slot:default="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editRolesBtn(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button type="warning" icon="el-icon-setting"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--    点击编辑角色显示的对话框-->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editRolesVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <span>
        <el-form ref="editRolesRef" :model="editRolesModels" label-width="80px">
          <el-form-item label="角色ID" prop="roleId" >
            <el-input v-model="editRolesModels.roleId"></el-input>
          </el-form-item>
           <el-form-item label="角色名字" prop="roleName">
            <el-input v-model="editRolesModels.roleName"></el-input>
          </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesModels.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible=false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo(editRolesModels.roleId)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

<!--    添加角色的对话框-->
    <el-dialog
        title="添加角色"
        :visible.sync="addRolesVisible"
        width="30%"
        @close="addDialogClosed"
    >
      <span>
        <el-form ref="addRolesRef" :model="addRolesModels" label-width="80px">
           <el-form-item label="角色名字" prop="roleName">
            <el-input v-model="addRolesModels.roleName"></el-input>
          </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesModels.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible=false">取 消</el-button>
        <el-button type="primary" @click="addRolesInfo()"
        >确 定</el-button
        >
      </span>
    </el-dialog>








  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      editRolesVisible: false,
      editRoles:{},
      editRolesModels:{
      },
      addRolesVisible:false,
      addRolesModels:{
        roleId:'',
        roleName:'',
        roleDesc:'',
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
    },
    // async addRoles() {
    //   const { data: res } = await this.$http.post('roles', {})
    // },

    async deleteRoles(id) {
      // 弹框询问是否确认删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消了删除！')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      await this.getRolesList()

    },
    async editRolesBtn(id){
      const {data:res} = await this.$http.get('roles/'+ id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.editRolesVisible = true
      this.editRolesModels = res.data

    },
    editDialogClosed(){
      this.$refs.editRolesRef.resetFields()
    },
    editRolesInfo(){
      this.$refs.editRolesRef.validate(async (valid) =>{
        if(!valid) return
        // 发起角色修改的请求
        const {data:res} = await this.$http.put('roles/'+ this.editRolesModels.roleId,{roleName:this.editRolesModels.roleName,roleDesc:this.editRolesModels.roleDesc})
        if (res.meta.status !== 200)
          return this.$message.error('修改信息错误！')
        // 关闭对话框
        this.editRolesVisible =false
        // 刷新数据列表
        await this.getRolesList()
        // 提示修改成功
        this.$message.success('修改信息成功！')
      })
    },
    addRolesInfo() {
      this.$refs.addRolesRef.validate(async (valid) => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const {data: res} = await this.$http.post('roles', {
          roleName: this.addRolesModels.roleName,
          roleDesc: this.addRolesModels.roleDesc
        })
        if (res.meta.status !== 201) {
          return this.$message.error("添加角色失败！")
        }
        this.$message.success("添加角色成功！")
        this.addRolesVisible = false
        await this.getRolesList()
      })
    },
    showAddRoles(){
      this.addRolesVisible = true
    },
    addDialogClosed(){
      this.$refs.addRolesRef.resetFields()
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>
