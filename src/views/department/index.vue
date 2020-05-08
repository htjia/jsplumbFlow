<template>
  <PageHeaderLayout>
    <HeaderSearchAdd placeholder-text = "请输入组织机构名称" @handleSearch="handleSearch" @handleAdd="handleAdd"/>
    <div class="app-container">
      <tree-table
        :data="list"
        :eval-func="func"
        :eval-args="args"
        :expand-all="expandAll"
        border>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-plus"
              @click="append(scope.row)">添加</el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="edit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              icon="el-icon-view"
              @click="viewDetail(scope.row)">查看详情</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </tree-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="添加"
      width="500px">
      <el-form ref="nodeForm" :model="nodeForm" :rules="rules" status-icon label-width="60px" label-position="left">
        <el-form-item label="名称" prop="nodeName">
          <el-input v-model="nodeForm.nodeName" type="text"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('nodeForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('nodeForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      :before-close="handleClose"
      title="编辑"
      width="500px">
      <el-form ref="nodeForm" :model="nodeForm" :rules="rules" status-icon label-width="60px" label-position="left">
        <el-form-item label="名称" prop="nodeName">
          <el-input v-model="nodeForm.nodeName" type="text"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('nodeForm')">取 消</el-button>
        <el-button type="primary" @click="submitEditForm('nodeForm')">确 定</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout >
</template>
<script src="./department.js"></script>
<style>
  .custom-tree-node {
    flex: .4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 20px;
  }
</style>

