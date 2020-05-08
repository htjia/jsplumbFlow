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
              @click="handleAdd" ><svg-icon icon-class="add"/> 配置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container">
      <div style="height: calc(100vh - 282px);">
        <div v-for="item in list" :key="item.id" class="cabinet">
          <div style="position: absolute;">
            <el-dropdown trigger="click" class="dosnw" style="margin-left: 90px;" @command="tableClick">
              <el-button class="updateico" style="font-size: 18px" icon="el-icon-s-operation" size="mini" type="primary"/>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  查看表结构
                </el-dropdown-item>
                <el-dropdown-item>
                  添加数据标签
                </el-dropdown-item>
                <el-dropdown-item>
                  预览数据
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="cabinet-num"><svg-icon icon-class="chendishuju"/></div>
          <el-tooltip :content="item.name" effect="dark" placement="top">
            <div class="cabinet-name">{{ item.name }}</div>
          </el-tooltip>
        </div>
      </div>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[10, 20, 50]"
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
      title="数据标签库"
      width="800px">
      <div class="input-item" style="margin-right: 0px;float:right">
        <el-button
          size="small"
          type="primary"
          @click="handleAdd" ><svg-icon icon-class="add"/> 新增</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="400px"
        border
        fit>
        <el-table-column align="center" label="序号" width="45">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="标签类型" align="center" min-width="180px" prop="name"/>
        <el-table-column label="标签名称" align="center" prop="remark" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" prop="status" width="350px">
          <template slot-scope="scope">
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
            >禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('programForm')">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="查看表结构"
      width="500px">
      <div>
        数据表名称：设备xxx数据表
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="400px"
        border
        fit>
        <el-table-column align="center" label="序号" width="45">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="字段名" align="center" min-width="180px" prop="name"/>
        <el-table-column label="类型" align="center" prop="remark" show-overflow-tooltip/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('programForm')">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="添加数据标签"
      width="500px">
      <div>
        数据表名称：设备xxx数据表
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="400px"
        border
        fit>
        <el-table-column align="center" label="序号" width="45">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="字段名" align="center" min-width="180px" prop="name"/>
        <el-table-column label="类型" align="center" prop="remark" show-overflow-tooltip/>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm('programForm')">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      title="预览数据"
      width="800px">
      <div>
        数据表名称：设备xxx数据表
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        height="400px"
        border
        fit>
        <el-table-column align="center" label="序号" width="45">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="字段名" align="center" min-width="180px" prop="name"/>
        <el-table-column label="类型" align="center" prop="remark" show-overflow-tooltip/>
      </el-table>
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        :total="totalPage"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .updateico {
    background: #d2ecec;
    border: #d2ecec;
    color:#009494;
    padding: 0px;
  }
  .cabinet{
    float: left;
    width: 112px;
    height: 112px;
    border: 1px solid #86cccc;
    background: #d2ecec;
    margin-bottom: 15px;
    margin-right: 15px;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
  }
  .cabinet.cabinetalert{
    background: #f56c6c;
    color: #fff !important;
  }
  .cabinet.cabinetalert .cabinet-name, .cabinet.cabinetalert .icon-span{
    color: #fff !important;
  }
  .cabinet{
    float: left;
    width: 112px;
    height: 112px;
    border: 1px solid #86cccc;
    background: #d2ecec;
    margin-bottom: 15px;
    margin-right: 15px;
    text-align: center;
    cursor: pointer;
  }
  .cabinet.cabinetalert{
    background: #f56c6c;
    color: #fff !important;
  }
  .cabinet.cabinetalert .cabinet-name, .cabinet.cabinetalert .icon-span{
    color: #fff !important;
  }
  .cabinet-num{
    font-size: 40px;
    color: #009494;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .cabinet-name{
    margin-top: 5px;
    font-size: 12px;
    width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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
