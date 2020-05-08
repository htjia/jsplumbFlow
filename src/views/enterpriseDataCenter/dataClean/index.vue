<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="input-item">
        <span class="input-title">数据清洗名称 </span>
        <el-input v-model="dataName" class="search-input" size="small" placeholder="请输入数据清洗名称" maxlength="20" clearable/>
      </div>
      <div class="input-item" style="margin-right: 0px;">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch" >查询</el-button>
        <el-button
          size="small"
          type="danger"
          @click="clearAll"
        >
          <svg-icon icon-class="clear"/> 重置
        </el-button>
      </div>
      <div class="input-item" style="margin-right: 0px;float:right">
        <el-button
          size="small"
          type="primary"
          @click="handleAdd" ><svg-icon icon-class="add"/> 新增</el-button>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        height="calc(100vh - 290px)"
        element-loading-text="拼命加载中"
        border
        fit
      >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="数据清洗名称" align="center" prop="name"/>
        <el-table-column label="清洗描述" align="center" prop="comment"/>
        <el-table-column label="创建人" align="center" prop="typeMachineName" show-overflow-tooltip>
          <template slot-scope="scope">
            管理员
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" prop="status" width="280">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-caret-right"
              @click="handleInFlow(scope.row)"
            >进入流程</el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeleteRow(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[15, 25, 50]"
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
      title="新增数据清洗"
      width="500px"
      @close="handleClose('dataForm')">
      <el-form ref="dataForm" :model="dataForm" :rules="rules" status-icon label-width="110px" label-position="right">
        <el-form-item label="数据清洗名称" prop="name">
          <el-input v-model="dataForm.name" type="text" placeholder="请输入数据清洗名称"/>
        </el-form-item>
        <el-form-item label="描述" prop="userName">
          <el-input v-model="dataForm.remark" type="textarea" placeholder="请输入描述"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('dataForm')">确 定</el-button>
        <el-button @click="resetForm('dataForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .edit-dialog>>>.el-dialog__body{
    padding: 20px;
  }
  .edit-dialog-table>>>.el-checkbox {
    margin-left: 0px;
  }
  .search-box{
    display: flex;
    flex-direction: row;
  }
  .left-search-box{
    flex-grow: 1;
  }
  .right-btn-box{
    width: 260px;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 200px;
  }
  .app-container{
    position: relative;
    height: calc(100vh - 207px);
  }
  .table-top-btn-group{
    overflow: hidden;
  }
  .table-top-btn-group>div{
    float: left;
    margin-left: 15px;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    border: 1px solid #e2e2e2;
    cursor: pointer;
  }
  .substrate>div:not(:first-child){
    margin-left: 5px;
  }
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .el-checkbox {
    margin-left: 0px;
  }
</style>
