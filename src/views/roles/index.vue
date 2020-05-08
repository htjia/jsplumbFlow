<template>
  <PageHeaderLayout >
    <HeaderSearchAdd placeholder-text = "请输入角色名称" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
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
        <el-table-column label="角色名称" align="center" prop="cnname"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑</el-button>
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
      width="600px"
      @close="handleClose('roleForm')"
    >
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-position="left" status-icon label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" type="text"/>
        </el-form-item>
        <el-form-item label="权限配置" prop="checkedRouters">
          <div style="margin-left: -30px">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"/>
            <el-checkbox-group v-model="roleForm.checkedRouters" @change="handleCheckedRoutersChange">
              <el-checkbox v-for="router in routers" :label="router.value" :key="router.value">{{ router.name }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('roleForm')">确 定</el-button>
        <el-button @click="resetForm('roleForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="600px"
      @close="handleClose('roleForm')">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" status-icon label-width="80px" label-position="left">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" type="text"/>
        </el-form-item>
        <el-form-item label="权限配置" prop="checkedRouters">
          <div style="margin-left: -30px">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"/>
            <el-checkbox-group v-model="roleForm.checkedRouters" @change="handleCheckedRoutersChange">
              <el-checkbox v-for="router in routers" :label="router.value" :key="router.value">{{ router.name }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('roleForm')">确 定</el-button>
        <el-button @click="resetForm('roleForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>
<script src="./roles.js"></script>
<style scoped>
</style>
