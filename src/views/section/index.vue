<template>
  <PageHeaderLayout>
    <div>
      <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
      <el-tree
        ref="tree2"
        :expand-on-click-node="false"
        :data="data2"
        :props="defaultProps"
        :filter-node-method="filterNode"
        class="filter-tree"
        node-key="id"
        default-expand-all>
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="append(data)">
              添加
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="edit(data)">
              编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="remove(node, data)">
              删除
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="viewDetail(data)">
              查看详情
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="添加"
      width="500px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" status-icon label-width="60px" class="demo-ruleForm" label-position="left">
        <el-form-item label="名称" prop="nodeName">
          <el-input v-model="ruleForm.nodeName" type="text"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="editDialogVisible"
      :before-close="handleClose"
      title="编辑"
      width="500px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" status-icon label-width="60px" class="demo-ruleForm">
        <el-form-item label="名称" prop="nodeName">
          <el-input v-model="ruleForm.nodeName" type="text"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitEditForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout >
</template>
<script src="./index.js"></script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 100px;
  }
</style>

