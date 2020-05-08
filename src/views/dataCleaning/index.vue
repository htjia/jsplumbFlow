<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="search-box">
        <div class="left-search-box">
          <div class="input-item">
            <span class="input-title">数据清洗名称 </span>
            <el-input v-model="dataname" class="search-input" size="small" maxlength="20" clearable/>
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
        <el-table-column label="数据清洗名称" align="center" min-width="180px" prop="taskCode"/>
        <el-table-column label="清洗描述" align="center" prop="groupName" show-overflow-tooltip/>
        <el-table-column label="创建人" align="center" prop="typeMachineName" show-overflow-tooltip/>
        <el-table-column label="创建时间" align="center" prop="stateName" min-width="140px" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" prop="status" width="230px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="findInfo(scope.row)"
            >查看</el-button>
            <el-button
              size="mini"
              type="default"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="delete"
              @click="deleteItem(scope.row)"
            >删除</el-button>
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
