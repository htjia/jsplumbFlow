<template>
  <PageHeaderLayout >
    <div class="header-search-add height-auto" style="padding-top: 0">
      <div class="input-item">
        <span class="input-title">指标名称 </span>
        <el-input v-model="dataName" class="search-input" size="small" placeholder="请输入指标名称" maxlength="20" clearable/>
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
    <cron-input v-model="cron" @change="change" @reset="reset"/>
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
        <el-table-column label="数据分析名称" align="center" prop="name"/>
        <el-table-column label="分析描述" align="center" prop="comment"/>
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
              @click="handleInFlow(scope.row, scope.$index)"
            >进入流程</el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button
              :disabled="scope.$index < 4"
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
      top="80px"
      class="padding-dialog"
      title="编辑"
      width="1200px"
      @close="handleClose">
      <el-form ref="dataForm" :model="dataForm" :rules="rules" status-icon label-width="60px" label-position="right">
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" size="mini" type="text" placeholder="请输入指标名称"/>
        </el-form-item>
      </el-form>
      <el-row :gutter="15">
        <el-col :span="6">
          <div class="module-container">
            <div class="module-title">
              <div class="module-title-text">选择数据源</div>
            </div>
            <div class="module-content" style="padding: 5px;border: 1px solid #e2e2e2;height: 513px;">
              <el-select v-model="fun" size="small" placeholder="请选择" style="width: 100%;margin-bottom: 5px" @change="selectChange">
                <el-option
                  v-for="item in funList"
                  :key="item"
                  :label="item"
                  :value="item"/>
              </el-select>
              <el-input
                v-model="filterText"
                size="small"
                placeholder="搜索数据表"/>
              <div v-loading="treeLoading" element-loading-text="拼命加载中" style="height: 430px;overflow: auto;margin-top: 5px">
                <el-tree
                  ref="tree"
                  :data="treeData"
                  :props="defaultProps"
                  :filter-node-method="filterNode"
                  class="filter-tree"
                  default-expand-all
                  @node-click="nodeClick"
                />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <!--<div style="height: 180px;margin-bottom: 10px">-->
          <!--<json-editor ref="jsonEditor" v-model="expression" mode="javascript" type="1" @codeChange="textareaChange"/>-->
          <!--</div>-->
          <textarea id="textarea" :disabled="targetColList.length === 0" :rows="8" v-model="expression" type="textarea" style="margin-bottom: 10px" @input="textareaChange"/>
          <el-input v-model="remark" type="textarea" placeholder="请输入业务描述" style="margin-bottom: 10px"/>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch" >检查</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="clearDialogAll"
          >
            <svg-icon icon-class="clear"/>
            清空</el-button>
          <el-row :gutter="10" style="margin-top: 10px">
            <el-col :span="8">
              <div class="module-container">
                <div class="module-title">
                  <div class="module-title-text">字段列表</div>
                </div>
                <div class="module-content" style="padding: 0;border: 1px solid #e2e2e2">
                  <div style="padding: 5px;padding-bottom: 0">
                    <el-input
                      v-model="filterNodeText"
                      size="small"
                      placeholder="搜索字段名"/>
                  </div>
                  <div style="height: 210px;overflow: auto">
                    <div v-for="(item, index) in fieldList" :key="item.name" :class="{'field-active':item.active}" class="field-item" @click="clickItem(item, index)">
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="module-container">
                <div class="module-title">
                  <div class="module-title-text">函数</div>
                </div>
                <div class="module-content" style="padding: 5px;border: 1px solid #e2e2e2">
                  <el-select v-model="fun" size="small" placeholder="请选择" style="width: 100%;margin-bottom: 5px" @change="selectChange">
                    <el-option
                      v-for="item in funList"
                      :key="item"
                      :label="item"
                      :value="item"/>
                  </el-select>
                  <el-input
                    v-model="filterText"
                    size="small"
                    placeholder="输入关键字进行过滤"/>
                  <div v-loading="treeLoading" element-loading-text="拼命加载中" style="height: 170px;overflow: auto;margin-top: 5px">
                    <el-tree
                      ref="tree"
                      :data="treeData"
                      :props="defaultProps"
                      :filter-node-method="filterNode"
                      class="filter-tree"
                      default-expand-all
                      @node-click="nodeClick"
                    />
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="module-container">
                <div class="module-title">
                  <div class="module-title-text">函数说明</div>
                </div>
                <div class="module-content" style="padding: 10px;border: 1px solid #e2e2e2">
                  {{ description }}
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div style="height: 50px;margin-top: 20px">
        <span slot="footer" style="float: right;">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </div>
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
  /*计算列样式*/
  .module-title {
    border: 1px solid #e2e2e2;
    border-bottom: none;
    padding: 4px 15px;
    height: 36px;
  }
  .module-content{
    padding: 0;
    height: 251px;
  }
  .right-module{
    height: 180px;
    border: 1px solid #e2e2e2;
    border-top: none;
    overflow: auto;
    padding: 5px;
    padding-right: 0px;
  }
  .table-title-box{
    border: 1px solid #e2e2e2;
    border-top: none;
    background: #aad7d7;
    border-bottom: 2px solid #aad7d7;
  }
  .table-title{
    display: inline-block;
    width: 49%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    box-sizing: border-box;
  }
  .close-icon:hover{
    color: #009494
  }
  .list-group{
    height: 165px;
    box-sizing: border-box;
  }
  .filed-item{
    border: 1px solid #aad7d7;
    margin: 5px;
    line-height: 28px;
    padding-left: 15px;
    float: left;
    width: 271px;
  }
  .bottom-module-content{
    height: 303px;
    padding: 10px;
    border: 1px solid #e2e2e2;
    border-top: none;
  }
  .search-input{
    width: 150px;
  }
  .padding-dialog>>> .el-form-item--mini.el-form-item{
    width: 50%;
    margin-bottom: 0;
    float: left;
  }
  .padding-dialog>>> .el-tree-node__content{
    height: 28px;
    line-height: 28px;
    border: 1px solid #9dc5ca;
    padding-left: 10px;
    background: rgb(240, 249, 249);
    margin-bottom: 5px;
  }
  .padding-dialog>>> .el-tree-node__content:hover{
    background: rgb(207, 241, 249);
    border: 1px solid #89caca;
  }
  .padding-dialog>>> .el-tree-node:focus>.el-tree-node__content{
    /*background: #89caca;*/
  }
  .padding-dialog>>> .el-table__body tr.current-row>td {
    background-color: #bee8e9;
  }
  .active-item{
    background: #b8eaeb;
    color: #fff;
  }
  #textarea{
    width: 100%;
    border-color: #e2e2e2;
    outline: none;
    padding: 8px;
  }
  #textarea:focus{
    border-color: #009494;
  }
  #textarea:disabled{
    background: #f1f1f1;
  }
  .padding-dialog>>> .el-form-item__label, .padding-dialog>>>.el-form-item__content{
    line-height: 27px;
  }
  .padding-dialog>>> .el-form-item__error {
    position: inherit;
  }
  .padding-dialog>>>.el-form-item {
    margin-bottom: 10px;
  }
</style>
