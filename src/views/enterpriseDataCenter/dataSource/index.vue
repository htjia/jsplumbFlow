<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <!--<div class="input-item">-->
          <!--<span class="input-title">数据源类型 </span>-->
          <!--<el-select v-model="dataType" size="small" class="search-input" placeholder="请选择" clearable>-->
          <!--<el-option-->
          <!--v-for="item in dataTypeList"-->
          <!--:key="item.name"-->
          <!--:label="item.name"-->
          <!--:value="item.name"/>-->
          <!--</el-select>-->
          <!--</div>-->
          <div class="input-item">
            <span class="input-title">数据源名称 </span>
            <el-input v-model="dataName" class="search-input" size="small" placeholder="请输入数据源名称" maxlength="20" clearable/>
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
              @click="handleAdd" ><svg-icon icon-class="add"/> 新增数据源</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="calc(100vh - 290px)"
        border
        fit>
        <el-table-column align="center" label="序号" width="45">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="数据源名称" align="center" min-width="180px" prop="name"/>
        <el-table-column label="数据源类型" align="center" prop="type" show-overflow-tooltip/>
        <el-table-column label="测试情况" align="center" prop="istest" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.istest === 0" style="font-weight:900;color: #1abc9c">已连接</span>
            <span v-if="scope.row.istest === 1" style="font-weight:900;color: #1c84c6">未连接</span>
            <span v-if="scope.row.istest === 2" style="font-weight:900;color: #f56c6c">未测试</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="typeMachineName" show-overflow-tooltip>
          <template slot-scope="scope">
            管理员
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" min-width="140px" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" prop="status" width="160px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteItem(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[10, 30, 40]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="addDialogVisible"
        title="新增数据源"
        width="800px"
        @close="closeDialog('dataForm')">
        <el-form ref="dataForm" :model="dataForm" :rules="rules" size="mini" status-icon label-width="95px" label-position="right">
          <el-form-item label="数据源名称" prop="name">
            <el-input v-model="dataForm.name" type="text" placeholder="请输入数据源名称"/>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="dataForm.remark" type="textarea" placeholder="请输入描述"/>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="dataForm.type" placeholder="请选择" clearable>
              <el-option
                v-for="item in dataTypeList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="主机地址" prop="address">
                <el-input v-model="dataForm.address" type="text" placeholder="请输入主机地址"/>
              </el-form-item>
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="dataForm.userName" type="text" placeholder="请输入用户名"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="端口号" prop="dataPort">
                <el-input v-model="dataForm.dataPort" type="text" placeholder="请输入端口号"/>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="dataForm.password" type="password" placeholder="请输入密码"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="数据库名" prop="dataBase">
            <el-input v-model="dataForm.dataBase" type="text" placeholder="请输入数据库名"/>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button
            v-loading="testLoading"
            style="border: 1px solid #009494; color: #009494"
            @click="handleTest"
          >测试链接</el-button>
          <el-button type="primary" @click="submitForm('dataForm')">确 定</el-button>
          <el-button @click="resetForm('dataForm')">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .app-container{
    position: relative;
    height: calc(100vh - 205px);
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
    width: 180px;
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
