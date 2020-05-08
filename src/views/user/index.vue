<template>
  <PageHeaderLayout >
    <HeaderSearchAdd placeholder-text = "请输入姓名或账号" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit
        stripe>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" prop="name"/>
        <el-table-column label="账号" align="center" prop="username"/>
        <!--<el-table-column label="密码" align="center"><template slot-scope="scope"><span>{{ scope.row.password }}</span></template></el-table-column>-->
        <el-table-column label="操作" align="center" max-width="550px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdatePwd(scope.row)">重置密码</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="totalPage>15"
        :current-page="pageNum"
        :page-sizes="[15, 30, 40]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      title="添加"
      width="500px"
      @close="handleClose('userForm')">
      <el-form ref="userForm" :model="userForm" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" type="text" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input v-model="userForm.userName" type="text" placeholder="请输入账号"/>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input v-model="userForm.passWord" type="password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassWord">
          <el-input v-model="userForm.confirmPassWord" type="password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" multiple placeholder="请选择角色" style="width: 380px;">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.cnname"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('userForm')">确 定</el-button>
        <el-button @click="resetForm('userForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('userForm')">
      <el-form ref="userForm" :model="userForm" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" type="text" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="账号">
          <span v-text="userForm.userName"/>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" multiple placeholder="请选择角色" style="width: 380px;">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.cnname"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('userForm')">确 定</el-button>
        <el-button @click="resetForm('userForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!--<el-dialog
      :visible.sync="configDialogVisible"
      :before-close="handleClose"
      title="配置角色"
      width="500px">
      <el-form ref="configForm" :model="configForm" :rules="configRules" status-icon label-width="60px" label-position="left">
        <el-form-item label="岗位" prop="post">
          <el-select v-model="configForm.post" multiple placeholder="请选择岗位" style="width: 400px;">
            <el-option
              v-for="item in postOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
    <el-form-item label="角色" prop="role">
      <el-select v-model="configForm.role" multiple placeholder="请选择角色" style="width: 400px;">
        <el-option
          v-for="item in roleOptions"
          :key="item.id"
          :label="item.cnname"
          :value="item.id"/>
      </el-select>
    </el-form-item>
      <el-tree
        ref="tree"
        :props="defaultProps"
        :data="treeData"
        style="height: 260px;overflow: auto;border:1px solid #d7d7d7;border-radius: 4px"
        show-checkbox
        node-key="mainId"/>
    </el-form-item>-->
    <!--</el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitConfigForm('configForm')">确 定</el-button>
      <el-button @click="resetForm('configForm')">取 消</el-button>
    </span>
  </el-dialog>-->
  </PageHeaderLayout>
</template>

<script src="./user.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 0px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
