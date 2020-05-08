<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">报告名称 </span>
            <el-input v-model="dataname" class="search-input" style="width: 300px" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item" style="margin-right: 0px;">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch" >查询</el-button>
          </div>
          <!-- <div class="input-item" style="margin-left: 15px;margin-right: 0px;float:right">
            <el-button
              size="small"
              type="success"
              @click="findInfo('')" ><svg-icon icon-class="daochu"/> 进入报告编辑器</el-button>
          </div> -->
          <div class="input-item" style="margin-right: 0px;float:right">
            <el-button
              size="small"
              type="primary"
              @click="handleAdd" ><svg-icon icon-class="add"/> 新增</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 301px)"
        border
        fit>
        <el-table-column align="center" label="序号" width="45">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="报告名称" align="center" min-width="180px" prop="name"/>
        <el-table-column label="报告描述" align="center" prop="remark" show-overflow-tooltip/>
        <el-table-column label="创建人" align="center" prop="creater" show-overflow-tooltip/>
        <el-table-column label="完成时间" align="center" prop="createTime" min-width="80px" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" prop="status" width="350px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-caret-right"
              @click="findInfo(scope.row)"
            >进入报告</el-button>
            <el-button
              size="mini"
              type="default"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteItem(scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="viewItem(scope.row)"
            >预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="totalPage>10"
        :current-page="pageNum"
        :page-sizes="[10, 30, 40]"
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
      title="新增"
      width="500px"
      @close="handleClose('programForm')">
      <el-form ref="programForm" :model="programForm" :rules="rules" status-icon label-width="120px" label-position="right">
        <el-form-item label="工业报告名称" prop="name">
          <el-input v-model="programForm.name" placeholder="请输入工业报告名称" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="programForm.remark" :rows="5" placeholder="请输入描述" type="textarea" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('programForm')">确 定</el-button>
        <el-button @click="resetForm('programForm')">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="编辑"
      width="500px"
      @close="handleClose('programForm')">
      <el-form ref="programForm" :model="programForm" :rules="rules" status-icon label-width="120px" label-position="right">
        <el-form-item label="工业报告名称" prop="name">
          <el-input v-model="programForm.name" placeholder="请输入工业报告名称" type="text" maxlength="20"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="programForm.remark" :rows="5" placeholder="请输入描述" type="textarea" maxlength="50"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('programForm')">确 定</el-button>
        <el-button @click="resetForm('programForm')">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 205px);
  }
  .app-container >>> .el-table--border{
    border: 1px solid #b2dfdf !important;
  }
  .tab-control span{
    line-height: 50px;
  }
  .el-checkbox {
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
    width: 211px;
  }
  .input-item{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .search-input{
    width: 130px;
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
  .table-top-btn-group>div.active{
    color: #fff;
    background: #009494;
    border-color: #009494;
  }
  .app-container>>> .el-table--border {
    border-top: 2px solid #009494;
  }
  .tree-title{
    text-align: center;
    font-size: 16px;
    background: #d6eeee;
    padding: 12px 15px;
    font-weight: bold;
    border-bottom: 1px solid #aad7d7;
  }
  .tree{
    padding: 15px;
    height: calc(100vh - 300px);
    overflow: auto;
  }
</style>
