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
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!--              渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!--              渲染二级和三级权限-->
              <el-col :span="19">
                <!--                通过for 循环 嵌套渲染二级权限-->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>

        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>

        <el-table-column prop="path" label="操作">
          <template v-slot:default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editRolesBtn(scope.row.id)"
              size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
              size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDiaglog(scope.row)"
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
          <el-form-item label="角色ID" prop="roleId">
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
        <el-button @click="editRolesVisible = false">取 消</el-button>
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
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesInfo()">确 定</el-button>
      </span>
    </el-dialog>

    <!--分配权限的对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <span>
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all="true"
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
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
      editRoles: {},
      editRolesModels: {},
      addRolesVisible: false,
      addRolesModels: {
        roleId: '',
        roleName: '',
        roleDesc: '',
      },
      // 控制分配权限对话框的可视化
      setRightDialogVisible: false,
      rightsList: [],
      treeProps:{
        label:'authName',
        children:'children',
      },
      defKeys:[],
      // 当前
      roleId:'',

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
      ).catch((err) => err)
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
    async editRolesBtn(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.editRolesVisible = true
      this.editRolesModels = res.data
    },
    editDialogClosed() {
      this.$refs.editRolesRef.resetFields()
    },
    editRolesInfo() {
      this.$refs.editRolesRef.validate(async (valid) => {
        if (!valid) return
        // 发起角色修改的请求
        const { data: res } = await this.$http.put(
          'roles/' + this.editRolesModels.roleId,
          {
            roleName: this.editRolesModels.roleName,
            roleDesc: this.editRolesModels.roleDesc,
          }
        )
        if (res.meta.status !== 200)
          return this.$message.error('修改信息错误！')
        // 关闭对话框
        this.editRolesVisible = false
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
        const { data: res } = await this.$http.post('roles', {
          roleName: this.addRolesModels.roleName,
          roleDesc: this.addRolesModels.roleDesc,
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        this.addRolesVisible = false
        await this.getRolesList()
      })
    },
    showAddRoles() {
      this.addRolesVisible = true
    },
    addDialogClosed() {
      this.$refs.addRolesRef.resetFields()
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消了删除！')
      }
      const { data: res } = await this.$http.delete(
        'roles/' + role.id + '/rights/' + rightId
      )
      if (res.meta.status !== 200) {
        return this.$message.error('取消权限失败')
      }
      this.$message.success('取消权限成功')
      role.children = res.data
      // await this.getRolesList()
    },

    // 展示分配权限的对话框
    async showSetRightDiaglog(role) {
      // 获取所有权限数据
      this.roleId= role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败！')
      }
      // 把获取到的权限数据保存到data中
      this.rightsList = res.data
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible = true
    },

    // 通过递归的方式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node,arr){
      if(!node.children){
        // 如果当前 node节点不包含children属性，则是三级节点
        return arr.push(node.id)
      }
      node.children.forEach(item=>{
        this.getLeafKeys(item,arr)
      })
    },
    setRightDialogClosed(){
      this.defKeys = []
    },
    async allotRights(){
      const keys=[
          ...this.$refs.treeRef.getCheckedKeys(),    // 展开运算符
          ...this.$refs.treeRef.getHalfCheckedKeys(),  // 展开运算符
      ]
      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !== 200){return this.$message.error("分配权限失败！")}
      this.$message.success("分配权限成功！！")
      await this.getRolesList()
      this.setRightDialogVisible=false
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.el-tag
  margin: 7px;

.bdtop
  border-top 1px solid #eee

.bdbottom
  border-bottom 1px solid #eee

.vcenter
  display flex
  align-items center
</style>
